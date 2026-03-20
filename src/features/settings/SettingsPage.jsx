import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  fetchSampleAccounts,
  getSalesforceConfigSummary,
  testSalesforceConnection,
} from '../../shared/services/salesforce.js'

export default function SettingsPage({ showToast, themeMode, setThemeMode }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const [isCheckingSalesforce, setIsCheckingSalesforce] = useState(false)
  const [salesforceStatus, setSalesforceStatus] = useState('')
  const [salesforceAccounts, setSalesforceAccounts] = useState([])
  const salesforceConfig = getSalesforceConfigSummary()

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
      const totalApi = limits?.DailyApiRequests
      const remainingApi = totalApi?.Remaining ?? '-'
      const maxApi = totalApi?.Max ?? '-'

      setSalesforceAccounts(accounts?.records || [])
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

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-slate-900 via-blue-800 to-cyan-600 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/home')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Settings</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              Atur tampilan app dan pilih nuansa yang paling nyaman buat kamu.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Appearance</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Theme ini berlaku untuk area utama app setelah login.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  {themeMode === 'black' ? 'Black' : 'Default'}
                </span>
              </div>

              <div className="mt-4 grid gap-3">
                <button
                  type="button"
                  className={`rounded-3xl border p-4 text-left transition ${
                    themeMode === 'black'
                      ? 'border-cyan-400 bg-slate-900 text-white'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                  onClick={() => handleThemeChange('black')}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]">
                    Black Theme
                  </p>
                  <p className="mt-2 text-sm leading-6">
                    Pakai latar hitam dan surface gelap di seluruh halaman fitur.
                  </p>
                </button>

                <button
                  type="button"
                  className={`rounded-3xl border p-4 text-left transition ${
                    themeMode === 'default'
                      ? 'border-sky-500 bg-white text-slate-900'
                      : 'border-slate-200 bg-slate-50 text-slate-700'
                  }`}
                  onClick={() => handleThemeChange('default')}
                >
                  <p className="text-sm font-semibold uppercase tracking-[0.18em]">
                    Default Theme
                  </p>
                  <p className="mt-2 text-sm leading-6">
                    Kembali ke tampilan dasar app tanpa override black theme global.
                  </p>
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Salesforce API</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Tes koneksi paling simpel dari app Capacitor memakai bearer token.
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    salesforceConfig.isReady
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'bg-amber-100 text-amber-700'
                  }`}
                >
                  {salesforceConfig.isReady ? 'Configured' : 'Missing .env'}
                </span>
              </div>

              <div className="mt-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                  Connection Info
                </p>
                <p className="mt-3 text-sm text-slate-700">
                  Platform: <span className="font-semibold">{salesforceConfig.platform}</span>
                </p>
                <p className="mt-1 break-all text-sm text-slate-700">
                  Instance: {salesforceConfig.instanceUrl || 'Belum diisi'}
                </p>
                <p className="mt-1 text-sm text-slate-700">
                  API Version: {salesforceConfig.apiVersion}
                </p>
              </div>

              <button
                type="button"
                className="mt-4 w-full rounded-3xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-slate-300"
                onClick={handleSalesforceTest}
                disabled={isCheckingSalesforce || !salesforceConfig.isReady}
              >
                {isCheckingSalesforce ? 'Menghubungkan ke Salesforce...' : 'Tes Koneksi Salesforce'}
              </button>

              <p className="mt-3 text-sm leading-6 text-slate-600">
                {salesforceStatus ||
                  'Isi `.env` lalu tekan tombol di atas untuk ambil limits API dan contoh data Account.'}
              </p>

              {salesforceAccounts.length > 0 ? (
                <div className="mt-4 space-y-3">
                  {salesforceAccounts.map((account) => (
                    <div
                      key={account.Id}
                      className="rounded-3xl border border-slate-200 bg-white p-4"
                    >
                      <p className="text-sm font-semibold text-slate-900">{account.Name}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {account.Industry || 'Industry belum ada'} • {account.Type || 'Type belum ada'}
                      </p>
                      <p className="mt-2 text-xs text-slate-400">{account.Id}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
