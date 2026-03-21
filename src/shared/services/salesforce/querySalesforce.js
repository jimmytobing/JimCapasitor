import { sendSalesforceRequest } from './client.js'

export async function querySalesforceSoql(soql) {
  return sendSalesforceRequest('query', {
    params: { q: soql },
  })
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

export async function fetchSampleAccounts(limit = 5) {
  const safeLimit = Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 20) : 5

  return querySalesforceSoql(
    `SELECT Id, Name, Type, Industry FROM Account ORDER BY LastModifiedDate DESC LIMIT ${safeLimit}`
  )
}
