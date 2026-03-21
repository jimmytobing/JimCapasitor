export {
  getSalesforceConnectionSummary,
  testSalesforceConnection,
} from './salesforce/client.js'
export {
  escapeSoqlValue,
  fetchSampleAccounts,
  getRecord,
  getRecordG,
  getRecords,
  getRecordsG,
  querySalesforceSoql,
  querySalesforceGraphQL,
} from './salesforce/querySalesforce.js'
export { fetchAccountsWithContacts, fetchAccountContactsByName } from './salesforce/account.js'
export { fetchAccountsContactsAndFeedItems } from './salesforce/accountContactFeed.js'
export {
  ensureContactFromGoogleProfile,
  findContactByIdentity,
  updateContact,
} from './salesforce/contact.js'
