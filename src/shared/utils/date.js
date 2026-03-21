export function formatBirthdate(value) {
  if (!value) return '-'

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value

  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

export function calculateAge(birthdate) {
  if (!birthdate) return null

  const date = new Date(birthdate)
  if (Number.isNaN(date.getTime())) return null

  const today = new Date()
  let age = today.getFullYear() - date.getFullYear()
  const monthDiff = today.getMonth() - date.getMonth()

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age -= 1
  }

  return age >= 0 ? age : null
}
