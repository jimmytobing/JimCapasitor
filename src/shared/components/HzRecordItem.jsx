import HzField from './HzField.jsx'

export default function HzRecordItem({
  item,
  editContext,
  picklistContext,
  lookupContext,
  ui,
  onInlineEdit,
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
    mode = 'View',
    placeholderForComponent,
    showRequiredBadge = false,
    showInlineEditCue = false,
    canInlineEditComponent,
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
            <div className="ml-auto flex items-center gap-2">
              {showInlineEditCue && mode === 'View' && canInlineEditComponent?.(component) ? (
                <button
                  type="button"
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-orange-200 hover:text-orange-600"
                  onClick={() => onInlineEdit?.(component)}
                  aria-label={`Edit ${component.label}`}
                  title={`Edit ${component.label}`}
                >
                  <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.12 2.12 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />
                  </svg>
                </button>
              ) : null}
              {showRequiredBadge && component.required ? (
                <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-rose-600">
                  Required
                </span>
              ) : null}
            </div>
          </div>
          {component?.fieldInfo?.inlineHelpText ? (
            <p className="mt-1 text-xs leading-5 text-slate-500">{component.fieldInfo.inlineHelpText}</p>
          ) : null}
          <HzField
            component={component}
            editValue={editValues?.[component.field]}
            canEdit={Boolean(canEditComponent?.(component))}
            picklist={picklists?.[component.picklistUrl]}
            picklistDisabled={Boolean(picklists?.[component.picklistUrl]?.disabled)}
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
