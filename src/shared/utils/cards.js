function resolveCardValue(record, field) {
  if (typeof field.getValue === 'function') {
    return field.getValue(record)
  }

  if (Array.isArray(field.keys)) {
    for (const key of field.keys) {
      const value = record?.[key]

      if (value != null && value !== '') {
        return value
      }
    }
  }

  if (field.key) {
    const value = record?.[field.key]

    if (value != null && value !== '') {
      return value
    }
  }

  return field.fallback ?? '-'
}

export function buildCardsFromRecord(record, { profileCard = null, fields = [] } = {}) {
  const cards = []

  if (profileCard) {
    cards.push(profileCard)
  }

  return cards.concat(
    fields.map((field) => ({
      type: field.type ?? 'detail',
      label: field.label,
      value: resolveCardValue(record, field),
    }))
  )
}
