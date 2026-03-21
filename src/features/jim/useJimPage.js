import { useEffect, useState } from 'react'

const data = [
  {
    title: 'Hello',
    avatarInitial: 'H',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'jimmy',
    avatarInitial: 'J',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
]

export function useJimPage() {
  const [error, setError] = useState('')
  const [loadingMessage, setLoadingMessage] = useState('Loading... 0 detik')

  useEffect(() => {
    let seconds = 0

    const interval = window.setInterval(() => {
      seconds += 1
      setLoadingMessage(`Loading... ${seconds} detik`)
    }, 1000)

    const timer = window.setTimeout(() => {
      window.clearInterval(interval)
      setLoadingMessage('')
      setError('Simulasi error dari useJimPage.')
    }, 10000)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timer)
    }
  }, [])

  return {
    cards: data,
    error,
    loadingMessage,
    setError,
  }
}
