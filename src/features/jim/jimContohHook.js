import { useMemo, useEffect, useState } from 'react'


const [firstName, setFirstName] = useState('Budi')
const [lastName, setLastName] = useState('Santoso')

const fullName = useMemo(() => {
  return `${firstName} ${lastName}`
}, [firstName, lastName])

useEffect(() => {
  console.log('Nama berubah:', fullName)
}, [fullName])

const handleSave = useCallback(() => {
  alert(`Simpan ${fullName}`)
}, [fullName])
