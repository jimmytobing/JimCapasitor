import { querySalesforceGraphQL } from './querySalesforce.js'
import { ACCOUNT_CONTACTS_QUERY } from './queries/accountContacts.js'

function mapAccountContacts(accountNode, fallbackName) {
  if (!accountNode) {
    return null
  }

  return {
    id: accountNode.Id,
    name: accountNode.Name?.value || fallbackName,
    contacts:
      accountNode.Contacts?.edges?.map(({ node }) => ({
        id: node.Id,
        firstName: node.FirstName?.value || '',
        lastName: node.LastName?.value || '',
        name: node.Name?.value || [node.FirstName?.value, node.LastName?.value].filter(Boolean).join(' '),
      })) || [],
  }
}

function mapAccountContactsCollection(edges = []) {
  return edges
    .map(({ node }) => mapAccountContacts(node, node?.Name?.value || 'Account'))
    .filter(Boolean)
}

export async function fetchAccountsWithContacts() {
  const data = await querySalesforceGraphQL(ACCOUNT_CONTACTS_QUERY)
  const accountEdges = data?.uiapi?.query?.Account?.edges || []

  return mapAccountContactsCollection(accountEdges)
}

export async function fetchAccountContactsByName(accountName) {
  const accounts = await fetchAccountsWithContacts()
  return accounts.find((account) => account.name === accountName) || null
}
