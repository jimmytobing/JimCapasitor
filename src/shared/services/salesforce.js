export {
  ensureSalesforceConnection,
  getSalesforceConnectionSummary,
  testSalesforceConnection,
} from './salesforce/client.js'
export {
  createUiRecord,
  fetchCreateDefaults,
  deleteUiRecord,
  fetchPicklistValues,
  fetchRecentItems,
  fetchRecordUi,
  updateUiRecord,
} from './salesforce/uiApi.js'
export {
  escapeSoqlValue,
  fetchSampleAccounts,
  getRecord,
  getRecordG,
  getRecords,
  getRecordsG,
  querySalesforceSoql,
  querySalesforceGraphQL,
  updateRecord,
} from './salesforce/querySalesforce.js'
export { 
  fetchAccountsWithContacts, 
  fetchAccountContactsByName 
} from './salesforce/account.js'
export { 
  fetchAccountsContactsAndFeedItems 
} from './salesforce/accountContactFeed.js'
export {
  ensureContactFromGoogleProfile,
  findContactByIdentity,
  updateContact,
} from './salesforce/contact.js'
