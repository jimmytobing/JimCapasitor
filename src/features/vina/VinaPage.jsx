import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import PageShell from '../../shared/components/PageShell.jsx'
import { useVinaPage } from './useVinaPage.js'

export default function VinaPage({ showToast }) {
  const navigate = useNavigate()
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const { cards, error, loadingMessage } = useVinaPage()

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="overflow-hidden bg-white shadow-none">
          <div className="bg-gradient-to-br from-rose-600 via-orange-500 to-amber-400 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button className="text-sm font-medium text-white/80" onClick={() => navigate('/home')}>
              {'< Back'}
            </button>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
                  Vina Account Query
                </p>
                <h1 className="mt-2 text-3xl font-semibold">Salesforce Accounts</h1>
                <p className="mt-3 max-w-[24rem] text-sm leading-6 text-white/90">
                  List awal sekarang memakai query Account agar lebih stabil untuk flow
                  client_credentials, lalu detailnya tetap dibuka lewat UI API dan layout dinamis.
                </p>
              </div>
              <div className="rounded-3xl bg-white/15 px-4 py-3 text-right backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Source</p>
                <p className="mt-1 text-lg font-semibold">{cards.length}</p>
                <p className="text-xs text-white/80">account row</p>
              </div>
            </div>
          </div>

          <PageShell className="space-y-4">
            <section className="rounded-3xl bg-white p-4 shadow-sm">
              <h2 className="text-base font-semibold text-slate-900">Pola yang dibawa ke JimCapacitor</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                List memakai SOQL <code>SELECT Id, Name, BillingStreet FROM Account ...</code>, lalu
                detail memakai <code>/services/data/&lt;apiVersion&gt;/ui-api/record-ui/:id</code>. Render detail dibentuk dari
                metadata layout Salesforce, bukan hardcode field per object.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  className="rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm"
                  onClick={() => navigate('/vina/new')}
                >
                  Add New Account
                </button>
              </div>
            </section>

            {loadingMessage ? (
              <section className="rounded-3xl border border-orange-100 bg-orange-50 p-4 text-sm text-orange-700 shadow-sm">
                {loadingMessage}
              </section>
            ) : null}

            {error ? (
              <section className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
                {error}
              </section>
            ) : null}

            <section className="space-y-3">
              {cards.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="w-full rounded-3xl bg-white p-4 text-left shadow-sm ring-1 ring-orange-100 transition hover:-translate-y-0.5 hover:shadow-md"
                  onClick={() => {
                    notify(item.title)
                    navigate(`/vina/${item.id}`, {
                      state: {
                        card: item,
                      },
                    })
                  }}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
                        {item.objectType || 'Record'}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-slate-900">{item.title}</h2>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {item.meta || item.subtitle || 'Buka untuk melihat layout dari UI API.'}
                      </p>
                    </div>
                    <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                      Detail
                    </span>
                  </div>
                </button>
              ))}
            </section>
          </PageShell>
        </section>
      </div>
      <BottomStickyNav onAction={notify} />
    </div>
  )
}
