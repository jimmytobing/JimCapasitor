import { useLocation, useNavigate, useParams } from 'react-router-dom'
import BottomStickyNav from './BottomStickyNav.jsx'
import PageShell from './PageShell.jsx'
import HzRecordItem from './HzRecordItem.jsx'
import { useHzRecordPage } from './useHzRecordPage.js'

export default function HzRecordPage({ showToast, defaultObjectApiName = 'Account' }) {
  const location = useLocation()
  const navigate = useNavigate()
  const { objectApiName: routeObjectApiName = '', recordId = '' } = useParams()
  const objectApiName =
    routeObjectApiName || location.state?.objectApiName || defaultObjectApiName
  const {
    activeSections,
    createRecord,
    cancelEditMode,
    deleteRecord,
    editValues,
    ensurePicklist,
    error,
    fieldErrors,
    isCreateMode,
    isDeleting,
    isSaving,
    loadingMessage,
    mode,
    picklists,
    recordView,
    searchLookupOptions,
    enterEditMode,
    saveRecord,
    updateFieldValue,
    updateLookupValue,
  } = useHzRecordPage(objectApiName, recordId, showToast)

  async function handleDelete() {
    const confirmed = window.confirm('Hapus record ini dari Salesforce?')
    if (!confirmed) return

    const success = await deleteRecord()
    if (success) {
      navigate(`/${recordView?.apiName || objectApiName}`)
    }
  }

  async function handleSave() {
    if (isCreateMode) {
      const createdRecordId = await createRecord()
      if (createdRecordId) {
        navigate(`/${objectApiName}/${createdRecordId}`, { replace: true })
      }
      return
    }

    const success = await saveRecord()
    if (success) {
      navigate(`/${recordView?.apiName || objectApiName}/${recordId}`, { replace: true })
    }
  }

  function resolveViewItemLabel(item) {
    if (item?.label) return item.label

    const lookupComponent = item?.values?.find((component) => component.fieldInfo?.reference)
    if (!lookupComponent?.fieldInfo?.label) return ''

    return lookupComponent.fieldInfo.label.replace(/\s+ID$/, '')
  }

  function resolveLookupComponentLabel(component, item) {
    if (item?.label) return item.label
    if (component?.label && !/\s+ID$/.test(component.label)) return component.label
    if (component?.fieldInfo?.label) return component.fieldInfo.label.replace(/\s+ID$/, '')
    return component?.label || ''
  }

  function resolveItemValues(item) {
    const baseValues = item?.values || []

    if (!isCreateMode && mode === 'View' && item?.linkId) {
      return baseValues.filter((component) => !component.fieldInfo?.reference)
    }

    if (!isCreateMode && mode === 'Edit') {
      return baseValues.map((component) =>
        component.fieldInfo?.reference
          ? {
              ...component,
              label: resolveLookupComponentLabel(component, item),
            }
          : component
      )
    }

    return baseValues
  }

  function renderActionButtons() {
    return (
      <>
        {isCreateMode ? (
          <button
            type="button"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? 'Creating...' : `Create ${objectApiName}`}
          </button>
        ) : mode === 'View' ? (
          <button
            type="button"
            className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
            onClick={enterEditMode}
            disabled={!recordView}
          >
            Edit
          </button>
        ) : (
          <>
            <button
              type="button"
              className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm"
              onClick={handleSave}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm"
              onClick={cancelEditMode}
            >
              Cancel
            </button>
          </>
        )}

        {!isCreateMode ? (
          <button
            type="button"
            className="rounded-full border border-rose-200 bg-white px-4 py-2 text-sm font-semibold text-rose-600 shadow-sm"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        ) : null}
      </>
    )
  }

  function renderErrorSection() {
    if (!error) return null

    return (
      <section className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
        {error}
      </section>
    )
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="overflow-hidden bg-white shadow-none">
          <div
            className={`px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white ${
              isCreateMode
                ? 'bg-gradient-to-br from-emerald-600 via-teal-500 to-cyan-500'
                : 'bg-gradient-to-br from-slate-900 via-rose-800 to-orange-500'
            }`}
          >
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate(`/${recordView?.apiName || objectApiName}`)}
            >
              {'< Back'}
            </button>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  {isCreateMode ? 'Create Mode' : recordView?.apiName || 'Salesforce Record'}
                </p>
                <h1 className="mt-2 text-3xl font-semibold">
                  {isCreateMode ? `Add New ${objectApiName}` : recordView?.title || recordId}
                </h1>
                <p className="mt-3 max-w-[24rem] text-sm leading-6 text-white/85">
                  {isCreateMode ? (
                    <>
                      Form ini dibentuk dari <code>{`/ui-api/record-defaults/create/${objectApiName}`}</code>,
                      jadi field create mengikuti layout Salesforce yang aktif.
                    </>
                  ) : (
                    <>
                      Detail ini dibangun dari response <code>/ui-api/record-ui</code> dan
                      dirender per section, row, lalu item seperti pola sample React Native.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>

          <PageShell className="space-y-4">
            {loadingMessage ? (
              <section
                className={`rounded-3xl p-4 text-sm shadow-sm ${
                  isCreateMode
                    ? 'border border-emerald-100 bg-emerald-50 text-emerald-700'
                    : 'border border-orange-100 bg-orange-50 text-orange-700'
                }`}
              >
                {loadingMessage}
              </section>
            ) : null}

            {recordView && !isCreateMode ? (
              <section className="rounded-3xl bg-white p-4 shadow-sm">
                <div className="flex flex-wrap gap-2">
                  <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
                    {recordView.apiName}
                  </span>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    Record Id : {recordView.recordId}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  Semua blok di bawah berasal dari layout metadata Salesforce. Jika object atau
                  layout berubah di org, struktur yang ditampilkan akan ikut berubah.
                </p>
              </section>
            ) : null}
            
            <section
              className={`rounded-3xl border p-4 shadow-sm ${
                isCreateMode
                  ? 'border-emerald-200 bg-gradient-to-br from-emerald-100 via-teal-50 to-white'
                  : 'border-orange-200 bg-gradient-to-br from-orange-100 via-amber-50 to-white'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {isCreateMode ? 'Object' : 'Mode'}
                  </p>
                  <p className="mt-1 text-lg font-semibold text-slate-900">
                    {isCreateMode ? recordView?.apiName || objectApiName : mode}
                  </p>
                </div>
                <div className="flex flex-wrap justify-end gap-2">{renderActionButtons()}</div>
              </div>
            </section>

            {renderErrorSection()}



            {activeSections.map((section, sectionIndex) => (
              <section key={`${section.heading}-${sectionIndex}`} className="rounded-3xl bg-white p-4 shadow-sm">
                {section.useHeading ? (
                  <div className="mb-4 flex items-center justify-between gap-3">
                    <h2 className="text-base font-semibold text-slate-900">{section.heading}</h2>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isCreateMode
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-orange-50 text-orange-600'
                      }`}
                    >
                      {section.rows.length} row
                    </span>
                  </div>
                ) : null}

                <div className="space-y-3">
                  {section.rows.map((row, rowIndex) => (
                    <div key={`${sectionIndex}-${rowIndex}`} className="grid gap-3">
                      {row.items.map((item, itemIndex) => (
                        <HzRecordItem
                          key={`${sectionIndex}-${rowIndex}-${itemIndex}`}
                          item={{
                            ...item,
                            label:
                              !isCreateMode && mode === 'View' && item.linkId
                                ? resolveViewItemLabel(item)
                                : item.label,
                            values: resolveItemValues(item),
                          }}
                          editContext={{
                            values: editValues,
                            fieldErrors,
                            onChange: updateFieldValue,
                            onLookupChange: updateLookupValue,
                            canEditComponent: (component) =>
                              isCreateMode ? component.editableForNew : mode === 'Edit' && component.editableForUpdate,
                          }}
                          picklistContext={{
                            values: picklists,
                            ensure: ensurePicklist,
                            objectApiName: recordView?.apiName || objectApiName,
                            recordTypeId: recordView?.recordTypeId,
                          }}
                          lookupContext={{
                            onSearch: searchLookupOptions,
                          }}
                          ui={{
                            tone: isCreateMode ? 'emerald' : 'orange',
                            placeholderForComponent: isCreateMode
                              ? (component) => (component.required ? 'Wajib diisi' : '')
                              : undefined,
                            showRequiredBadge: isCreateMode,
                            readOnlyClassName: isCreateMode
                              ? 'mt-2 text-sm leading-6 text-slate-500'
                              : undefined,
                            referenceCard:
                              !isCreateMode && item.linkId && mode === 'View' ? (
                                <div className="mt-2 rounded-2xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                                  <p className="font-semibold text-slate-900">{item.linkText || item.linkId}</p>
                                  <p className="mt-1 text-xs text-slate-500">{item.linkId}</p>
                                </div>
                              ) : null,
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              </section>
            ))}

            {renderErrorSection()}

            <section
              className={`rounded-3xl border p-4 shadow-sm ${
                isCreateMode
                  ? 'border-emerald-200 bg-gradient-to-br from-emerald-100 via-teal-50 to-white'
                  : 'border-orange-200 bg-gradient-to-br from-orange-100 via-amber-50 to-white'
              }`}
            >
              <div className="flex flex-wrap justify-end gap-2">{renderActionButtons()}</div>
            </section>
          </PageShell>
        </section>
      </div>
      <BottomStickyNav onAction={() => {}} />
    </div>
  )
}
