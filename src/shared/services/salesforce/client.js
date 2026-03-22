import { Capacitor, CapacitorHttp } from '@capacitor/core'
import {
  clearSalesforceAccessToken,
  getSalesforceAccessSession,
  getSalesforceConfigSummary,
  salesforceAuthConfig,
} from './auth.js'

let pendingConnectionCheck = null

function ensureSalesforceConfig() {
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

function buildSalesforceUrl(instanceUrl, pathname, searchParams = {}) {
  const url = new URL(
    `/services/data/${salesforceAuthConfig.apiVersion}/${pathname.replace(/^\/+/, '')}`,
    `${instanceUrl}/`
  )

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return
    url.searchParams.set(key, value)
  })

  return url.toString()
}

function readSalesforceError(payload) {
  if (Array.isArray(payload) && payload.length > 0) {
    return payload[0]?.message || 'Request Salesforce gagal.'
  }

  if (payload?.[0]?.message) {
    return payload[0].message
  }

  if (payload?.message) {
    return payload.message
  }

  if (payload?.error_description) {
    return payload.error_description
  }

  if (payload?.error) {
    return payload.error
  }

  return 'Request Salesforce gagal.'
}

function isSessionExpiredError(responseStatus, payload) {
  if (responseStatus === 401) return true

  if (Array.isArray(payload)) {
    return payload.some((item) => item?.errorCode === 'INVALID_SESSION_ID')
  }

  return payload?.errorCode === 'INVALID_SESSION_ID'
}

async function executeSalesforceRequest(pathname, options = {}, session) {
  ensureSalesforceConfig()

  const {
    method = 'GET',
    params,
    data,
    headers = {},
  } = options

  const requestHeaders = {
    Authorization: `${session.tokenType || 'Bearer'} ${session.accessToken}`,
    'Content-Type': 'application/json',
    ...headers,
  }

  const url = buildSalesforceUrl(session.instanceUrl, pathname, params)
  const isNative = Capacitor.isNativePlatform()

  if (isNative) {
    const response = await CapacitorHttp.request({
      url,
      method,
      headers: requestHeaders,
      data,
    })

    if (response.status < 200 || response.status >= 300) {
      const error = new Error(readSalesforceError(response.data))
      error.status = response.status
      error.payload = response.data
      throw error
    }

    return response.data
  }

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: data ? JSON.stringify(data) : undefined,
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(readSalesforceError(payload))
    error.status = response.status
    error.payload = payload
    throw error
  }

  return payload
}

export async function sendSalesforceRequest(pathname, options = {}) {
  const session = await ensureSalesforceConnection()

  try {
    return await executeSalesforceRequest(pathname, options, session)
  } catch (error) {
    if (!isSessionExpiredError(error?.status, error?.payload)) {
      throw error
    }

    await clearSalesforceAccessToken()
    const refreshedSession = await getSalesforceAccessSession({ forceRefresh: true })
    return executeSalesforceRequest(pathname, options, refreshedSession)
  }
}

export async function getSalesforceConnectionSummary() {
  return {
    ...(await getSalesforceConfigSummary()),
    platform: Capacitor.getPlatform(),
  }
}

export async function testSalesforceConnection() {
  return sendSalesforceRequest('limits')
}

export async function ensureSalesforceConnection() {
  if (!pendingConnectionCheck) {
    pendingConnectionCheck = getSalesforceAccessSession().finally(() => {
      pendingConnectionCheck = null
    })
  }

  return pendingConnectionCheck
}
