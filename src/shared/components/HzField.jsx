import { useEffect, useState } from 'react'

function formatFieldValue(component) {
  if (component?.fieldInfo?.dataType === 'Phone' || component?.fieldInfo?.dataType === 'Fax') {
    return formatIndonesianPhoneNumber(component?.displayValue || component?.value || '') || '-'
  }

  if (component?.fieldInfo?.dataType === 'Email') {
    return formatEmailValue(component?.displayValue || component?.value || '') || '-'
  }

  if (component?.displayValue !== null && component?.displayValue !== undefined && component?.displayValue !== '') {
    return component.displayValue
  }

  if (component?.value !== null && component?.value !== undefined && component?.value !== '') {
    return String(component.value)
  }

  return '-'
}

function groupDigits(digits, pattern) {
  const groups = []
  let cursor = 0

  pattern.forEach((length) => {
    if (cursor >= digits.length) return
    groups.push(digits.slice(cursor, cursor + length))
    cursor += length
  })

  if (cursor < digits.length) {
    groups.push(digits.slice(cursor))
  }

  return groups.filter(Boolean).join(' ')
}

function formatIndonesianPhoneNumber(value) {
  if (!value) return ''

  const rawValue = String(value).trim()
  const hasLeadingPlus = rawValue.startsWith('+')
  const digits = rawValue.replace(/\D/g, '')

  if (!digits) return rawValue

  if (hasLeadingPlus && digits.startsWith('62')) {
    return `+62 ${groupDigits(digits.slice(2), [3, 4, 4, 4])}`.trim()
  }

  if (!hasLeadingPlus && digits.startsWith('62')) {
    return `62 ${groupDigits(digits.slice(2), [3, 4, 4, 4])}`.trim()
  }

  if (digits.startsWith('08')) {
    return groupDigits(digits, [4, 4, 4, 4])
  }

  if (digits.startsWith('0')) {
    return groupDigits(digits, [3, 4, 4, 4])
  }

  if (digits.startsWith('8')) {
    return groupDigits(digits, [3, 4, 4, 4])
  }

  return groupDigits(digits, [3, 4, 4, 4])
}

function formatEmailValue(value) {
  if (!value) return ''
  return String(value).trim().toLowerCase()
}

function toDateInputValue(value) {
  if (!value) return ''

  if (typeof value === 'string') {
    const matchedDate = value.match(/^(\d{4}-\d{2}-\d{2})/)
    if (matchedDate) return matchedDate[1]
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.valueOf())) return ''

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function toDateTimeLocalInputValue(value) {
  if (!value) return ''

  const parsed = new Date(value)
  if (Number.isNaN(parsed.valueOf())) return ''

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  const hours = String(parsed.getHours()).padStart(2, '0')
  const minutes = String(parsed.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function fromDateTimeLocalInputValue(value) {
  if (!value) return ''

  const parsed = new Date(value)
  if (Number.isNaN(parsed.valueOf())) return value

  return parsed.toISOString()
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
  fieldError = '',
  placeholder = '',
  readOnlyClassName = 'mt-2 text-sm leading-6 text-slate-700',
}) {
  const [lookupQuery, setLookupQuery] = useState('')
  const [lookupOptions, setLookupOptions] = useState([])
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [isLookupOpen, setIsLookupOpen] = useState(false)
  const isLookupField = Boolean(component?.isLookup)
  const fieldDataType = component?.fieldInfo?.dataType
  const isDateField = fieldDataType === 'Date'
  const isDateTimeField = fieldDataType === 'DateTime'
  const isPhoneField = fieldDataType === 'Phone' || fieldDataType === 'Fax'
  const isEmailField = fieldDataType === 'Email'
  const hasFieldError = Boolean(fieldError)

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
  const inputClassName = `w-full rounded-2xl border px-3 py-2 text-sm text-slate-900 outline-none ${
    hasFieldError ? 'border-rose-300 bg-rose-50 focus:border-rose-500' : toneClass
  }`

  if (!canEdit) {
    return <p className={readOnlyClassName}>{formatFieldValue(component)}</p>
  }

  if (component?.picklistUrl) {
    return (
      <div className="mt-2 space-y-2">
        <select
          className={inputClassName}
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
        {hasFieldError ? <p className="text-xs text-rose-600">{fieldError}</p> : null}
      </div>
    )
  }

  if (isLookupField) {
    return (
      <div className="mt-2 space-y-2">
        <input
          type="text"
          className={inputClassName}
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

        {hasFieldError ? <p className="text-xs text-rose-600">{fieldError}</p> : null}

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

  if (isDateField) {
    return (
      <input
        type="date"
        className={`mt-2 ${inputClassName}`}
        value={toDateInputValue(editValue?.current)}
        onChange={(event) => onChange?.(component.field, event.target.value)}
      />
    )
  }

  if (isDateTimeField) {
    return (
      <div className="mt-2 space-y-2">
        <input
          type="datetime-local"
          className={inputClassName}
          value={toDateTimeLocalInputValue(editValue?.current)}
          onChange={(event) =>
            onChange?.(component.field, fromDateTimeLocalInputValue(event.target.value))
          }
        />
        {hasFieldError ? <p className="text-xs text-rose-600">{fieldError}</p> : null}
        <p className="text-xs text-slate-500">Waktu mengikuti timezone browser saat ini.</p>
      </div>
    )
  }

  if (isPhoneField) {
    return (
      <div className="mt-2 space-y-2">
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          className={inputClassName}
          value={formatIndonesianPhoneNumber(editValue?.current ?? '')}
          onChange={(event) => onChange?.(component.field, formatIndonesianPhoneNumber(event.target.value))}
          placeholder={placeholder || 'Masukkan nomor telepon'}
        />
        {hasFieldError ? <p className="text-xs text-rose-600">{fieldError}</p> : null}
        <p className="text-xs text-slate-500">Format otomatis mengikuti pola nomor telepon Indonesia.</p>
      </div>
    )
  }

  if (isEmailField) {
    return (
      <div className="mt-2 space-y-2">
        <input
          type="email"
          inputMode="email"
          autoComplete="email"
          className={inputClassName}
          value={formatEmailValue(editValue?.current ?? '')}
          onChange={(event) => onChange?.(component.field, formatEmailValue(event.target.value))}
          placeholder={placeholder || 'nama@email.com'}
        />
        {hasFieldError ? <p className="text-xs text-rose-600">{fieldError}</p> : null}
        <p className="text-xs text-slate-500">Email dirapikan otomatis ke format huruf kecil.</p>
      </div>
    )
  }

  return (
    <div className="mt-2 space-y-2">
      <input
        type="text"
        className={inputClassName}
        value={editValue?.current ?? ''}
        onChange={(event) => onChange?.(component.field, event.target.value)}
        placeholder={placeholder}
      />
      {hasFieldError ? <p className="text-xs text-rose-600">{fieldError}</p> : null}
    </div>
  )
}
