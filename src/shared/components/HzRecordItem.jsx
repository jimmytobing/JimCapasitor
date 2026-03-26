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
    visibleComponents.length > 1

  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      {shouldShowItemLabel ? (
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{item?.label}</p>
      ) : null}

      {referenceCard}

      {!referenceCard && visibleComponents.length === 0 ? (
        <p className="mt-2 text-sm text-slate-500">{emptyText}</p>
      ) : null}

      {visibleComponents.map((component) => (
        <div key={component.field} className="mt-2">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-slate-700">{component.label}</span>
            {showRequiredBadge && component.required ? (
              <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-600">
                Required
              </span>
            ) : null}
          </div>
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
            placeholder={placeholderForComponent?.(component) || ''}
            readOnlyClassName={readOnlyClassName}
          />
        </div>
      ))}
    </div>
  )
}
