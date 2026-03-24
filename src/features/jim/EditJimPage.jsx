import { useLocation } from 'react-router-dom'
import { escapeSoqlValue } from '../../shared/services/salesforce.js'
import EditGeneric from './EditGeneric.jsx'

export default function EditJimPage({ showToast }) {
  const location = useLocation()
  const recordId = location.state?.record?.Id || location.state?.record?.id || ''
  const safeId = escapeSoqlValue(recordId.trim())
  const soql = `SELECT Id, Name, BillingStreet,BillingCity,BillingCountry, ShippingStreet FROM Account WHERE Id = '${safeId}' LIMIT 1`

  return (
    <EditGeneric
      showToast={showToast}
      objectName="Account"
      recordId={recordId}
      soql={soql}
      redirectPath="/jim"
      requiredFields={['Name']}
    />
  )
}
