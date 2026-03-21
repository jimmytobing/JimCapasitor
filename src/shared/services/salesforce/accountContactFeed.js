import { querySalesforceGraphQL } from './querySalesforce.js'
import { ACCOUNT_CONTACT_FEED_ITEMS_QUERY } from './queries/accountContactFeedItems.js'

function mapAccount(node) {
  if (!node) {
    return null
  }

  return {
    id: node.Id,
    name: node.Name?.value || 'Account',
  }
}

function mapContact(node) {
  if (!node) {
    return null
  }

  return {
    id: node.Id,
    firstName: node.FirstName?.value || '',
    lastName: node.LastName?.value || '',
    name: node.Name?.value || [node.FirstName?.value, node.LastName?.value].filter(Boolean).join(' '),
    account: node.Account
      ? {
          id: node.Account.Id,
          name: node.Account.Name?.value || 'Account',
        }
      : null,
  }
}

function mapFeedItem(node) {
  if (!node) {
    return null
  }

  return {
    id: node.Id,
    body: node.Body?.value || '',
    createdDate: node.CreatedDate?.value || null,
  }
}

function mapCollection(edges = [], mapper) {
  return edges.map(({ node }) => mapper(node)).filter(Boolean)
}

export async function fetchAccountsContactsAndFeedItems() {
  const data = await querySalesforceGraphQL(ACCOUNT_CONTACT_FEED_ITEMS_QUERY)

  return {
    accounts: mapCollection(data?.uiapi?.query?.Account?.edges, mapAccount),
    contacts: mapCollection(data?.uiapi?.query?.Contact?.edges, mapContact),
    feedItems: mapCollection(data?.uiapi?.query?.FeedItem?.edges, mapFeedItem),
  }
}
