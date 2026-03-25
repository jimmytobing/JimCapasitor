import { useEffect } from 'react'

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
  onEnsurePicklist,
  objectApiName,
  recordTypeId,
  tone = 'orange',
  placeholder = '',
  readOnlyClassName = 'mt-2 text-sm leading-6 text-slate-700',
}) {
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
