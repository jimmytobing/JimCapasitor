import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getStoredUsername } from '../../auth/session.js'
import BottomStickyNav from '../../components/BottomStickyNav.jsx'
import PageShell from '../../components/PageShell.jsx'
import HzRecordForm from './HzRecordForm.jsx'
import HzRecordViewForm from '../recordViewForm/HzRecordViewForm.jsx'
import {
  getSectionKey,
  resolveItemValues,
  resolveViewItemLabel,
} from '../recordSectionUtils/recordSectionUtils.js'
import { useHzRecordForm } from '../recordEditForm/useHzRecordForm.js'

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
    dirtyFieldsCount,
    picklists,
    recordView,
    searchLookupOptions,
    enterEditMode,
    saveRecord,
    updateFieldValue,
    updateLookupValue,
  } = useHzRecordForm(objectApiName, recordId, showToast)
  const currentUsername = getStoredUsername().toLowerCase()
  const shouldShowLookupReferenceCard =
    !isCreateMode && mode === 'View' && currentUsername === 'jimmy.bfipbf@gmail.com'
  const fallbackPath = `/o/${recordView?.apiName || objectApiName}`
  const [collapsedSections, setCollapsedSections] = useState({})

  function handleBack() {
    if (location.state?.from) {
      navigate(location.state.from)
      return
    }

    navigate(fallbackPath)
  }

  async function handleDelete() {
    const confirmed = window.confirm('Hapus record ini dari Salesforce?')
    if (!confirmed) return

    const success = await deleteRecord()
    if (success) {
      navigate(fallbackPath)
    }
  }

  async function handleSave() {
    if (isCreateMode) {
      const createdRecordId = await createRecord()
      if (createdRecordId) {
        navigate(`/${createdRecordId}`, {
          replace: true,
          state: {
            from: location.state?.from,
            objectApiName,
          },
        })
      }
      return
    }

    const success = await saveRecord()
    if (success) {
      navigate(`/${recordId}`, {
        replace: true,
        state: {
          from: location.state?.from,
          objectApiName: recordView?.apiName || objectApiName,
        },
      })
    }
  }

  function toggleSection(sectionKey) {
    setCollapsedSections((current) => ({
      ...current,
      [sectionKey]: !current[sectionKey],
    }))
  }

  function handleInlineEdit() {
    if (isCreateMode || mode === 'Edit') {
      return
    }

    enterEditMode()
  }

  function resolveSectionItem(item) {
    const resolvedValues = resolveItemValues(item, {
      shouldShowLookupReferenceCard,
      isCreateMode,
      mode,
    })

    return {
      ...item,
      label:
        shouldShowLookupReferenceCard && item.linkId ? resolveViewItemLabel(item) : item.label,
      values: resolvedValues,
      ui: {
        referenceCard:
          shouldShowLookupReferenceCard && item.linkId ? (
            <div className="mt-2 rounded-2xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
              <p className="font-semibold text-slate-900">{item.linkText || item.linkId}</p>
              <p className="mt-1 text-xs text-slate-500">{item.linkId}</p>
            </div>
          ) : null,
      },
    }
  }

  useEffect(() => {
    setCollapsedSections((current) =>
      activeSections.reduce((result, section, sectionIndex) => {
        const sectionKey = getSectionKey(section, sectionIndex)
        result[sectionKey] = current[sectionKey] ?? true
        return result
      }, {})
    )
  }, [activeSections])

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
            <button className="text-sm font-medium text-white/80" onClick={handleBack}>
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
                  {!isCreateMode ? (
                    <p className="mt-1 text-xs text-slate-500">
                      {dirtyFieldsCount > 0
                        ? `${dirtyFieldsCount} field berubah dan siap disimpan.`
                        : 'Belum ada perubahan pada field.'}
                    </p>
                  ) : (
                    <p className="mt-1 text-xs text-slate-500">
                      Field create mengikuti metadata layout aktif dari Salesforce.
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap justify-end gap-2">{renderActionButtons()}</div>
              </div>
            </section>

            {renderErrorSection()}
            {mode === 'View' && !isCreateMode ? (
              <HzRecordViewForm
                sections={activeSections}
                collapsedSections={collapsedSections}
                onToggleSection={toggleSection}
                resolveItem={resolveSectionItem}
                resolveItemValues={(item) =>
                  resolveItemValues(item, {
                    shouldShowLookupReferenceCard,
                    isCreateMode,
                    mode,
                  })
                }
                editContext={{
                  values: editValues,
                  fieldErrors,
                  onChange: updateFieldValue,
                  onLookupChange: updateLookupValue,
                  canEditComponent: () => false,
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
                onInlineEdit={handleInlineEdit}
              />
            ) : (
              <HzRecordForm
                sections={activeSections}
                collapsedSections={collapsedSections}
                onToggleSection={toggleSection}
                isCreateMode={isCreateMode}
                mode={mode}
                tone={isCreateMode ? 'emerald' : 'orange'}
                resolveItem={resolveSectionItem}
                editContext={{
                  values: editValues,
                  fieldErrors,
                  onChange: updateFieldValue,
                  onLookupChange: updateLookupValue,
                  canEditComponent: (component) =>
                    isCreateMode
                      ? component.editableForNew
                      : mode === 'Edit' && component.editableForUpdate,
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
                onInlineEdit={handleInlineEdit}
              />
            )}

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
