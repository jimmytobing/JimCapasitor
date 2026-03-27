import { useEffect, useState } from 'react'
import {
  formatEmailValue,
  formatIndonesianPhoneNumber,
  fromDateTimeLocalInputValue,
  fromMultiPicklistSelectOptions,
  getFieldInputFlags,
  isRichTextField,
  isTextAreaField,
  toDateInputValue,
  toDateTimeLocalInputValue,
  toMultiPicklistArray,
} from '../fieldShared/index.js'

export default function InputField({
  component,
  editValue,
  picklist,
  picklistDisabled = false,
  onChange,
  onLookupChange,
  onSearchLookup,
  onEnsurePicklist,
  objectApiName,
  recordTypeId,
  tone = 'orange',
  fieldError = '',
  placeholder = '',
}) {
  const [lookupQuery, setLookupQuery] = useState('')
  const [lookupOptions, setLookupOptions] = useState([])
  const [lookupLoading, setLookupLoading] = useState(false)
  const [lookupError, setLookupError] = useState('')
  const [isLookupOpen, setIsLookupOpen] = useState(false)

  const {
    fieldDataType,
    isLookupField,
    isDateField,
    isDateTimeField,
    isPhoneField,
    isEmailField,
    isUrlField,
    isCheckboxField,
    isNumberField,
    isMultiPicklistField,
  } = getFieldInputFlags(component)

  const hasFieldError = Boolean(fieldError)

  useEffect(() => {
    if (
      component?.picklistUrl &&
      !picklist?.values?.length &&
      typeof onEnsurePicklist === 'function'
    ) {
      void onEnsurePicklist(
        component.picklistUrl,
        objectApiName,
        recordTypeId,
        component.field,
        component.fieldInfo
      )
    }
  }, [
    component?.field,
    component?.fieldInfo,
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
    if (!isLookupField || !isLookupOpen || typeof onSearchLookup !== 'function') {
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
  }, [component, isLookupField, isLookupOpen, lookupQuery, onSearchLookup])

  const toneClassByName = {
    orange: 'border-orange-200 bg-orange-50 focus:border-orange-400',
    emerald: 'border-emerald-200 bg-emerald-50 focus:border-emerald-400',
    slate: 'border-slate-200 bg-slate-50 focus:border-slate-400',
  }

  const toneClass = toneClassByName[tone] || toneClassByName.orange
  const inputClassName = `w-full rounded-2xl border px-3 py-2 text-sm text-slate-900 outline-none ${
    hasFieldError ? 'border-rose-300 bg-rose-50 focus:border-rose-500' : toneClass
  }`

  if (component?.picklistUrl) {
    if (isMultiPicklistField) {
      return (
        <div className="mt-2 space-y-2">
          <select
            multiple
            className={`${inputClassName} min-h-28`}
            value={toMultiPicklistArray(editValue?.current)}
            disabled={picklistDisabled}
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
          <p className="text-xs text-slate-500">
            {picklistDisabled
              ? 'Isi field controller lebih dulu sebelum memilih opsi.'
              : 'Pilih lebih dari satu opsi dengan tap atau klik bertahap.'}
          </p>
        </div>
      )
    }

    return (
      <div className="mt-2 space-y-2">
        <select
          className={inputClassName}
          value={editValue?.current ?? ''}
          disabled={picklistDisabled}
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
        {picklistDisabled ? (
          <p className="text-xs text-slate-500">Isi field controller lebih dulu sebelum memilih opsi.</p>
        ) : null}
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
