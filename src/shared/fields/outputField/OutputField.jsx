import {
  EMPTY_TEXT,
  isRichTextField,
  isTextAreaField,
  readAddressDisplayValue,
  readLocationHref,
  readReferenceHref,
  resolveReadOnlyValue,
} from '../fieldShared/index.js'

export default function OutputField({
  component,
  readOnlyClassName = 'mt-2 text-sm leading-6 text-slate-700',
}) {
  const fieldInfo = component?.fieldInfo || {}
  const fieldDataType = fieldInfo?.dataType
  const displayValue = resolveReadOnlyValue(component)
  const textClassName = `${readOnlyClassName} break-words`

  if (!displayValue && fieldDataType !== 'Boolean') {
    return <p className={textClassName}>{EMPTY_TEXT}</p>
  }

  if (fieldDataType === 'Boolean') {
    return (
      <span
        className={`mt-2 inline-flex w-fit rounded-full px-3 py-1 text-xs font-semibold ${
          component?.value
            ? 'bg-emerald-100 text-emerald-700'
            : 'bg-slate-200 text-slate-600'
        }`}
      >
        {component?.value ? 'True' : 'False'}
      </span>
    )
  }

  if (component?.isLookup) {
    const href = readReferenceHref(component)

    if (!href) {
      return <p className={textClassName}>{displayValue || EMPTY_TEXT}</p>
    }

    return (
      <a href={href} className={`${textClassName} inline-flex text-orange-600 underline decoration-orange-200 underline-offset-4`}>
        {displayValue}
      </a>
    )
  }

  if (fieldDataType === 'Email') {
    return (
      <a href={`mailto:${displayValue}`} className={`${textClassName} inline-flex text-orange-600 underline decoration-orange-200 underline-offset-4`}>
        {displayValue}
      </a>
    )
  }

  if (fieldDataType === 'Phone' || fieldDataType === 'Fax') {
    const phoneHref = String(component?.value || '').replace(/\s+/g, '')
    return (
      <a href={`tel:${phoneHref}`} className={`${textClassName} inline-flex text-orange-600 underline decoration-orange-200 underline-offset-4`}>
        {displayValue}
      </a>
    )
  }

  if (fieldDataType === 'Url') {
    const href = String(component?.value || component?.displayValue || '')
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${textClassName} inline-flex text-orange-600 underline decoration-orange-200 underline-offset-4`}
      >
        {displayValue}
      </a>
    )
  }

  if (component?.isCompoundField && fieldDataType === 'Address') {
    return (
      <div className={`${textClassName} space-y-1 whitespace-pre-wrap`}>
        {readAddressDisplayValue(component).map((line, index) => (
          <p key={`${component?.field || 'address'}-${index}`}>{line}</p>
        ))}
      </div>
    )
  }

  if (fieldDataType === 'Location') {
    const href = readLocationHref(component)

    if (!href) {
      return <p className={textClassName}>{displayValue || EMPTY_TEXT}</p>
    }

    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${textClassName} inline-flex text-orange-600 underline decoration-orange-200 underline-offset-4`}
      >
        {displayValue}
      </a>
    )
  }

  if (isRichTextField(component)) {
    return (
      <div
        className={textClassName}
        dangerouslySetInnerHTML={{ __html: String(component?.displayValue || component?.value || '') }}
      />
    )
  }

  if (isTextAreaField(component)) {
    return <p className={`${textClassName} whitespace-pre-wrap`}>{displayValue}</p>
  }

  return <p className={textClassName}>{displayValue}</p>
}
