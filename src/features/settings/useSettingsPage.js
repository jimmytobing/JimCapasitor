import { useEffect, useState } from 'react'
import {
  fetchSampleAccounts,
  getSalesforceConnectionSummary,
  testSalesforceConnection,
} from '../../shared/services/salesforce.js'

export function useSettingsPage({ notify, setThemeMode }) {
  const [isCheckingSalesforce, setIsCheckingSalesforce] = useState(false)
  const [salesforceStatus, setSalesforceStatus] = useState('')
  const [salesforceAccounts, setSalesforceAccounts] = useState([])
  const [salesforceConfig, setSalesforceConfig] = useState({
    isReady: false,
    authUrl: '',
    instanceUrl: '',
    apiVersion: '',
    hasCachedToken: false,
    platform: '',
  })

  useEffect(() => {
    let isMounted = true

    const loadSalesforceConfig = async () => {
      const nextConfig = await getSalesforceConnectionSummary()

      if (!isMounted) return
      setSalesforceConfig(nextConfig)
    }

    loadSalesforceConfig()

    return () => {
      isMounted = false
    }
  }, [])

  const handleThemeChange = (nextTheme) => {
    if (typeof setThemeMode !== 'function') return
    setThemeMode(nextTheme)
    notify(nextTheme === 'black' ? 'Black theme aktif' : 'Theme default aktif')
  }

  const handleSalesforceTest = async () => {
    setIsCheckingSalesforce(true)
    setSalesforceStatus('')

    try {
      const limits = await testSalesforceConnection()
      const accounts = await fetchSampleAccounts(5)
      const nextConfig = await getSalesforceConnectionSummary()
      const totalApi = limits?.DailyApiRequests
      const remainingApi = totalApi?.Remaining ?? '-'
      const maxApi = totalApi?.Max ?? '-'

      setSalesforceAccounts(accounts?.records || [])
      setSalesforceConfig(nextConfig)
      setSalesforceStatus(`Terhubung. Sisa Daily API ${remainingApi}/${maxApi}.`)
      notify('Koneksi Salesforce berhasil')
    } catch (error) {
      setSalesforceAccounts([])
      setSalesforceStatus(error.message || 'Koneksi Salesforce gagal.')
      notify('Koneksi Salesforce gagal')
    } finally {
      setIsCheckingSalesforce(false)
    }
  }

  return {
    isCheckingSalesforce,
    salesforceStatus,
    salesforceAccounts,
    salesforceConfig,
    handleThemeChange,
    handleSalesforceTest,
  }
}
