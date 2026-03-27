export function getControllerFieldName(fieldInfo = {}) {
  return (
    fieldInfo?.controllerName ||
    fieldInfo?.controllingField ||
    fieldInfo?.controllingFields?.[0] ||
    ''
  )
}

export function normalizePicklistMeta(result, fieldApiName, fieldInfo = {}) {
  return {
    ...result,
    fieldApiName,
    controllerName: getControllerFieldName(fieldInfo),
    values: Array.isArray(result?.values) ? result.values : [],
    controllerValues: result?.controllerValues || {},
  }
}

export function getFilteredPicklistValues(picklistMeta, controllerValue) {
  const options = Array.isArray(picklistMeta?.values) ? picklistMeta.values : []
  const controllerValues = picklistMeta?.controllerValues || {}
  const hasController = Boolean(picklistMeta?.controllerName) && Object.keys(controllerValues).length > 0

  if (!hasController) {
    return options
  }

  if (controllerValue === null || controllerValue === undefined || controllerValue === '') {
    return []
  }

  const controllerIndex = controllerValues[controllerValue]
  if (controllerIndex === null || controllerIndex === undefined) {
    return []
  }

  return options.filter((option) => Array.isArray(option?.validFor) && option.validFor.includes(controllerIndex))
}

export function applyDependentValueCleanup(nextEditValues, changedFieldName, picklists) {
  const nextState = { ...nextEditValues }

  Object.values(picklists || {}).forEach((picklistMeta) => {
    if (picklistMeta?.controllerName !== changedFieldName) {
      return
    }

    const dependentFieldName = picklistMeta?.fieldApiName
    const dependentFieldState = nextState?.[dependentFieldName]
    if (!dependentFieldState) {
      return
    }

    const controllerValue = nextState?.[changedFieldName]?.current
    const allowedValues = getFilteredPicklistValues(picklistMeta, controllerValue)
    const currentValue = dependentFieldState?.current
    const isCurrentValueAllowed =
      currentValue === null ||
      currentValue === undefined ||
      currentValue === '' ||
      allowedValues.some((option) => option?.value === currentValue)

    if (isCurrentValueAllowed) {
      return
    }

    nextState[dependentFieldName] = {
      ...dependentFieldState,
      current: '',
      displayCurrent: '',
    }
  })

  return nextState
}
