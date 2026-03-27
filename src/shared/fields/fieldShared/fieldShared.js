export const EMPTY_TEXT = '-'
export const MULTI_PICKLIST_SEPARATOR = ';'

function groupDigits(digits, pattern) {
  const groups = []
  let cursor = 0

  pattern.forEach((length) => {
    if (cursor >= digits.length) return
    groups.push(digits.slice(cursor, cursor + length))
    cursor += length
  })

  if (cursor < digits.length) {
    groups.push(digits.slice(cursor))
  }

  return groups.filter(Boolean).join(' ')
}

export function formatIndonesianPhoneNumber(value) {
  if (!value) return ''

  const rawValue = String(value).trim()
  const hasLeadingPlus = rawValue.startsWith('+')
  const digits = rawValue.replace(/\D/g, '')

  if (!digits) return rawValue

  if (hasLeadingPlus && digits.startsWith('62')) {
    return `+62 ${groupDigits(digits.slice(2), [3, 4, 4, 4])}`.trim()
  }

  if (!hasLeadingPlus && digits.startsWith('62')) {
    return `62 ${groupDigits(digits.slice(2), [3, 4, 4, 4])}`.trim()
  }

  if (digits.startsWith('08')) {
    return groupDigits(digits, [4, 4, 4, 4])
  }

  if (digits.startsWith('0')) {
    return groupDigits(digits, [3, 4, 4, 4])
  }

  if (digits.startsWith('8')) {
    return groupDigits(digits, [3, 4, 4, 4])
  }

  return groupDigits(digits, [3, 4, 4, 4])
}

export function formatEmailValue(value) {
  if (!value) return ''
  return String(value).trim().toLowerCase()
}

export function toDateInputValue(value) {
  if (!value) return ''

  if (typeof value === 'string') {
    const matchedDate = value.match(/^(\d{4}-\d{2}-\d{2})/)
    if (matchedDate) return matchedDate[1]
  }

  const parsed = new Date(value)
  if (Number.isNaN(parsed.valueOf())) return ''

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function toDateTimeLocalInputValue(value) {
  if (!value) return ''

  const parsed = new Date(value)
  if (Number.isNaN(parsed.valueOf())) return ''

  const year = parsed.getFullYear()
  const month = String(parsed.getMonth() + 1).padStart(2, '0')
  const day = String(parsed.getDate()).padStart(2, '0')
  const hours = String(parsed.getHours()).padStart(2, '0')
  const minutes = String(parsed.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function fromDateTimeLocalInputValue(value) {
  if (!value) return ''

  const parsed = new Date(value)
  if (Number.isNaN(parsed.valueOf())) return value

  return parsed.toISOString()
}

export function formatDateDisplay(value, withTime = false) {
  if (!value) return ''

  const parsed = new Date(value)
  if (Number.isNaN(parsed.valueOf())) return String(value)

  if (withTime) {
    return parsed.toLocaleString('id-ID', {
      dateStyle: 'medium',
      timeStyle: 'short',
    })
  }

  return parsed.toLocaleDateString('id-ID', {
    dateStyle: 'medium',
  })
}

export function formatNumberDisplay(value, fieldInfo = {}) {
  if (value === null || value === undefined || value === '') return ''

  const numberValue = Number(value)
  if (Number.isNaN(numberValue)) return String(value)

  const { dataType, scale = 0 } = fieldInfo

  if (dataType === 'Currency') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: scale,
      maximumFractionDigits: scale,
    }).format(numberValue)
  }

  if (dataType === 'Percent') {
    return new Intl.NumberFormat('id-ID', {
      style: 'percent',
      minimumFractionDigits: scale,
      maximumFractionDigits: scale,
    }).format(numberValue / 100)
  }

  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: dataType === 'Int' ? 0 : scale,
    maximumFractionDigits: dataType === 'Int' ? 0 : scale,
  }).format(numberValue)
}

export function toMultiPicklistArray(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean)
  }

  if (!value) {
    return []
  }

  return String(value)
    .split(MULTI_PICKLIST_SEPARATOR)
    .map((item) => item.trim())
    .filter(Boolean)
}

export function fromMultiPicklistSelectOptions(options) {
  return Array.from(options)
    .filter((option) => option.selected)
    .map((option) => option.value)
    .join(MULTI_PICKLIST_SEPARATOR)
}

export function readReferenceHref(component) {
  const referenceId = component?.referenceRecordId || component?.value
  if (!referenceId) return ''
  return `/${referenceId}`
}

export function readTextValue(component) {
  if (!component) return ''

  if (
    component.displayValue !== null &&
    component.displayValue !== undefined &&
    component.displayValue !== ''
  ) {
    return component.displayValue
  }

  if (component.value === null || component.value === undefined || component.value === '') {
    return ''
  }

  if (Array.isArray(component.value)) {
    return component.value.join(', ')
  }

  if (typeof component.value === 'object') {
    return Object.values(component.value)
      .filter((item) => item !== null && item !== undefined && item !== '')
      .join(', ')
  }

  return String(component.value)
}

export function readCompoundObject(component) {
  const displayObject =
    component?.displayValue && typeof component.displayValue === 'object'
      ? component.displayValue
      : {}
  const valueObject =
    component?.value && typeof component.value === 'object'
      ? component.value
      : {}

  return {
    ...valueObject,
    ...displayObject,
  }
}

export function readNameDisplayValue(component) {
  const data = readCompoundObject(component)

  return [
    data.Salutation,
    data.FirstName,
    data.MiddleName,
    data.LastName,
    data.Suffix,
    data.InformalName,
  ]
    .filter(Boolean)
    .join(' ')
    .trim()
}

export function readAddressDisplayValue(component) {
  const data = readCompoundObject(component)
  const stateValue = data.StateCode || data.State || ''
  const countryValue = data.CountryCode || data.Country || ''
  const lineOne = [data.Street].filter(Boolean).join(' ')
  const lineTwo = [data.City, stateValue, data.PostalCode].filter(Boolean).join(', ')
  const lineThree = [countryValue].filter(Boolean).join(' ')

  return [lineOne, lineTwo, lineThree].filter(Boolean)
}

export function readLocationDisplayValue(component) {
  const latitude = component?.value?.latitude
  const longitude = component?.value?.longitude

  if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
    return ''
  }

  return `${latitude}, ${longitude}`
}

export function readLocationHref(component) {
  const latitude = component?.value?.latitude
  const longitude = component?.value?.longitude

  if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
    return ''
  }

  return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
}

export function resolveReadOnlyValue(component) {
  const fieldInfo = component?.fieldInfo || {}
  const fieldDataType = fieldInfo?.dataType

  if (component?.isCompoundField && fieldInfo?.extraTypeInfo === 'PersonName') {
    return readNameDisplayValue(component)
  }

  if (component?.isCompoundField && fieldInfo?.extraTypeInfo === 'SwitchablePersonName') {
    return readNameDisplayValue(component)
  }

  if (component?.isCompoundField && fieldDataType === 'Address') {
    return readAddressDisplayValue(component).join('\n')
  }

  if (fieldDataType === 'Location') {
    return readLocationDisplayValue(component)
  }

  if (fieldDataType === 'Phone' || fieldDataType === 'Fax') {
    return formatIndonesianPhoneNumber(component?.displayValue || component?.value || '')
  }

  if (fieldDataType === 'Email') {
    return formatEmailValue(component?.displayValue || component?.value || '')
  }

  if (fieldDataType === 'Date') {
    return formatDateDisplay(component?.displayValue || component?.value, false)
  }

  if (fieldDataType === 'DateTime') {
    return formatDateDisplay(component?.displayValue || component?.value, true)
  }

  if (
    fieldDataType === 'Currency' ||
    fieldDataType === 'Int' ||
    fieldDataType === 'Double' ||
    fieldDataType === 'Percent'
  ) {
    return formatNumberDisplay(component?.value, fieldInfo)
  }

  if (fieldDataType === 'Multipicklist') {
    return toMultiPicklistArray(component?.displayValue || component?.value).join(', ')
  }

  return readTextValue(component)
}

export function isRichTextField(component) {
  const fieldInfo = component?.fieldInfo || {}
  return (
    fieldInfo?.dataType === 'TextArea' &&
    (fieldInfo?.extraTypeInfo === 'RichTextArea' || fieldInfo?.htmlFormatted)
  )
}

export function isTextAreaField(component) {
  return component?.fieldInfo?.dataType === 'TextArea' && !isRichTextField(component)
}

export function getFieldInputFlags(component) {
  const fieldDataType = component?.fieldInfo?.dataType

  return {
    fieldDataType,
    isLookupField: Boolean(component?.isLookup),
    isDateField: fieldDataType === 'Date',
    isDateTimeField: fieldDataType === 'DateTime',
    isPhoneField: fieldDataType === 'Phone' || fieldDataType === 'Fax',
    isEmailField: fieldDataType === 'Email',
    isUrlField: fieldDataType === 'Url',
    isCheckboxField: fieldDataType === 'Boolean',
    isNumberField:
      fieldDataType === 'Currency' ||
      fieldDataType === 'Int' ||
      fieldDataType === 'Double' ||
      fieldDataType === 'Percent',
    isMultiPicklistField: fieldDataType === 'Multipicklist',
  }
}
