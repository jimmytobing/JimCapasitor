export const ACCOUNT_CONTACT_FEED_ITEMS_QUERY = `
  query AccountContactFeedItems {
    uiapi {
      query {
        Account(first: 200) {
          edges {
            node {
              Id
              Name {
                value
              }
            }
          }
        }
        Contact(first: 200) {
          edges {
            node {
              Id
              FirstName {
                value
              }
              LastName {
                value
              }
              Name {
                value
              }
              Account {
                Id
                Name {
                  value
                }
              }
            }
          }
        }
        FeedItem(first: 200) {
          edges {
            node {
              Id
              Body {
                value
              }
              CreatedDate {
                value
              }
            }
          }
        }
      }
    }
  }
`
