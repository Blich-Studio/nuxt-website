import { defineEventHandler, getMethod, getRouterParam, getQuery, getHeaders, readBody, appendHeader, setResponseStatus } from 'h3'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const gatewayBaseUrl = config.public.apiUrl
  if (!gatewayBaseUrl) {
    throw createError({ statusCode: 500, statusMessage: 'Missing runtimeConfig.public.apiUrl' })
  }

  const path = getRouterParam(event, 'path') || ''
  const targetUrl = `${gatewayBaseUrl.replace(/\/$/, '')}/${path}`

  const method = getMethod(event)
  const query = getQuery(event)
  const headers = getHeaders(event)

  // Forward incoming cookies (SSR requests)
  const cookie = headers.cookie

  // Forward body for non-GET/HEAD
  const body = method === 'GET' || method === 'HEAD' ? undefined : await readBody(event)

  // Build forward headers and translate our blich_access cookie into Authorization header if present
  const forwardHeaders: Record<string, string> = {
    ...(headers['user-agent'] ? { 'user-agent': headers['user-agent'] } : {}),
    ...(headers['content-type'] ? { 'content-type': headers['content-type'] } : {}),
    ...(cookie ? { cookie } : {}),
  }

  const accessMatch = cookie?.match(/blich_access=([^;]+)/)
  if (accessMatch) {
    forwardHeaders.authorization = `Bearer ${accessMatch[1]}`
  }

  const res = await $fetch.raw(targetUrl, {
    method,
    query,
    body,
    headers: forwardHeaders,
  })

  // If the upstream returns tokens in the response body (token-based auth), set HttpOnly cookies here
  try {
    const responseData = res._data as any
    const accessToken = responseData?.data?.access_token ?? responseData?.access_token
    const refreshToken = responseData?.data?.refresh_token ?? responseData?.refresh_token

    if (accessToken) {
      // Set secure, HttpOnly cookies so frontend can rely on cookie-based auth
      appendHeader(event, 'set-cookie', `blich_access=${accessToken}; Path=/; HttpOnly; Secure; SameSite=Lax`)
      if (refreshToken) {
        appendHeader(event, 'set-cookie', `blich_refresh=${refreshToken}; Path=/; HttpOnly; Secure; SameSite=Lax`)
      }

      // Remove tokens from proxied response body to avoid leaking them to the browser
      if (responseData?.data?.access_token) delete responseData.data.access_token
      if (responseData?.data?.refresh_token) delete responseData.data.refresh_token
      if (responseData?.access_token) delete responseData.access_token
      if (responseData?.refresh_token) delete responseData.refresh_token

      res._data = responseData
    }

    // Clear cookies on logout path
    if (method === 'POST' && path.endsWith('auth/logout')) {
      appendHeader(event, 'set-cookie', 'blich_access=; Path=/; HttpOnly; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
      appendHeader(event, 'set-cookie', 'blich_refresh=; Path=/; HttpOnly; Secure; Expires=Thu, 01 Jan 1970 00:00:00 GMT')
    }
  } catch (e) {
    // If something goes wrong parsing the response, ignore and continue to forward upstream headers
  }

  // Forward Set-Cookie back to the browser when the upstream sets cookies
  const setCookie = res.headers.getSetCookie?.() ?? (res.headers.get('set-cookie') ? [res.headers.get('set-cookie')!] : [])
  for (const cookieValue of setCookie) {
    appendHeader(event, 'set-cookie', cookieValue)
  }

  // Mirror gateway status + response body
  setResponseStatus(event, res.status)
  return res._data
})
