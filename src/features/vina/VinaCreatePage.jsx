import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import PageShell from '../../shared/components/PageShell.jsx'
import { useVinaCreatePage } from './useVinaCreatePage.js'

function VinaCreateField({
  component,
  editValue,
  picklist,
  onChange,
  onEnsurePicklist,
  objectApiName,
  recordTypeId,
}) {
  useEffect(() => {
    if (
      component.picklistUrl &&
      component.editableForNew &&
      !picklist?.values?.length
    ) {
      void onEnsurePicklist(component.picklistUrl, objectApiName, recordTypeId, component.field)
    }
  }, [
    component.editableForNew,
    component.field,
    component.picklistUrl,
    objectApiName,
    onEnsurePicklist,
    picklist?.values?.length,
    recordTypeId,
  ])

  if (!component.editableForNew) {
    return (
      <p className="mt-2 text-sm leading-6 text-slate-500">
        {component.displayValue || '-'}
      </p>
    )
  }

  if (component.picklistUrl) {
    return (
      <select
        className="mt-2 w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
        value={editValue?.current ?? ''}
        onChange={(event) => onChange(component.field, event.target.value)}
      >
        <option value="">Pilih {component.label}</option>
        {(picklist?.values || []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  return (
    <input
      type="text"
      className="mt-2 w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-400"
      value={editValue?.current ?? ''}
      onChange={(event) => onChange(component.field, event.target.value)}
      placeholder={component.required ? 'Wajib diisi' : ''}
    />
  )
}

function VinaCreateItem({
  item,
  editValues,
  picklists,
  onChange,
  onEnsurePicklist,
  objectApiName,
  recordTypeId,
}) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
      {item.values.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">-</p>
      ) : null}
      {item.values.map((component) => (
        <div key={component.field} className="mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">{component.label}</span>
            {component.required ? (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-600">
                Required
              </span>
            ) : null}
          </div>
          <VinaCreateField
            component={component}
            editValue={editValues?.[component.field]}
            picklist={picklists?.[component.picklistUrl]}
            onChange={onChange}
            onEnsurePicklist={onEnsurePicklist}
            objectApiName={objectApiName}
            recordTypeId={recordTypeId}
          />
        </div>
      ))}
    </div>
  )
}

export default function VinaCreatePage({ showToast }) {
  const navigate = useNavigate()
  const {
    activeSections,
    createRecord,
    editValues,
    ensurePicklist,
    error,
    isSaving,
    loadingMessage,
    picklists,
    recordView,
    updateFieldValue,
  } = useVinaCreatePage('Account', showToast)

  async function handleCreate() {
    const createdRecordId = await createRecord()
    if (createdRecordId) {
      navigate(`/vina/${createdRecordId}`, { replace: true })
    }
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="overflow-hidden bg-white shadow-none">
          <div className="bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button className="text-sm font-medium text-white/80" onClick={() => navigate('/vina')}>
              {'< Back'}
            </button>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/75">
                  Create Mode
                </p>
                <h1 className="mt-2 text-3xl font-semibold">Add New Account</h1>
                <p className="mt-3 max-w-[24rem] text-sm leading-6 text-white/90">
                  Form ini dibentuk dari <code>/ui-api/record-defaults/create/Account</code>, jadi
                  field create mengikuti layout Salesforce yang aktif.
                </p>
              </div>
              <div className="rounded-3xl bg-white/15 px-4 py-3 text-right backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Object</p>
                <p className="mt-1 text-lg font-semibold">{recordView?.apiName || 'Account'}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                onClick={handleCreate}
                disabled={isSaving}
              >
                {isSaving ? 'Creating...' : 'Create Account'}
              </button>
            </div>
          </div>

          <PageShell className="space-y-4">
            {loadingMessage ? (
              <section className="rounded-3xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-700 shadow-sm">
                {loadingMessage}
              </section>
            ) : null}

            {error ? (
              <section className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
                {error}
              </section>
            ) : null}

            {activeSections.map((section, sectionIndex) => (
              <section key={`${section.heading}-${sectionIndex}`} className="rounded-3xl bg-white p-4 shadow-sm">
                {section.useHeading ? (
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-slate-900">{section.heading}</h2>
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                      {section.rows.length} row
                    </span>
                  </div>
                ) : null}

                <div className="space-y-3">
                  {section.rows.map((row, rowIndex) => (
                    <div key={`${sectionIndex}-${rowIndex}`} className="grid gap-3">
                      {row.items.map((item, itemIndex) => (
                        <VinaCreateItem
                          key={`${sectionIndex}-${rowIndex}-${itemIndex}`}
                          item={item}
                          editValues={editValues}
                          picklists={picklists}
                          onChange={updateFieldValue}
                          onEnsurePicklist={ensurePicklist}
                          objectApiName={recordView?.apiName || 'Account'}
                          recordTypeId={recordView?.recordTypeId}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </PageShell>
        </section>
      </div>
      <BottomStickyNav onAction={() => {}} />
    </div>
  )
}
