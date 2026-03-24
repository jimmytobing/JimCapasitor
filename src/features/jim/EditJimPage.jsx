import { useLocation, useNavigate } from 'react-router-dom'
import { escapeSoqlValue } from '../../shared/services/salesforce.js'
import EditGeneric from './EditGeneric.jsx'

export default function EditJimPage({ showToast }) {
  const location = useLocation()
  const navigate = useNavigate()
  const recordId = location.state?.record?.Id || location.state?.record?.id || ''
  const safeId = escapeSoqlValue(recordId.trim())
  const soql = `SELECT Id, Name, BillingStreet,BillingCity,BillingCountry, ShippingStreet FROM Account WHERE Id = '${safeId}' LIMIT 1`

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="p-3 pb-0">
        <button className="bg-black" onClick={() => navigate('/jim')}>
          {'< Back'}
        </button>
      </div>
      <EditGeneric
        showToast={showToast}
        objectName="Account"
        recordId={recordId}
        soql={soql}
        requiredFields={['Name']}
      />
    </div>
  )
}
