import { Capacitor, CapacitorHttp } from '@capacitor/core'

const salesforceConfig = {
  instanceUrl: (import.meta.env.VITE_SALESFORCE_INSTANCE_URL || '').replace(/\/+$/, ''),
  accessToken: import.meta.env.VITE_SALESFORCE_ACCESS_TOKEN || '',
  apiVersion: import.meta.env.VITE_SALESFORCE_API_VERSION || 'v61.0',
}

function ensureSalesforceConfig() {
  if (!salesforceConfig.instanceUrl || !salesforceConfig.accessToken) {
    throw new Error(
      'Salesforce belum dikonfigurasi. Isi VITE_SALESFORCE_INSTANCE_URL dan VITE_SALESFORCE_ACCESS_TOKEN di .env.'
    )
  }
}

function buildSalesforceUrl(pathname, searchParams = {}) {
  const url = new URL(
    `/services/data/${salesforceConfig.apiVersion}/${pathname.replace(/^\/+/, '')}`,
    `${salesforceConfig.instanceUrl}/`
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

  if (payload?.message) {
    return payload.message
  }

  return 'Request Salesforce gagal.'
}

export async function sendSalesforceRequest(pathname, options = {}) {
  ensureSalesforceConfig()

  const {
    method = 'GET',
    params,
    data,
    headers = {},
  } = options

  const requestHeaders = {
    Authorization: `Bearer ${salesforceConfig.accessToken}`,
    'Content-Type': 'application/json',
    ...headers,
  }

  const url = buildSalesforceUrl(pathname, params)
  const isNative = Capacitor.isNativePlatform()

  if (isNative) {
    const response = await CapacitorHttp.request({
      url,
      method,
      headers: requestHeaders,
      data,
    })

    if (response.status < 200 || response.status >= 300) {
      throw new Error(readSalesforceError(response.data))
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
    throw new Error(readSalesforceError(payload))
  }

  return payload
}

export function getSalesforceConfigSummary() {
  return {
    isReady: Boolean(salesforceConfig.instanceUrl && salesforceConfig.accessToken),
    instanceUrl: salesforceConfig.instanceUrl,
    apiVersion: salesforceConfig.apiVersion,
    platform: Capacitor.getPlatform(),
  }
}

export async function testSalesforceConnection() {
  return sendSalesforceRequest('limits')
}
