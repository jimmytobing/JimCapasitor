import { sendSalesforceRequest } from './client.js'

function createUiApiHeaders(headers = {}) {
  return {
    'X-Chatter-Entity-Encoding': 'false',
    ...headers,
  }
}

export async function fetchRecentItems() {
  return sendSalesforceRequest('recent', {
    headers: createUiApiHeaders(),
  })
}

export async function fetchRecordUi(recordId, options = {}) {
  return sendSalesforceRequest(`ui-api/record-ui/${recordId}`, {
    params: {
      formFactor: options.formFactor || 'Small',
      modes: options.modes || 'View,Edit',
      layoutTypes: options.layoutTypes || 'Full',
    },
    headers: createUiApiHeaders(),
  })
}

export async function fetchPicklistValues(objectApiName, recordTypeId, fieldApiName) {
  return sendSalesforceRequest(
    `ui-api/object-info/${objectApiName}/picklist-values/${recordTypeId}/${fieldApiName}`,
    {
      headers: createUiApiHeaders(),
    }
  )
}

export async function updateUiRecord(recordId, payload) {
  return sendSalesforceRequest(`ui-api/records/${recordId}`, {
    method: 'PATCH',
    data: payload,
    headers: createUiApiHeaders(),
  })
}

export async function deleteUiRecord(recordId) {
  return sendSalesforceRequest(`ui-api/records/${recordId}`, {
    method: 'DELETE',
    headers: createUiApiHeaders(),
  })
}
