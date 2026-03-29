export {
  ensureSalesforceConnection,
  getSalesforceConnectionSummary,
  sendSalesforceBinaryRequest,
  testSalesforceConnection,
} from './client.js'

export {
  createRichTextFeedItem,
  createFeedElementComment,
  createRecordFeedElement,
  createRecordFeedElementWithSegments,
  fetchFeedElementComments,
  fetchContentVersion,
  fetchRecordFeedElements,
  uploadInlineImageToRecord,
  uploadFileToRecord,
} from './chatter.js'

export {
  createUiRecord,
  deleteUiRecord,
  fetchCreateDefaults,
  fetchPicklistValues,
  fetchRecentItems,
  fetchRecordUi,
  updateUiRecord,
} from './uiApi.js'

export {
  escapeSoqlValue,
  fetchSampleAccounts,
  getRecord,
  getRecords,
  querySalesforceSoql,
  searchLookupRecords,
  updateRecord,
} from './query.js'

export {
  fetchAccountContactsByCircleId,
  fetchAccountContactsByName,
  fetchAccountsWithContacts,
} from './account.js'

export {
  ensureContactFromGoogleProfile,
  findContactByIdentity,
  updateContact,
} from './contact.js'
