import { useEffect, useState } from 'react'

const EMPTY_TEXT = '-'
const MULTI_PICKLIST_SEPARATOR = ';'

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

function formatDateDisplay(value, withTime = false) {
  if (!value) return ''

  const parsed = new Date(value)
  if (Number.isNaN(parsed.valueOf())) return String(value)

  if (withTime) {
    return parsed.toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  return parsed.toLocaleDateString('id-ID', {
    dateStyle: 'medium',
  })
}

function formatNumberDisplay(value, fieldInfo = {}) {
  if (value === null || value === undefined || value === '') return ''

  const numberValue = Number(value)
  if (Number.isNaN(numberValue)) return String(value)

  const { dataType, scale = 0 } = fieldInfo

  if (dataType === 'Currency') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: scale,
      maximumFractionDigits: scale,
    }).format(numberValue)
  }

  if (dataType === 'Percent') {
    return new Intl.NumberFormat('id-ID', {
      style: 'percent',
      minimumFractionDigits: scale,
      maximumFractionDigits: scale,
    }).format(numberValue / 100)
  }

  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: dataType === 'Int' ? 0 : scale,
    maximumFractionDigits: dataType === 'Int' ? 0 : scale,
  }).format(numberValue)
}

function toMultiPicklistArray(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  if (!value) {
    return []
  }

  return String(value)
    .split(MULTI_PICKLIST_SEPARATOR)
    .map((item) => item.trim())
    .filter(Boolean)
}

function fromMultiPicklistSelectOptions(options) {
  return Array.from(options)
    .filter((option) => option.selected)
    .map((option) => option.value)
    .join(MULTI_PICKLIST_SEPARATOR)
}

function readReferenceHref(component) {
  const referenceId = component?.referenceRecordId || component?.value
  if (!referenceId) return ''
  return `/${referenceId}`
}

function readTextValue(component) {
  if (!component) return ''

  if (
    component.displayValue !== null &&
    component.displayValue !== undefined &&
    component.displayValue !== ''
  ) {
    return component.displayValue
  }

  if (component.value === null || component.value === undefined || component.value === '') {
    return ''
  }

  if (Array.isArray(component.value)) {
    return component.value.join(', ')
  }

  if (typeof component.value === 'object') {
    return Object.values(component.value)
      .filter((item) => item !== null && item !== undefined && item !== '')
      .join(', ')
  }

  return String(component.value)
}

function readCompoundObject(component) {
  const displayObject =
    component?.displayValue && typeof component.displayValue === 'object'
      ? component.displayValue
      : {}
  const valueObject =
    component?.value && typeof component.value === 'object'
      ? component.value
      : {}

  return {
    ...valueObject,
    ...displayObject,
  }
}

function readNameDisplayValue(component) {
  const data = readCompoundObject(component)

  return [
    data.Salutation,
    data.FirstName,
    data.MiddleName,
    data.LastName,
    data.Suffix,
    data.InformalName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim()
}

function readAddressDisplayValue(component) {
  const data = readCompoundObject(component)
  const stateValue = data.StateCode || data.State || ''
  const countryValue = data.CountryCode || data.Country || ''
  const lineOne = [data.Street].filter(Boolean).join(' ')
  const lineTwo = [data.City, stateValue, data.PostalCode].filter(Boolean).join(', ')
  const lineThree = [countryValue].filter(Boolean).join(' ')

  return [lineOne, lineTwo, lineThree].filter(Boolean)
}

function readLocationDisplayValue(component) {
  const latitude = component?.value?.latitude
  const longitude = component?.value?.longitude

  if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
    return ''
  }

  return `${latitude}, ${longitude}`
}

function readLocationHref(component) {
  const latitude = component?.value?.latitude
  const longitude = component?.value?.longitude

  if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
    return ''
  }

  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
}

function resolveReadOnlyValue(component) {
  const fieldInfo = component?.fieldInfo || {}
  const fieldDataType = fieldInfo?.dataType

  if (component?.isCompoundField && fieldInfo?.extraTypeInfo === 'PersonName') {
    return readNameDisplayValue(component)
  }

  if (component?.isCompoundField && fieldInfo?.extraTypeInfo === 'SwitchablePersonName') {
    return readNameDisplayValue(component)
  }

  if (component?.isCompoundField && fieldDataType === 'Address') {
    return readAddressDisplayValue(component).join('\n')
  }

  if (fieldDataType === 'Location') {
    return readLocationDisplayValue(component)
  }

  if (fieldDataType === 'Phone' || fieldDataType === 'Fax') {
    return formatIndonesianPhoneNumber(component?.displayValue || component?.value || '')
  }

  if (fieldDataType === 'Email') {
    return formatEmailValue(component?.displayValue || component?.value || '')
  }

  if (fieldDataType === 'Date') {
    return formatDateDisplay(component?.displayValue || component?.value, false)
  }

  if (fieldDataType === 'DateTime') {
    return formatDateDisplay(component?.displayValue || component?.value, true)
  }

  if (
    fieldDataType === 'Currency' ||
    fieldDataType === 'Int' ||
    fieldDataType === 'Double' ||
    fieldDataType === 'Percent'
  ) {
    return formatNumberDisplay(component?.value, fieldInfo)
  }

  if (fieldDataType === 'Multipicklist') {
    return toMultiPicklistArray(component?.displayValue || component?.value).join(', ')
  }

  return readTextValue(component)
}

function isRichTextField(component) {
  const fieldInfo = component?.fieldInfo || {}
  return (
    fieldInfo?.dataType === 'TextArea' &&
    (fieldInfo?.extraTypeInfo === 'RichTextArea' || fieldInfo?.htmlFormatted)
  )
}

function isTextAreaField(component) {
  return component?.fieldInfo?.dataType === 'TextArea' && !isRichTextField(component)
}

function renderReadOnlyContent(component, readOnlyClassName) {
  const fieldInfo = component?.fieldInfo || {}
  const fieldDataType = fieldInfo?.dataType
  const displayValue = resolveReadOnlyValue(component)
  const textClassName = `${readOnlyClassName} break-words`

  if (!displayValue && fieldDataType !== 'Boolean') {
    return <p className={textClassName}>{EMPTY_TEXT}</p>
  }

  if (fieldDataType === 'Boolean') {
    return (
      <span
        className={`mt-2 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
          component?.value
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-200 text-slate-600'
        }`}
      >
        {component?.value ? 'True' : 'False'}
      </span>
    )
  }

  if (component?.isLookup) {
    const href = readReferenceHref(component)

    if (!href) {
      return <p className={textClassName}>{displayValue || EMPTY_TEXT}</p>
    }

    return (
      <a href={href} className={`${textClassName} inline-flex text-orange-600 underline decoration-orange-200 underline-offset-4`}>
        {displayValue}
      </a>
    )
  }

  if (fieldDataType === 'Email') {
    return (
      <a href={`mailto:${displayValue}`} className={`${textClassName} inline-flex text-orange-600 underline decoration-orange-200 underline-offset-4`}>
        {displayValue}
      </a>
    )
  }

  if (fieldDataType === 'Phone' || fieldDataType === 'Fax') {
    const phoneHref = String(component?.value || '').replace(/\s+/g, '')
    return (
      <a href={`tel:${phoneHref}`} className={`${textClassName} inline-flex text-orange-600 underline decoration-orange-200 underline-offset-4`}>
        {displayValue}
      </a>
    )
  }

  if (fieldDataType === 'Url') {
    const href = String(component?.value || component?.displayValue || '')
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${textClassName} inline-flex text-orange-600 underline decoration-orange-200 underline-offset-4`}
      >
        {displayValue}
      </a>
    )
  }

  if (component?.isCompoundField && fieldDataType === 'Address') {
    return (
      <div className={`${textClassName} space-y-1 whitespace-pre-wrap`}>
        {readAddressDisplayValue(component).map((line, index) => (
          <p key={`${component?.field || 'address'}-${index}`}>{line}</p>
        ))}
      </div>
    )
  }

  if (fieldDataType === 'Location') {
    const href = readLocationHref(component)

    if (!href) {
      return <p className={textClassName}>{displayValue || EMPTY_TEXT}</p>
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${textClassName} inline-flex text-orange-600 underline decoration-orange-200 underline-offset-4`}
      >
        {displayValue}
      </a>
    )
  }

  if (isRichTextField(component)) {
    return (
      <div
        className={textClassName}
        dangerouslySetInnerHTML={{ __html: String(component?.displayValue || component?.value || '') }}
      />
    )
  }

  if (isTextAreaField(component)) {
    return <p className={`${textClassName} whitespace-pre-wrap`}>{displayValue}</p>
  }

  return <p className={textClassName}>{displayValue}</p>
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
  const isUrlField = fieldDataType === 'Url'
  const isCheckboxField = fieldDataType === 'Boolean'
  const isNumberField =
    fieldDataType === 'Currency' ||
    fieldDataType === 'Int' ||
    fieldDataType === 'Double' ||
    fieldDataType === 'Percent'
  const isMultiPicklistField = fieldDataType === 'Multipicklist'
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
    return renderReadOnlyContent(component, readOnlyClassName)
  }

  if (component?.picklistUrl) {
    if (isMultiPicklistField) {
      return (
        <div className="mt-2 space-y-2">
          <select
            multiple
            className={`${inputClassName} min-h-28`}
            value={toMultiPicklistArray(editValue?.current)}
            onChange={(event) =>
              onChange?.(component.field, fromMultiPicklistSelectOptions(event.target.options))
            }
          >
            {(picklist?.values || []).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {hasFieldError ? <p className="text-xs text-rose-600">{fieldError}</p> : null}
          <p className="text-xs text-slate-500">Pilih lebih dari satu opsi dengan tap atau klik bertahap.</p>
        </div>
      )
    }

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
          onBlur={() => {
            window.setTimeout(() => {
              setIsLookupOpen(false)
            }, 150)
          }}
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

  if (isCheckboxField) {
    return (
      <div className="mt-2 space-y-2">
        <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={Boolean(editValue?.current)}
            onChange={(event) => onChange?.(component.field, event.target.checked)}
          />
          <span>{component?.label}</span>
        </label>
        {hasFieldError ? <p className="text-xs text-rose-600">{fieldError}</p> : null}
      </div>
    )
  }

  if (isDateField) {
    return (
      <div className="mt-2 space-y-2">
        <input
          type="date"
          className={inputClassName}
          value={toDateInputValue(editValue?.current)}
          onChange={(event) => onChange?.(component.field, event.target.value)}
        />
        {hasFieldError ? <p className="text-xs text-rose-600">{fieldError}</p> : null}
      </div>
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
          onChange={(event) =>
            onChange?.(component.field, formatIndonesianPhoneNumber(event.target.value))
          }
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

  if (isUrlField) {
    return (
      <div className="mt-2 space-y-2">
        <input
          type="url"
          inputMode="url"
          className={inputClassName}
          value={editValue?.current ?? ''}
          onChange={(event) => onChange?.(component.field, event.target.value)}
          placeholder={placeholder || 'https://contoh.com'}
        />
        {hasFieldError ? <p className="text-xs text-rose-600">{fieldError}</p> : null}
      </div>
    )
  }

  if (isNumberField) {
    return (
      <div className="mt-2 space-y-2">
        <input
          type="number"
          step={fieldDataType === 'Int' ? '1' : 'any'}
          inputMode="decimal"
          className={inputClassName}
          value={editValue?.current ?? ''}
          onChange={(event) => onChange?.(component.field, event.target.value)}
          placeholder={placeholder}
        />
        {hasFieldError ? <p className="text-xs text-rose-600">{fieldError}</p> : null}
      </div>
    )
  }

  if (isTextAreaField(component) || isRichTextField(component)) {
    return (
      <div className="mt-2 space-y-2">
        <textarea
          rows={isRichTextField(component) ? 6 : 4}
          className={`${inputClassName} resize-y`}
          value={editValue?.current ?? ''}
          onChange={(event) => onChange?.(component.field, event.target.value)}
          placeholder={placeholder}
        />
        {hasFieldError ? <p className="text-xs text-rose-600">{fieldError}</p> : null}
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
