import { useState } from 'react'
import { circleOptions } from './activityDetailData.js'

export function useActivityDraft(selectedCategory) {
  const [draftForm, setDraftForm] = useState({
    title: '',
    description: '',
    category: selectedCategory,
    time: '',
    location: '',
    circleId: 'school-friend',
    participants: [],
    needs: [{ name: '', ready: false }],
  })

  const updateDraftField = (field) => (event) => {
    setDraftForm((current) => ({
      ...current,
      [field]: event.target.value,
    }))
  }

  const selectedCircle =
    circleOptions.find((circle) => circle.id === draftForm.circleId) || circleOptions[0]

  const toggleParticipant = (member) => {
    setDraftForm((current) => ({
      ...current,
      participants: current.participants.includes(member)
        ? current.participants.filter((item) => item !== member)
        : [...current.participants, member],
    }))
  }

  const updateNeedRow = (index, field, value) => {
    setDraftForm((current) => ({
      ...current,
      needs: current.needs.map((need, needIndex) =>
        needIndex === index ? { ...need, [field]: value } : need
      ),
    }))
  }

  const addNeedRow = () => {
    setDraftForm((current) => ({
      ...current,
      needs: [...current.needs, { name: '', ready: false }],
    }))
  }

  const selectCircle = (circle) => {
    setDraftForm((current) => ({
      ...current,
      circleId: circle.id,
      participants: current.participants.filter((member) => circle.members.includes(member)),
    }))
  }

  return {
    draftForm,
    selectedCircle,
    updateDraftField,
    toggleParticipant,
    updateNeedRow,
    addNeedRow,
    selectCircle,
  }
}
