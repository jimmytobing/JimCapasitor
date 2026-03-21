import { useMemo, useState } from 'react'
import { chatThreads } from './chatData.js'

export function useChatDetailData(threadId) {
  const [draft, setDraft] = useState('')
  const thread = useMemo(
    () => chatThreads.find((item) => item.id === threadId) ?? null,
    [threadId]
  )

  return {
    draft,
    setDraft,
    thread,
  }
}
