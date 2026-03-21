export const ACCOUNT_CONTACTS_QUERY = `
  query AccountContacts {
    uiapi {
      query {
        Account(first: 200) {
          edges {
            node {
              Id
              Name {
                value
              }
              Contacts(first: 200) {
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
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
//SELECT Id, Name, (SELECT Id,FirstName,LastName,Name FROM Contacts) 
// FROM Account 
// where Name = 'School Friend'