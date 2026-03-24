import EditGeneric from './EditGeneric.jsx'

function buildJimSoql(safeId) {
  return `SELECT Id, Name, BillingStreet, ShippingStreet FROM Account WHERE Id = '${safeId}' LIMIT 1`
}

export default function EditJimPage({ showToast }) {
  return (
    <EditGeneric
      showToast={showToast}
      objectName="Account"
      buildSoql={buildJimSoql}
      redirectPath="/jim"
      requiredFields={['Name']}
    />
  )
}
