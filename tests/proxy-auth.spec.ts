import { beforeEach, describe, expect, it, vi } from 'vitest'

// Mock h3 helpers used in the handler
const appendHeaderMock = vi.fn()
const setResponseStatusMock = vi.fn()
let methodMock = 'GET'
let routerParamMock = ''
let headersMock: Record<string, any> = {}
let bodyMock: any = undefined

// Provide runtime config helper expected by the handler
// @ts-ignore
global.useRuntimeConfig = () => ({ public: { apiUrl: 'https://api.blichstudio.com' } })

vi.mock('h3', () => ({
  defineEventHandler: (fn: any) => fn,
  getMethod: () => methodMock,
  getRouterParam: (_event: any, name: string) => routerParamMock,
  getQuery: () => ({}),
  getHeaders: () => headersMock,
  readBody: async () => bodyMock,
  appendHeader: (...args: any[]) => appendHeaderMock(...args),
  setResponseStatus: (...args: any[]) => setResponseStatusMock(...args),
  // createError is used by the handler in some branches
  createError: (e: any) => new Error(e?.statusMessage || 'error'),
}))

// Ensure global $fetch exists and can be spied
// @ts-ignore
global.$fetch = { raw: vi.fn() }

// Import the handler AFTER mocks
import proxyHandler from '../server/api/_proxy/[...path].ts'

beforeEach(() => {
  appendHeaderMock.mockReset()
  setResponseStatusMock.mockReset()
  ;(global.$fetch.raw as any).mockReset()
  methodMock = 'GET'
  routerParamMock = ''
  headersMock = {}
  bodyMock = undefined
})

describe('API proxy auth behavior', () => {
  it('sets HttpOnly cookies when upstream returns tokens on login', async () => {
    methodMock = 'POST';
    routerParamMock = 'auth/login';
    bodyMock = { email: 'x', password: 'y' }

    ;(global.$fetch.raw as any).mockResolvedValueOnce({
      status: 201,
      _data: { data: { access_token: 'AT', refresh_token: 'RT', user: { id: 'u1' } } },
      headers: { getSetCookie: () => undefined, get: () => undefined },
    })

    const res = await proxyHandler({} as any)

    // Cookies set via appendHeader
    expect(appendHeaderMock).toHaveBeenCalled()
    // Expect cookies for access and refresh in any argument position
    const hasAccess = appendHeaderMock.mock.calls.some(call => call.some(arg => typeof arg === 'string' && /blich_access=AT/.test(arg)))
    const hasRefresh = appendHeaderMock.mock.calls.some(call => call.some(arg => typeof arg === 'string' && /blich_refresh=RT/.test(arg)))
    expect(hasAccess).toBeTruthy()
    expect(hasRefresh).toBeTruthy()

    // Response body should not contain raw tokens
    expect((res as any)?.data?.data?.access_token).toBeUndefined()
    expect((res as any)?.data?.data?.refresh_token).toBeUndefined()
  })

  it('translates blich_access cookie into Authorization header when proxying', async () => {
    methodMock = 'GET';
    routerParamMock = 'auth/me';

    (global.$fetch.raw as any).mockResolvedValueOnce({ status: 200, _data: { data: { user: { id: 'u1' } } }, headers: { getSetCookie: () => undefined, get: () => undefined } })

    headersMock = { cookie: 'blich_access=MYTOK; other=1' }

    await proxyHandler({} as any)

    expect((global.$fetch.raw as any).mock.calls.length).toBeGreaterThan(0)
    const call = (global.$fetch.raw as any).mock.calls[0]
    const options = call[1]
    expect(options.headers.authorization).toBe('Bearer MYTOK')
  })

  it('clears cookies on logout', async () => {
    methodMock = 'POST';
    routerParamMock = 'auth/logout';

    ;(global.$fetch.raw as any).mockResolvedValueOnce({ status: 200, _data: { ok: true }, headers: { getSetCookie: () => undefined, get: () => undefined } })

    await proxyHandler({} as any)

    // Expect an expired cookie set on logout
    const hasCleared = appendHeaderMock.mock.calls.some(call => call.some(arg => typeof arg === 'string' && /blich_access=;/.test(arg)))
    const hasExpires = appendHeaderMock.mock.calls.some(call => call.some(arg => typeof arg === 'string' && /Expires=Thu, 01 Jan 1970 00:00:00 GMT/.test(arg)))
    expect(hasCleared).toBeTruthy()
    expect(hasExpires).toBeTruthy()
  })
})
