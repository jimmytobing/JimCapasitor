export function resolveViewItemLabel(item) {
  if (item?.label) return item.label

  const lookupComponent = item?.values?.find((component) => component.fieldInfo?.reference)
  if (!lookupComponent?.fieldInfo?.label) return ''

  return lookupComponent.fieldInfo.label.replace(/\s+ID$/, '')
}

export function resolveLookupComponentLabel(component, item) {
  if (item?.label) return item.label
  if (component?.label && !/\s+ID$/.test(component.label)) return component.label
  if (component?.fieldInfo?.label) return component.fieldInfo.label.replace(/\s+ID$/, '')
  return component?.label || ''
}

export function resolveItemValues(item, { shouldShowLookupReferenceCard, isCreateMode, mode }) {
  const baseValues = item?.values || []

  if (shouldShowLookupReferenceCard && item?.linkId) {
    return baseValues.filter((component) => !component.fieldInfo?.reference)
  }

  if (!isCreateMode && mode === 'Edit') {
    return baseValues.map((component) =>
      component.fieldInfo?.reference
        ? {
            ...component,
            label: resolveLookupComponentLabel(component, item),
          }
        : component
    )
  }

  return baseValues
}

export function formatSectionPreviewValue(component) {
  if (!component) return ''

  const compoundObject =
    component.value && typeof component.value === 'object'
      ? {
          ...component.value,
          ...(component.displayValue && typeof component.displayValue === 'object'
            ? component.displayValue
            : {}),
        }
      : {}

  if (component.isCompoundField && component.fieldInfo?.dataType === 'Address') {
    const address = compoundObject
    const stateValue = address.StateCode || address.State || ''
    const countryValue = address.CountryCode || address.Country || ''
    return [address.Street, address.City, stateValue, address.PostalCode, countryValue]
      .filter(Boolean)
      .join(', ')
  }

  if (
    component.isCompoundField &&
    (component.fieldInfo?.extraTypeInfo === 'PersonName' ||
      component.fieldInfo?.extraTypeInfo === 'SwitchablePersonName')
  ) {
    const nameValue = compoundObject

    return [
      nameValue.Salutation,
      nameValue.FirstName,
      nameValue.MiddleName,
      nameValue.LastName,
      nameValue.Suffix,
      nameValue.InformalName,
    ]
      .filter(Boolean)
      .join(' ')
      .trim()
  }

  if (component.isCompoundField && component.fieldInfo?.dataType === 'Location') {
    const latitude = component?.value?.latitude
    const longitude = component?.value?.longitude
    if (latitude === null || latitude === undefined || longitude === null || longitude === undefined) {
      return ''
    }
    return `${latitude}, ${longitude}`
  }

  if (component.isCompoundField && typeof component.displayValue === 'object') {
    return Object.values(compoundObject).filter(Boolean).join(', ')
  }

  if (component.displayValue !== null && component.displayValue !== undefined && component.displayValue !== '') {
    return String(component.displayValue)
  }

  if (component.value !== null && component.value !== undefined && component.value !== '') {
    if (typeof component.value === 'object') {
      return Object.values(component.value).filter(Boolean).join(' ')
    }

    return String(component.value)
  }

  return ''
}

export function resolveSectionPreview(section, resolveValues) {
  const allComponents = []

  section.rows.forEach((row) => {
    row.items.forEach((item) => {
      resolveValues(item).forEach((component) => {
        allComponents.push(component)
      })
    })
  })

  const prioritizedComponents = [
    ...allComponents.filter((component) => component?.isCompoundField),
    ...allComponents.filter((component) => !component?.isCompoundField),
  ]

  const previews = prioritizedComponents
    .map((component) => formatSectionPreviewValue(component).trim())
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .slice(0, 3)

  return previews.join(' • ')
}

export function getSectionKey(section, sectionIndex) {
  return `${section.heading || 'section'}-${sectionIndex}`
}

export function resolveSectionHeading(section, sectionIndex, { isCreateMode, mode }) {
  if (section?.heading) {
    return section.heading
  }

  if (isCreateMode) {
    return `Create Section ${sectionIndex + 1}`
  }

  if (mode === 'Edit') {
    return `Edit Section ${sectionIndex + 1}`
  }

  return `Details Section ${sectionIndex + 1}`
}
