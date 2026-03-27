import { InputField, OutputField } from '../fields/index.js'

export default function Field({
  canEdit = false,
  ...props
}) {
  if (canEdit) {
    return <InputField {...props} />
  }

  return <OutputField {...props} />
}
