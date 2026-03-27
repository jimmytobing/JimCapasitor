import RecordItem from '../../components/RecordItem.jsx'
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
}) {
  return sections.map((section, sectionIndex) => {
    const sectionKey = getSectionKey(section, sectionIndex)
    const isCollapsed = Boolean(collapsedSections?.[sectionKey])
    const subtitle = renderSectionSubtitle?.(section, sectionIndex) || ''

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
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${
                tone === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-orange-50 text-orange-600'
              }`}
            >
              {section.rows.length} {section.rows.length === 1 ? 'row' : 'rows'}
            </span>
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
