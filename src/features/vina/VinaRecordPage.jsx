import { useNavigate, useParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import PageShell from '../../shared/components/PageShell.jsx'
import HzRecordItem from '../../shared/components/HzRecordItem.jsx'
import { useVinaRecordPage } from './useVinaRecordPage.js'

export default function VinaRecordPage({ showToast }) {
  const navigate = useNavigate()
  const { recordId = '' } = useParams()
  const {
    activeSections,
    createRecord,
    cancelEditMode,
    deleteRecord,
    editValues,
    ensurePicklist,
    error,
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
  } = useVinaRecordPage('Account', recordId, showToast)

  async function handleDelete() {
    const confirmed = window.confirm('Hapus record ini dari Salesforce?')
    if (!confirmed) return

    const success = await deleteRecord()
    if (success) {
      navigate('/vina')
    }
  }

  async function handleSave() {
    if (isCreateMode) {
      const createdRecordId = await createRecord()
      if (createdRecordId) {
        navigate(`/vina/${createdRecordId}`, { replace: true })
      }
      return
    }

    const success = await saveRecord()
    if (success) {
      navigate(`/vina/${recordId}`, { replace: true })
    }
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
            <button className="text-sm font-medium text-white/80" onClick={() => navigate('/vina')}>
              {'< Back'}
            </button>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
                  {isCreateMode ? 'Create Mode' : recordView?.apiName || 'Salesforce Record'}
                </p>
                <h1 className="mt-2 text-3xl font-semibold">
                  {isCreateMode ? 'Add New Account' : recordView?.title || recordId}
                </h1>
                <p className="mt-3 max-w-[24rem] text-sm leading-6 text-white/85">
                  {isCreateMode ? (
                    <>
                      Form ini dibentuk dari <code>/ui-api/record-defaults/create/Account</code>,
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
              <div className="rounded-3xl bg-white/15 px-4 py-3 text-right backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.2em] text-white/70">
                  {isCreateMode ? 'Object' : 'Mode'}
                </p>
                <p className="mt-1 text-lg font-semibold">
                  {isCreateMode ? recordView?.apiName || 'Account' : mode}
                </p>
              </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-2">
              {isCreateMode ? (
                <button
                  type="button"
                  className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? 'Creating...' : 'Create Account'}
                </button>
              ) : mode === 'View' ? (
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

              {!isCreateMode ? (
                <button
                  type="button"
                  className="rounded-full border border-white/30 bg-white/10 px-4 py-2 text-sm font-semibold text-white"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              ) : null}
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

            {error ? (
              <section className="rounded-3xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-700 shadow-sm">
                {error}
              </section>
            ) : null}

            {recordView && !isCreateMode ? (
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
                            values:
                              !isCreateMode && mode === 'View' && item.linkId
                                ? item.values.filter((component) => !component.fieldInfo?.reference)
                                : item.values,
                          }}
                          editContext={{
                            values: editValues,
                            onChange: updateFieldValue,
                            onLookupChange: updateLookupValue,
                            canEditComponent: (component) =>
                              isCreateMode ? component.editableForNew : mode === 'Edit' && component.editableForUpdate,
                          }}
                          picklistContext={{
                            values: picklists,
                            ensure: ensurePicklist,
                            objectApiName: recordView?.apiName || 'Account',
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
          </PageShell>
        </section>
      </div>
      <BottomStickyNav onAction={() => {}} />
    </div>
  )
}
