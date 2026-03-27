import HzField from './HzField.jsx'

export default function HzRecordItem({
  item,
  editContext,
  picklistContext,
  lookupContext,
  ui,
}) {
  const {
    values: editValues,
    fieldErrors,
    onChange,
    canEditComponent,
    onLookupChange,
  } = editContext || {}
  const {
    values: picklists,
    ensure: onEnsurePicklist,
    objectApiName,
    recordTypeId,
  } = picklistContext || {}
  const { onSearch: onSearchLookup } = lookupContext || {}
  const {
    tone = 'orange',
    placeholderForComponent,
    showRequiredBadge = false,
    readOnlyClassName = 'mt-2 text-sm leading-6 text-slate-700',
    emptyText = '-',
    referenceCard = null,
  } = ui || {}
  const visibleComponents = item?.values || []
  const shouldShowItemLabel =
    !item?.customLinkUrl &&
    Boolean(item?.label) &&
    (visibleComponents.length > 1 || Boolean(referenceCard))
  const itemLabelClassName = referenceCard
    ? 'text-sm font-medium text-slate-700'
    : 'text-xs font-semibold uppercase tracking-[0.2em] text-slate-400'
  const hasAnyFieldError = visibleComponents.some((component) => Boolean(fieldErrors?.[component.field]))

  return (
    <div className={`rounded-2xl p-4 ${hasAnyFieldError ? 'bg-rose-50 ring-1 ring-rose-100' : 'bg-slate-50'}`}>
      {shouldShowItemLabel ? (
        <p className={itemLabelClassName}>{item?.label}</p>
      ) : null}

      {referenceCard}

      {!referenceCard && visibleComponents.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">{emptyText}</p>
      ) : null}

      {visibleComponents.map((component) => (
        <div key={component.field} className="mt-2">
          <div className="flex items-center gap-2">
            <span className={fieldErrors?.[component.field] ? 'text-sm font-medium text-rose-700' : 'text-sm font-medium text-slate-700'}>
              {component.label}
            </span>
            {showRequiredBadge && component.required ? (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-600">
                Required
              </span>
            ) : null}
          </div>
          {component?.fieldInfo?.inlineHelpText ? (
            <p className="mt-1 text-xs leading-5 text-slate-500">{component.fieldInfo.inlineHelpText}</p>
          ) : null}
          <HzField
            component={component}
            editValue={editValues?.[component.field]}
            canEdit={Boolean(canEditComponent?.(component))}
            picklist={picklists?.[component.picklistUrl]}
            onChange={onChange}
            onLookupChange={onLookupChange}
            onSearchLookup={onSearchLookup}
            onEnsurePicklist={onEnsurePicklist}
            objectApiName={objectApiName}
            recordTypeId={recordTypeId}
            tone={tone}
            fieldError={fieldErrors?.[component.field] || ''}
            placeholder={placeholderForComponent?.(component) || ''}
            readOnlyClassName={readOnlyClassName}
          />
        </div>
      ))}
    </div>
  )
}
