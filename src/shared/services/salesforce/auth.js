import { readSalesforceStorage, writeSalesforceStorage, clearSalesforceStorage } from './storage.js'

const SALESFORCE_TOKEN_STORAGE_KEY = 'salesforce_client_credentials_token'
const TOKEN_EXPIRY_SKEW_MS = 60 * 1000
const DEFAULT_TOKEN_TTL_MS = 10 * 60 * 1000

const salesforceAuthConfig = {
  authUrl: (
    import.meta.env.VITE_SALESFORCE_AUTH_URL ||
    import.meta.env.VITE_SALESFORCE_INSTANCE_URL ||
    'https://login.salesforce.com'
  ).replace(/\/+$/, ''),
  instanceUrl: (import.meta.env.VITE_SALESFORCE_INSTANCE_URL || '').replace(/\/+$/, ''),
  clientId: import.meta.env.VITE_SALESFORCE_CLIENT_ID || '',
  clientSecret: import.meta.env.VITE_SALESFORCE_CLIENT_SECRET || '',
  apiVersion: import.meta.env.VITE_SALESFORCE_API_VERSION || 'v61.0',
}

let tokenCache = null
let pendingTokenRequest = null

async function readStoredToken() {
  const rawValue = await readSalesforceStorage(SALESFORCE_TOKEN_STORAGE_KEY)
  if (!rawValue) return null

  try {
    return JSON.parse(rawValue)
  } catch {
    return null
  }
}

async function writeStoredToken(session) {
  await writeSalesforceStorage(SALESFORCE_TOKEN_STORAGE_KEY, JSON.stringify(session))
}

async function clearStoredToken() {
  await clearSalesforceStorage(SALESFORCE_TOKEN_STORAGE_KEY)
}

function isTokenUsable(session) {
  return Boolean(
    session?.accessToken &&
      session?.instanceUrl &&
      Number.isFinite(session?.expiresAt) &&
      session.expiresAt > Date.now() + TOKEN_EXPIRY_SKEW_MS
  )
}

function normalizeTokenPayload(payload) {
  const expiresInSeconds = Number(payload?.expires_in)
  const expiresAt = Number.isFinite(expiresInSeconds) && expiresInSeconds > 0
    ? Date.now() + expiresInSeconds * 1000
    : Date.now() + DEFAULT_TOKEN_TTL_MS

  return {
    accessToken: payload?.access_token || '',
    instanceUrl: (payload?.instance_url || salesforceAuthConfig.instanceUrl || '').replace(/\/+$/, ''),
    issuedAt: Date.now(),
    expiresAt,
    tokenType: payload?.token_type || 'Bearer',
  }
}

function ensureSalesforceAuthConfig() {
  if (
    !salesforceAuthConfig.authUrl ||
    !salesforceAuthConfig.clientId ||
    !salesforceAuthConfig.clientSecret
  ) {
    throw new Error(
      'Salesforce belum dikonfigurasi. Isi VITE_SALESFORCE_AUTH_URL, VITE_SALESFORCE_CLIENT_ID, dan VITE_SALESFORCE_CLIENT_SECRET di .env.'
    )
  }
}

function readSalesforceAuthError(payload) {
  if (payload?.error_description) return payload.error_description
  if (payload?.error) return payload.error
  if (payload?.message) return payload.message
  return 'Autentikasi Salesforce gagal.'
}

async function requestNewAccessToken() {
  ensureSalesforceAuthConfig()

  const tokenUrl = new URL('/services/oauth2/token', `${salesforceAuthConfig.authUrl}/`)
  const body = new URLSearchParams({
    grant_type: 'client_credentials',
    client_id: salesforceAuthConfig.clientId,
    client_secret: salesforceAuthConfig.clientSecret,
  })

  const response = await fetch(tokenUrl.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: body.toString(),
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(readSalesforceAuthError(payload))
  }

  const session = normalizeTokenPayload(payload)

  if (!session.accessToken || !session.instanceUrl) {
    throw new Error(
      'Salesforce mengembalikan token tanpa access token atau instance URL yang bisa dipakai.'
    )
  }

  tokenCache = session
  await writeStoredToken(session)
  return session
}

export async function clearSalesforceAccessToken() {
  tokenCache = null
  pendingTokenRequest = null
  await clearStoredToken()
}

export async function getSalesforceAccessSession({ forceRefresh = false } = {}) {
  if (!forceRefresh) {
    if (isTokenUsable(tokenCache)) {
      return tokenCache
    }

    const storedSession = await readStoredToken()
    if (isTokenUsable(storedSession)) {
      tokenCache = storedSession
      return storedSession
    }
  }

  if (!pendingTokenRequest) {
    pendingTokenRequest = requestNewAccessToken().finally(() => {
      pendingTokenRequest = null
    })
  }

  return pendingTokenRequest
}

export async function getSalesforceConfigSummary() {
  const storedSession = isTokenUsable(tokenCache) ? tokenCache : await readStoredToken()

  return {
    isReady: Boolean(
      salesforceAuthConfig.authUrl &&
        salesforceAuthConfig.clientId &&
        salesforceAuthConfig.clientSecret
    ),
    authUrl: salesforceAuthConfig.authUrl,
    instanceUrl: storedSession?.instanceUrl || salesforceAuthConfig.instanceUrl,
    apiVersion: salesforceAuthConfig.apiVersion,
    hasCachedToken: isTokenUsable(storedSession),
  }
}

export { salesforceAuthConfig }
