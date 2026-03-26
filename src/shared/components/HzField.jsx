import { useEffect, useState } from 'react'

function formatFieldValue(component) {
  if (component?.displayValue !== null && component?.displayValue !== undefined && component?.displayValue !== '') {
    return component.displayValue
  }

  if (component?.value !== null && component?.value !== undefined && component?.value !== '') {
    return String(component.value)
  }

  return '-'
}

export default function HzField({
  component,
  editValue,
  canEdit = false,
  picklist,
  onChange,
  onLookupChange,
  onSearchLookup,
  onEnsurePicklist,
  objectApiName,
  recordTypeId,
  tone = 'orange',
  placeholder = '',
  readOnlyClassName = 'mt-2 text-sm leading-6 text-slate-700',
}) {
  const [lookupQuery, setLookupQuery] = useState('')
  const [lookupOptions, setLookupOptions] = useState([])
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [isLookupOpen, setIsLookupOpen] = useState(false)
  const isLookupField = Boolean(component?.isLookup)

  useEffect(() => {
    if (
      canEdit &&
      component?.picklistUrl &&
      !picklist?.values?.length &&
      typeof onEnsurePicklist === 'function'
    ) {
      void onEnsurePicklist(component.picklistUrl, objectApiName, recordTypeId, component.field)
    }
  }, [
    canEdit,
    component?.field,
    component?.picklistUrl,
    objectApiName,
    onEnsurePicklist,
    picklist?.values?.length,
    recordTypeId,
  ])

  useEffect(() => {
    if (!isLookupField) return

    setLookupQuery(editValue?.displayCurrent || editValue?.current || '')
  }, [editValue?.current, editValue?.displayCurrent, isLookupField])

  useEffect(() => {
    if (!canEdit || !isLookupField || !isLookupOpen || typeof onSearchLookup !== 'function') {
      return undefined
    }

    let isMounted = true
    const timer = window.setTimeout(async () => {
      try {
        setLookupLoading(true)
        setLookupError('')
        const results = await onSearchLookup(component, lookupQuery)
        if (!isMounted) return
        setLookupOptions(Array.isArray(results) ? results : [])
      } catch (error) {
        if (!isMounted) return
        setLookupOptions([])
        setLookupError(error?.message || 'Gagal mencari lookup.')
      } finally {
        if (isMounted) {
          setLookupLoading(false)
        }
      }
    }, 250)

    return () => {
      isMounted = false
      window.clearTimeout(timer)
    }
  }, [canEdit, component, isLookupField, isLookupOpen, lookupQuery, onSearchLookup])

  const toneClassByName = {
    orange: 'border-orange-200 bg-orange-50 focus:border-orange-400',
    emerald: 'border-emerald-200 bg-emerald-50 focus:border-emerald-400',
    slate: 'border-slate-200 bg-slate-50 focus:border-slate-400',
  }

  const toneClass = toneClassByName[tone] || toneClassByName.orange

  if (!canEdit) {
    return <p className={readOnlyClassName}>{formatFieldValue(component)}</p>
  }

  if (component?.picklistUrl) {
    return (
      <select
        className={`mt-2 w-full rounded-2xl border px-3 py-2 text-sm text-slate-900 outline-none ${toneClass}`}
        value={editValue?.current ?? ''}
        onChange={(event) => onChange?.(component.field, event.target.value)}
      >
        <option value="">Pilih {component?.label}</option>
        {(picklist?.values || []).map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    )
  }

  if (isLookupField) {
    return (
      <div className="mt-2 space-y-2">
        <input
          type="text"
          className={`w-full rounded-2xl border px-3 py-2 text-sm text-slate-900 outline-none ${toneClass}`}
          value={lookupQuery}
          onFocus={() => setIsLookupOpen(true)}
          onChange={(event) => {
            const nextValue = event.target.value
            setLookupQuery(nextValue)
            setIsLookupOpen(true)

            if (!nextValue.trim()) {
              onLookupChange?.(component.field, '', '')
              return
            }

            if (editValue?.current && nextValue !== editValue?.displayCurrent) {
              onLookupChange?.(component.field, '', '')
            }
          }}
          placeholder={placeholder || `Cari ${component?.label}`}
        />

        {editValue?.current ? (
          <p className="text-xs text-slate-500">Selected Id: {editValue.current}</p>
        ) : null}

        {isLookupOpen ? (
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            {lookupLoading ? (
              <p className="px-3 py-2 text-sm text-slate-500">Mencari record...</p>
            ) : null}

            {!lookupLoading && lookupError ? (
              <p className="px-3 py-2 text-sm text-rose-600">{lookupError}</p>
            ) : null}

            {!lookupLoading && !lookupError && lookupOptions.length === 0 ? (
              <p className="px-3 py-2 text-sm text-slate-500">Tidak ada hasil lookup.</p>
            ) : null}

            {!lookupLoading && !lookupError
              ? lookupOptions.map((option) => (
                  <button
                    key={`${option.objectApiName}-${option.id}`}
                    type="button"
                    className="block w-full border-b border-slate-100 px-3 py-2 text-left last:border-b-0 hover:bg-slate-50"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      onLookupChange?.(component.field, option.id, option.label)
                      setLookupQuery(option.label)
                      setIsLookupOpen(false)
                    }}
                  >
                    <p className="text-sm font-medium text-slate-900">{option.label}</p>
                    <p className="text-xs text-slate-500">{option.id}</p>
                  </button>
                ))
              : null}
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <input
      type="text"
      className={`mt-2 w-full rounded-2xl border px-3 py-2 text-sm text-slate-900 outline-none ${toneClass}`}
      value={editValue?.current ?? ''}
      onChange={(event) => onChange?.(component.field, event.target.value)}
      placeholder={placeholder}
    />
  )
}
