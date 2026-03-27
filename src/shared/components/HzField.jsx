import { HzInputField, HzOutputField } from '../fields/index.js'

export default function HzField({
  canEdit = false,
  ...props
}) {
  if (canEdit) {
    return <HzInputField {...props} />
  }

  return <HzOutputField {...props} />
}
