import { RecordForm } from '../recordForm/index.js'
import { resolveSectionPreview } from '../recordSectionUtils/index.js'

export default function RecordViewForm({
  sections,
  collapsedSections,
  onToggleSection,
  resolveItem,
  resolveItemValues,
  editContext,
  picklistContext,
  lookupContext,
  onInlineEdit,
}) {
  return (
    <RecordForm
      sections={sections}
      collapsedSections={collapsedSections}
      onToggleSection={onToggleSection}
      mode="View"
      tone="orange"
      resolveItem={resolveItem}
      editContext={editContext}
      picklistContext={picklistContext}
      lookupContext={lookupContext}
      onInlineEdit={onInlineEdit}
      renderSectionSubtitle={(section) =>
        resolveSectionPreview(section, resolveItemValues) ||
        'Tap section untuk buka/tutup, atau tap edit pada field untuk masuk ke mode edit.'
      }
    />
  )
}
