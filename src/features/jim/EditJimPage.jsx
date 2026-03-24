import EditGeneric from './EditGeneric.jsx'

export default function EditJimPage({ showToast }) {
  return (
    <EditGeneric
      showToast={showToast}
      objectName="Account"
      fields={['Id', 'Name', 'BillingStreet']}
      redirectPath="/jim"
      requiredFields={['Name']}
    />
  )
}
