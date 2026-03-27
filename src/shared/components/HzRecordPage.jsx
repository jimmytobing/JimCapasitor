import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { getStoredUsername } from '../auth/session.js'
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
    dirtyFieldsCount,
    picklists,
    recordView,
    searchLookupOptions,
    enterEditMode,
    saveRecord,
    updateFieldValue,
    updateLookupValue,
  } = useHzRecordPage(objectApiName, recordId, showToast)
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

    if (shouldShowLookupReferenceCard && item?.linkId) {
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

  function formatSectionPreviewValue(component) {
    if (!component) return ''

    const compoundObject =
      component.value && typeof component.value === 'object'
        ? {
            ...component.value,
            ...(component.displayValue && typeof component.displayValue === 'object'
              ? component.displayValue
              : {}),
          }
        : {}

    if (component.isCompoundField && component.fieldInfo?.dataType === 'Address') {
      const address = compoundObject
      const stateValue = address.StateCode || address.State || ''
      const countryValue = address.CountryCode || address.Country || ''
      return [address.Street, address.City, stateValue, address.PostalCode, countryValue]
        .filter(Boolean)
        .join(', ')
    }

    if (
      component.isCompoundField &&
      (component.fieldInfo?.extraTypeInfo === 'PersonName' ||
        component.fieldInfo?.extraTypeInfo === 'SwitchablePersonName')
    ) {
      const nameValue = compoundObject

      return [
        nameValue.Salutation,
        nameValue.FirstName,
        nameValue.MiddleName,
        nameValue.LastName,
        nameValue.Suffix,
        nameValue.InformalName,
      ]
        .filter(Boolean)
        .join(' ')
        .trim()
    }

    if (component.isCompoundField && component.fieldInfo?.dataType === 'Location') {
      const latitude = component?.value?.latitude
      const longitude = component?.value?.longitude
      if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
        return ''
      }
      return `${latitude}, ${longitude}`
    }

    if (component.isCompoundField && typeof component.displayValue === 'object') {
      return Object.values(compoundObject).filter(Boolean).join(', ')
    }

    if (component.displayValue !== null && component.displayValue !== undefined && component.displayValue !== '') {
      return String(component.displayValue)
    }

    if (component.value !== null && component.value !== undefined && component.value !== '') {
      if (typeof component.value === 'object') {
        return Object.values(component.value).filter(Boolean).join(' ')
      }

      return String(component.value)
    }

    return ''
  }

  function resolveSectionPreview(section) {
    const allComponents = []

    section.rows.forEach((row) => {
      row.items.forEach((item) => {
        resolveItemValues(item).forEach((component) => {
          allComponents.push(component)
        })
      })
    })

    const prioritizedComponents = [
      ...allComponents.filter((component) => component?.isCompoundField),
      ...allComponents.filter((component) => !component?.isCompoundField),
    ]

    const previews = prioritizedComponents
      .map((component) => formatSectionPreviewValue(component).trim())
      .filter(Boolean)
      .filter((value, index, values) => values.indexOf(value) === index)
      .slice(0, 3)

    return previews.join(' • ')
  }

  function getSectionKey(section, sectionIndex) {
    return `${section.heading || 'section'}-${sectionIndex}`
  }

  function resolveSectionHeading(section, sectionIndex) {
    if (section?.heading) {
      return section.heading
    }

    if (isCreateMode) {
      return `Create Section ${sectionIndex + 1}`
    }

    if (mode === 'Edit') {
      return `Edit Section ${sectionIndex + 1}`
    }

    return `Details Section ${sectionIndex + 1}`
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
            <button
              className="text-sm font-medium text-white/80"
              onClick={handleBack}
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



            {activeSections.map((section, sectionIndex) => (
              <section key={`${section.heading}-${sectionIndex}`} className="rounded-3xl bg-white p-4 shadow-sm">
                <button
                  type="button"
                  className="mb-4 flex w-full items-center justify-between gap-3 text-left"
                  onClick={() => toggleSection(getSectionKey(section, sectionIndex))}
                >
                    <div>
                      <h2 className="text-base font-semibold text-slate-900">
                        {resolveSectionHeading(section, sectionIndex)}
                      </h2>
                      {mode === 'View' && !isCreateMode ? (
                        <p className="mt-1 text-xs text-slate-500">
                          {resolveSectionPreview(section) ||
                            'Tap section untuk buka/tutup, atau tap edit pada field untuk masuk ke mode edit.'}
                        </p>
                      ) : null}
                    </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        isCreateMode
                          ? 'bg-emerald-50 text-emerald-600'
                          : 'bg-orange-50 text-orange-600'
                      }`}
                    >
                      {section.rows.length} {section.rows.length === 1 ? 'row' : 'rows'}
                    </span>
                    <span className="text-sm text-slate-400">
                      {collapsedSections[getSectionKey(section, sectionIndex)] ? '+' : '-'}
                    </span>
                  </div>
                </button>

                <div
                  className={`space-y-3 ${
                    collapsedSections[getSectionKey(section, sectionIndex)] ? 'hidden' : ''
                  }`}
                >
                  {section.rows.map((row, rowIndex) => (
                    <div key={`${sectionIndex}-${rowIndex}`} className="grid gap-3">
                      {row.items.map((item, itemIndex) => (
                        <HzRecordItem
                          key={`${sectionIndex}-${rowIndex}-${itemIndex}`}
                          item={{
                            ...item,
                            label:
                              shouldShowLookupReferenceCard && item.linkId
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
                            mode,
                            tone: isCreateMode ? 'emerald' : 'orange',
                            placeholderForComponent: isCreateMode
                              ? (component) => (component.required ? 'Wajib diisi' : '')
                              : undefined,
                            showInlineEditCue: !isCreateMode && mode === 'View',
                            canInlineEditComponent: (component) => Boolean(component.editableForUpdate),
                            showRequiredBadge: isCreateMode,
                            readOnlyClassName: isCreateMode
                              ? 'mt-2 text-sm leading-6 text-slate-500'
                              : undefined,
                            referenceCard:
                              shouldShowLookupReferenceCard && item.linkId ? (
                                <div className="mt-2 rounded-2xl bg-white px-3 py-2 text-sm text-slate-700 shadow-sm">
                                  <p className="font-semibold text-slate-900">{item.linkText || item.linkId}</p>
                                  <p className="mt-1 text-xs text-slate-500">{item.linkId}</p>
                                </div>
                              ) : null,
                          }}
                          onInlineEdit={handleInlineEdit}
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
