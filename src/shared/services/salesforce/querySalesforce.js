import { sendSalesforceRequest } from './client.js'

export function escapeSoqlValue(value) {
  return String(value).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
}

export async function querySalesforceSoql(soql) {
  return sendSalesforceRequest('query', {
    params: { q: soql },
  })
}

export async function getRecords(soql) {
  const result = await querySalesforceSoql(soql)
  return Array.isArray(result?.records) ? result.records : []
}

export async function getRecord(soql) {
  const records = await getRecords(soql)
  return records[0] ?? null
}

function extractGraphQLRecords(data) {
  const queryResult = data?.uiapi?.query

  if (!queryResult || typeof queryResult !== 'object') {
    return []
  }

  const [firstResult] = Object.values(queryResult)
  const edges = firstResult?.edges

  if (Array.isArray(edges)) {
    return edges.map((edge) => edge?.node).filter(Boolean)
  }

  return []
}

function extractGraphQLRecord(data) {
  const queryResult = data?.uiapi?.query

  if (!queryResult || typeof queryResult !== 'object') {
    return null
  }

  const [firstResult] = Object.values(queryResult)

  if (!firstResult) {
    return null
  }

  if (Array.isArray(firstResult?.edges)) {
    return firstResult.edges[0]?.node ?? null
  }

  return firstResult
}

export async function querySalesforceGraphQL(query, variables = {}) {
  const payload = await sendSalesforceRequest('graphql', {
    method: 'POST',
    data: {
      query,
      variables,
    },
  })

  if (payload?.errors?.length) {
    throw new Error(payload.errors[0]?.message || 'GraphQL Salesforce gagal.')
  }

  return payload?.data
}

export async function getRecordsG(query, variables = {}) {
  const data = await querySalesforceGraphQL(query, variables)
  return extractGraphQLRecords(data)
}

export async function getRecordG(query, variables = {}) {
  const data = await querySalesforceGraphQL(query, variables)
  return extractGraphQLRecord(data)
}

export async function fetchSampleAccounts(limit = 5) {
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 20) : 5

  return querySalesforceSoql(
    `SELECT Id, Name, Type, Industry FROM Account ORDER BY LastModifiedDate DESC LIMIT ${safeLimit}`
  )
}
