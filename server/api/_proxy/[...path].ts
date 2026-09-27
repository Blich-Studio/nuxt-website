import type { FetchError, FetchResponse } from 'ofetch'
import type { H3Event } from 'h3'
import {
  defineEventHandler,
  getMethod,
  getRouterParam,
  getQuery,
  getHeaders,
  readBody,
  appendHeader,
  setResponseStatus,
  createError,
} from 'h3'

interface ProxyData extends Record<string, unknown> {
  access_token?: string
  refresh_token?: string
  data?: ProxyData
}

interface RefreshResult {
  accessToken: string | null
  newRefreshToken?: string
}

// Share only in-flight work for the same gateway and presented refresh credential.
// Cross-instance rotation is enforced atomically by the API; never share identities.
const refreshes = new Map<string, Promise<RefreshResult>>()

async function refreshSession(gateway: string, token: string): Promise<RefreshResult> {
  const key = `${gateway}\0${token}`
  const pending = refreshes.get(key)
  if (pending) return pending
  const request = refreshAccessToken(gateway, token)
  refreshes.set(key, request)
  try {
    return await request
  } finally {
    if (refreshes.get(key) === request) refreshes.delete(key)
  }
}

/**
 * Attempt to refresh the access token using the refresh token
 */
async function refreshAccessToken(
  gatewayBaseUrl: string,
  refreshToken: string
): Promise<{ accessToken: string | null; newRefreshToken?: string }> {
  try {
    const response = await $fetch.raw<ProxyData>(`${gatewayBaseUrl}/auth/refresh`, {
      method: 'POST',
      retry: 0,
      timeout: 5000,
      body: { refreshToken },
      headers: { 'Content-Type': 'application/json' },
    })

    const data = response._data?.data ?? response._data
    const accessToken = data?.access_token ?? null
    const newRefreshToken = data?.refresh_token

    console.log('[Proxy] Token refresh successful')
    return { accessToken, newRefreshToken }
  } catch (caught: unknown) {
    const error = caught as FetchError<ProxyData>
    console.error('[Proxy] Token refresh failed:', error?.statusCode || error?.message)
    const status = error?.response?.status || error?.statusCode
    if (status === 401 || status === 403) return { accessToken: null }
    throw createError({ statusCode: 503, statusMessage: 'Session service temporarily unavailable. Please try again.' })
  }
}

/**
 * Extract tokens from cookies
 */
function getTokensFromCookies(cookieHeader: string | undefined): {
  accessToken: string | null
  refreshToken: string | null
} {
  if (!cookieHeader) return { accessToken: null, refreshToken: null }

  const accessMatch = cookieHeader.match(/(?:^|;\s*)blich_access=([^;]+)/)
  const refreshMatch = cookieHeader.match(/(?:^|;\s*)blich_refresh=([^;]+)/)

  return {
    accessToken: accessMatch?.[1] || null,
    refreshToken: refreshMatch?.[1] || null,
  }
}

/**
 * Build forward headers for API requests
 */
function buildForwardHeaders(
  headers: Record<string, string | string[] | undefined>,
  accessToken: string | null
): Record<string, string> {
  const forwardHeaders: Record<string, string> = {}

  if (headers['user-agent']) {
    forwardHeaders['user-agent'] = String(headers['user-agent'])
  }
  if (headers['content-type']) {
    forwardHeaders['content-type'] = String(headers['content-type'])
  }
  if (accessToken) {
    forwardHeaders.authorization = `Bearer ${accessToken}`
  }

  return forwardHeaders
}

/**
 * Set auth cookies on the response
 */
function setAuthCookies(
  event: H3Event,
  accessToken: string | null,
  refreshToken: string | null,
  isLocalhost: boolean
) {
  const secureFlag = isLocalhost ? '' : ' Secure;'

  if (accessToken) {
    // Access token: 15 min expiry
    appendHeader(
      event,
      'set-cookie',
      `blich_access=${accessToken}; Path=/; HttpOnly;${secureFlag} SameSite=Lax; Max-Age=900`
    )
  }
  if (refreshToken) {
    // Refresh token: 7 days expiry
    appendHeader(
      event,
      'set-cookie',
      `blich_refresh=${refreshToken}; Path=/; HttpOnly;${secureFlag} SameSite=Lax; Max-Age=604800`
    )
  }
}

/**
 * Clear auth cookies
 */
function clearAuthCookies(event: H3Event, isLocalhost: boolean) {
  const secureFlag = isLocalhost ? '' : ' Secure;'
  appendHeader(
    event,
    'set-cookie',
    `blich_access=; Path=/; HttpOnly;${secureFlag} SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  )
  appendHeader(
    event,
    'set-cookie',
    `blich_refresh=; Path=/; HttpOnly;${secureFlag} SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
  )
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const gatewayBaseUrl = (config.apiUrl || config.public.apiUrl || '').trim()

  if (!gatewayBaseUrl) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Missing API_URL runtime config',
    })
  }

  // Catch-all routes return an array of path segments in h3/Nitro
  const pathParam = getRouterParam(event, 'path')
  const path = Array.isArray(pathParam) ? pathParam.join('/') : (pathParam || '')
  const targetUrl = `${gatewayBaseUrl.replace(/\/$/, '')}/${path}`
  const method = getMethod(event)
  const query = getQuery(event)
  const headers = getHeaders(event)

  // Check if localhost for secure cookie flag
  const requestHost = headers.host || ''
  const isLocalhost = /^(localhost|127\.0\.0\.1)(:\d+)?$/.test(requestHost)

  // Get tokens from cookies
  const cookieHeader = headers.cookie
  let { accessToken, refreshToken } = getTokensFromCookies(cookieHeader)

  // Read body for non-GET/HEAD requests
  let body = method === 'GET' || method === 'HEAD' ? undefined : await readBody(event)

  // Revocation uses the HttpOnly credential, including after the access token expires.
  if (method === 'POST' && path === 'auth/logout') {
    clearAuthCookies(event, isLocalhost)
    if (!refreshToken) return { success: true }
    body = { refreshToken }
  }
  if (method === 'POST' && path === 'auth/refresh') {
    if (!refreshToken) throw createError({ statusCode: 401, statusMessage: 'Not authenticated' })
    body = { refreshToken }
  }

  /**
   * Make the API request with given access token
   */
  async function makeRequest(token: string | null): Promise<{
    response: FetchResponse<ProxyData> | null
    error: FetchError<ProxyData> | null
    statusCode: number
  }> {
    const forwardHeaders = buildForwardHeaders(headers, token)

    try {
      const res = await $fetch.raw<ProxyData>(targetUrl, {
        method,
        retry: 0,
        timeout: 15000,
        query,
        body,
        headers: forwardHeaders,
      })
      return { response: res, error: null, statusCode: res.status }
    } catch (caught: unknown) {
      const fetchError = caught as FetchError<ProxyData>
      const statusCode = fetchError.response?.status || fetchError.statusCode || 500
      return { response: null, error: fetchError, statusCode }
    }
  }

  // First attempt
  let result = await makeRequest(accessToken)

  // Handle 401 - attempt token refresh (but not for auth endpoints)
  if (
    result.statusCode === 401 &&
    refreshToken &&
    !path.includes('auth/login') &&
    !path.includes('auth/refresh') &&
    !path.includes('auth/logout')
  ) {
    console.log(`[Proxy] 401 on ${method} /${path}, attempting token refresh...`)

    const refreshed = await refreshSession(gatewayBaseUrl, refreshToken)
    if (refreshed.accessToken) {
      accessToken = refreshed.accessToken
      refreshToken = refreshed.newRefreshToken || refreshToken
      // Every waiting response needs its own cookies after rotation.
      setAuthCookies(event, accessToken, refreshToken, isLocalhost)
      result = await makeRequest(accessToken)
    } else {
      clearAuthCookies(event, isLocalhost)
    }
  }

  // Handle errors
  if (result.error) {
    if (result.statusCode === 401 && path !== 'auth/login' && path !== 'auth/logout') clearAuthCookies(event, isLocalhost)
    const errorData = result.error.response?._data || result.error.data
    const errorMessage = [errorData?.message, errorData?.error, result.error.message]
      .find((value): value is string => typeof value === 'string' && value.length > 0) || 'API request failed'

    // Only log non-401 errors or unexpected 401s
    if (result.statusCode !== 401) {
      console.error(`[Proxy Error] ${method} ${targetUrl}:`, {
        status: result.statusCode,
        error: errorMessage,
      })
    }

    throw createError({
      statusCode: result.statusCode,
      statusMessage: errorMessage,
      data: errorData,
    })
  }

  const res = result.response
  if (!res) throw createError({ statusCode: 502, statusMessage: 'Invalid API response' })

  const responseData = res._data
  const tokenData = responseData?.data ?? responseData
  if (method === 'POST' && (path === 'auth/login' || path === 'auth/refresh')) {
    if (tokenData?.access_token) {
      setAuthCookies(event, tokenData.access_token, tokenData.refresh_token ?? null, isLocalhost)
    }
  }
  // Tokens never leave the server proxy, including wrapped responses.
  for (const data of [responseData, responseData?.data]) {
    if (data && typeof data === 'object') {
      delete data.access_token
      delete data.refresh_token
    }
  }
  // Cookie ownership stays here; upstream headers must not undo a logout.

  setResponseStatus(event, res.status)
  return res._data
})
