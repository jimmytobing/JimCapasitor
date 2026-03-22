import { beforeEach, describe, expect, it, vi } from 'vitest'

const authMocks = vi.hoisted(() => ({
  clearSalesforceAccessToken: vi.fn(),
  getSalesforceAccessSession: vi.fn(),
  getSalesforceConfigSummary: vi.fn(),
  salesforceAuthConfig: {
    authUrl: 'https://example.salesforce.com',
    clientId: 'client-id',
    clientSecret: 'client-secret',
    apiVersion: 'v61.0',
  },
}))

vi.mock('@capacitor/core', () => ({
  Capacitor: {
    getPlatform: () => 'web',
    isNativePlatform: () => false,
  },
  CapacitorHttp: {
    request: vi.fn(),
  },
}))

vi.mock('./auth.js', () => authMocks)

function createDeferred() {
  let resolve
  let reject

  const promise = new Promise((nextResolve, nextReject) => {
    resolve = nextResolve
    reject = nextReject
  })

  return { promise, resolve, reject }
}

describe('ensureSalesforceConnection', () => {
  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
  })

  it('reuses the same in-flight access session request', async () => {
    const deferred = createDeferred()
    authMocks.getSalesforceAccessSession.mockReturnValue(deferred.promise)

    const { ensureSalesforceConnection } = await import('./client.js')

    const firstPromise = ensureSalesforceConnection()
    const secondPromise = ensureSalesforceConnection()

    expect(authMocks.getSalesforceAccessSession).toHaveBeenCalledTimes(1)

    deferred.resolve({ accessToken: 'token-1', instanceUrl: 'https://instance.example.com' })

    await expect(Promise.all([firstPromise, secondPromise])).resolves.toEqual([
      expect.objectContaining({
        accessToken: 'token-1',
        instanceUrl: 'https://instance.example.com',
      }),
      expect.objectContaining({
        accessToken: 'token-1',
        instanceUrl: 'https://instance.example.com',
      }),
    ])
  })

  it('starts a new access session request after the previous one settles', async () => {
    authMocks.getSalesforceAccessSession
      .mockResolvedValueOnce({ accessToken: 'token-1', instanceUrl: 'https://instance-1.example.com' })
      .mockResolvedValueOnce({ accessToken: 'token-2', instanceUrl: 'https://instance-2.example.com' })

    const { ensureSalesforceConnection } = await import('./client.js')

    await expect(ensureSalesforceConnection()).resolves.toMatchObject({
      accessToken: 'token-1',
    })

    await expect(ensureSalesforceConnection()).resolves.toMatchObject({
      accessToken: 'token-2',
    })

    expect(authMocks.getSalesforceAccessSession).toHaveBeenCalledTimes(2)
  })
})
