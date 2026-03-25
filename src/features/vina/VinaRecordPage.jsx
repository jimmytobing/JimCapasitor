import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import PageShell from '../../shared/components/PageShell.jsx'
import { useVinaRecordPage } from './useVinaRecordPage.js'

function formatComponentValue(component) {
  if (component.displayValue !== null && component.displayValue !== undefined && component.displayValue !== '') {
    return component.displayValue
  }

  if (component.value !== null && component.value !== undefined && component.value !== '') {
    return String(component.value)
  }

  return '-'
}

function VinaFieldValue({
  component,
  editValue,
  mode,
  onChange,
  onEnsurePicklist,
  picklist,
  objectApiName,
  recordTypeId,
}) {
  useEffect(() => {
    if (
      mode === 'Edit' &&
      component.picklistUrl &&
      component.editableForUpdate &&
      !picklist?.values?.length
    ) {
      void onEnsurePicklist(
        component.picklistUrl,
        objectApiName,
        recordTypeId,
        component.field
      )
    }
  }, [
    component.editableForUpdate,
    component.field,
    component.picklistUrl,
    mode,
    objectApiName,
    onEnsurePicklist,
    picklist?.values?.length,
    recordTypeId,
  ])

  if (mode === 'Edit' && component.editableForUpdate) {
    if (component.picklistUrl) {
      const selectedValue = editValue?.current ?? ''

      return (
        <select
          className="mt-2 w-full rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-400"
          value={selectedValue}
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
        className="mt-2 w-full rounded-2xl border border-orange-200 bg-orange-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-400"
        value={editValue?.current ?? ''}
        onChange={(event) => onChange(component.field, event.target.value)}
      />
    )
  }

  return (
    <p className="mt-2 text-sm leading-6 text-slate-700">
      {formatComponentValue(component)}
    </p>
  )
}

function VinaRecordItem({
  item,
  mode,
  editValues,
  picklists,
  onChange,
  onEnsurePicklist,
  objectApiName,
  recordTypeId,
}) {
  const visibleValues =
    mode === 'View' && item.linkId
      ? item.values.filter((component) => !component.fieldInfo?.reference)
      : item.values

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      {!item.customLinkUrl ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item.label}</p>
      ) : null}

      {item.linkId && mode === 'View' ? (
        <div className="mt-2 rounded-2xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
          <p className="font-semibold text-slate-900">{item.linkText || item.linkId}</p>
          <p className="mt-1 text-xs text-slate-500">{item.linkId}</p>
        </div>
      ) : null}

      {!item.linkId && visibleValues.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">-</p>
      ) : null}

      {visibleValues.map((component) => (
        <VinaFieldValue
          key={component.field}
          component={component}
          editValue={editValues?.[component.field]}
          mode={mode}
          onChange={onChange}
          onEnsurePicklist={onEnsurePicklist}
          picklist={picklists?.[component.picklistUrl]}
          objectApiName={objectApiName}
          recordTypeId={recordTypeId}
        />
      ))}
    </div>
  )
}

export default function VinaRecordPage({ showToast }) {
  const navigate = useNavigate()
  const { recordId = '' } = useParams()
  const {
    activeSections,
    cancelEditMode,
    deleteRecord,
    editValues,
    ensurePicklist,
    error,
    isDeleting,
    isSaving,
    loadingMessage,
    mode,
    picklists,
    recordView,
    enterEditMode,
    saveRecord,
    updateFieldValue,
  } = useVinaRecordPage(recordId, showToast)

  async function handleDelete() {
    const confirmed = window.confirm('Hapus record ini dari Salesforce?')
    if (!confirmed) return

    const success = await deleteRecord()
    if (success) {
      navigate('/vina')
    }
  }

  async function handleSave() {
    const success = await saveRecord()
    if (success) {
      navigate(`/vina/${recordId}`, { replace: true })
    }
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="overflow-hidden bg-white shadow-none">
          <div className="bg-gradient-to-br from-slate-900 via-rose-800 to-orange-500 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button className="text-sm font-medium text-white/80" onClick={() => navigate('/vina')}>
              {'< Back'}
            </button>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  {recordView?.apiName || 'Salesforce Record'}
                </p>
                <h1 className="mt-2 text-3xl font-semibold">{recordView?.title || recordId}</h1>
                <p className="mt-3 max-w-[24rem] text-sm leading-6 text-white/85">
                  Detail ini dibangun dari response <code>/ui-api/record-ui</code> dan dirender
                  per section, row, lalu item seperti pola sample React Native.
                </p>
              </div>
              <div className="rounded-3xl bg-white/15 px-4 py-3 text-right backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">Mode</p>
                <p className="mt-1 text-lg font-semibold">{mode}</p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {mode === 'View' ? (
                <button
                  type="button"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                  onClick={enterEditMode}
                  disabled={!recordView}
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                    onClick={handleSave}
                    disabled={isSaving}
                  >
                    {isSaving ? 'Saving...' : 'Save'}
                  </button>
                  <button
                    type="button"
                    className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
                    onClick={cancelEditMode}
                  >
                    Cancel
                  </button>
                </>
              )}

              <button
                type="button"
                className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>

          <PageShell className="space-y-4">
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

            {recordView ? (
              <section className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    {recordView.apiName}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Record Id {recordView.recordId}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Semua blok di bawah berasal dari layout metadata Salesforce. Jika object atau
                  layout berubah di org, struktur yang ditampilkan akan ikut berubah.
                </p>
              </section>
            ) : null}

            {activeSections.map((section, sectionIndex) => (
              <section key={`${section.heading}-${sectionIndex}`} className="rounded-3xl bg-white p-4 shadow-sm">
                {section.useHeading ? (
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-slate-900">{section.heading}</h2>
                    <span className="rounded-full bg-orange-50 px-3 py-1 text-xs font-semibold text-orange-600">
                      {section.rows.length} row
                    </span>
                  </div>
                ) : null}

                <div className="space-y-3">
                  {section.rows.map((row, rowIndex) => (
                    <div key={`${sectionIndex}-${rowIndex}`} className="grid gap-3">
                      {row.items.map((item, itemIndex) => (
                        <VinaRecordItem
                          key={`${sectionIndex}-${rowIndex}-${itemIndex}`}
                          item={item}
                          mode={mode}
                          editValues={editValues}
                          picklists={picklists}
                          onChange={updateFieldValue}
                          onEnsurePicklist={ensurePicklist}
                          objectApiName={recordView?.apiName}
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
