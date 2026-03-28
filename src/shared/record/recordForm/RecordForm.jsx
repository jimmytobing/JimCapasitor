import RecordItem from './RecordItem.jsx'
import { getSectionKey, resolveSectionHeading } from '../recordSectionUtils/index.js'

export default function RecordForm({
  sections = [],
  collapsedSections,
  onToggleSection,
  isCreateMode = false,
  mode = 'View',
  tone = 'orange',
  resolveItem,
  editContext,
  picklistContext,
  lookupContext,
  renderSectionSubtitle,
  onInlineEdit,
  onSaveDirtyField,
  onCancelDirtyField,
}) {
  return sections.map((section, sectionIndex) => {
    const sectionKey = getSectionKey(section, sectionIndex)
    const isCollapsed = Boolean(collapsedSections?.[sectionKey])
    const subtitle = renderSectionSubtitle?.(section, sectionIndex) || ''
    const dirtyCount = section.rows.reduce((total, row) => {
      return (
        total +
        row.items.reduce((rowTotal, item) => {
          return (
            rowTotal +
            item.values.reduce((itemTotal, component) => {
              const fieldState = editContext?.values?.[component.field]
              return fieldState?.original !== fieldState?.current ? itemTotal + 1 : itemTotal
            }, 0)
          )
        }, 0)
      )
    }, 0)

    return (
      <section key={sectionKey} className="rounded-3xl bg-white p-4 shadow-sm">
        <button
          type="button"
          className="mb-4 flex w-full items-center justify-between gap-3 text-left"
          onClick={() => onToggleSection?.(sectionKey)}
        >
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              {resolveSectionHeading(section, sectionIndex, { isCreateMode, mode })}
            </h2>
            {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
          </div>
          <div className="flex items-center gap-2">
            {dirtyCount > 0 ? (
              <span
                className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                  tone === 'emerald'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-orange-50 text-orange-600'
                }`}
              >
                {dirtyCount}
              </span>
            ) : null}
            <span className="text-sm text-slate-400">{isCollapsed ? '+' : '-'}</span>
          </div>
        </button>

        <div className={`space-y-3 ${isCollapsed ? 'hidden' : ''}`}>
          {section.rows.map((row, rowIndex) => (
            <div key={`${sectionKey}-${rowIndex}`} className="grid gap-3">
              {row.items.map((item, itemIndex) => {
                const resolvedItem = resolveItem?.(item) || item

                return (
                  <RecordItem
                    key={`${sectionKey}-${rowIndex}-${itemIndex}`}
                    item={resolvedItem}
                    editContext={editContext}
                    picklistContext={picklistContext}
                    lookupContext={lookupContext}
                    ui={{
                      mode,
                      tone,
                      placeholderForComponent: isCreateMode
                        ? (component) => (component.required ? 'Wajib diisi' : '')
                        : undefined,
                      showInlineEditCue: !isCreateMode && mode === 'View',
                      canInlineEditComponent: (component) =>
                        !isCreateMode && Boolean(component.editableForUpdate),
                      showRequiredBadge: isCreateMode,
                      readOnlyClassName: isCreateMode
                        ? 'mt-2 text-sm leading-6 text-slate-500'
                        : undefined,
                      ...(resolvedItem.ui || {}),
                    }}
                    onInlineEdit={onInlineEdit}
                    onSaveDirtyField={onSaveDirtyField}
                    onCancelDirtyField={onCancelDirtyField}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </section>
    )
  })
}
