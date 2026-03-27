import HzRecordForm from '../recordForm/HzRecordForm.jsx'
import { resolveSectionPreview } from '../recordSectionUtils/recordSectionUtils.js'

export default function HzRecordViewForm({
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
    <HzRecordForm
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
