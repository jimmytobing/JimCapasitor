import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getRandomBadges } from '../utils/badges.js'

export default function BottomStickyNav({ onAction }) {
  const navigate = useNavigate()
  const [badgeByApi, setBadgeByApi] = useState(() => {
    const saved = localStorage.getItem('bottomNavBadges')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch {
        return getRandomBadges()
      }
    }
    return getRandomBadges()
  })
  const badgeClass = (badge, position = '-right-2 -top-2') =>
    `absolute ${position} min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white${
      badge != null ? ' transition shadow' : ''
    }`
  const chatButtonClass = `relative flex h-20 w-20 -mt-10 items-center justify-center rounded-full border-4 border-gray-50 bg-blue-500 p-2 text-center text-3xl text-white shadow-2xl hover:border-blue-500${
    badgeByApi.chat != null ? ' transition duration-200 ease-in' : ''
  }`
  const handleNavClick = (key, path) => {
    setBadgeByApi((prev) => {
      if (prev[key] == null) return prev
      const next = { ...prev, [key]: null }
      localStorage.setItem('bottomNavBadges', JSON.stringify(next))
      return next
    })
    setTimeout(() => navigate(path), 0)
  }

  useEffect(() => {
    localStorage.setItem('bottomNavBadges', JSON.stringify(badgeByApi))
  }, [badgeByApi])

  useEffect(() => {
    const handleBadgesUpdate = (event) => {
      if (!event?.detail) return
      setBadgeByApi(event.detail)
    }
    window.addEventListener('bottomNavBadgesUpdate', handleBadgesUpdate)
    return () => {
      window.removeEventListener('bottomNavBadgesUpdate', handleBadgesUpdate)
    }
  }, [])

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-[#edf2f7] shadow-[0_-8px_20px_rgba(0,0,0,0.06)]" />
      <div className="relative w-full pb-[env(safe-area-inset-bottom)] pt-2">
        <div className="mx-3 flex h-16 items-center justify-between overflow-visible rounded-2xl bg-gray-900 px-5 py-3 text-gray-400 shadow-3xl">
          <button
        className="flex flex-col items-center text-[11px] leading-tight transition duration-200 ease-in hover:text-blue-400"
        onClick={() => {
          handleNavClick('home', '/home')
        }}
      >
        <span className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 9.5L12 4l9 5.5v8A2.5 2.5 0 0118.5 20H5.5A2.5 2.5 0 013 17.5v-8z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 20v-6h6v6"
            />
          </svg>
          {badgeByApi.home != null && (
            <span className={badgeClass(badgeByApi.home)}>
              {badgeByApi.home}
            </span>
          )}
        </span>
        <span>Home</span>
      </button>
          <button
        className="flex flex-col items-center text-[11px] leading-tight transition duration-200 ease-in hover:text-blue-400"
        onClick={() => {
          handleNavClick('circle', '/circle')
        }}
      >
        <span className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 11a3 3 0 116 0 3 3 0 01-6 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M3 19a6 6 0 0110-3.9A6 6 0 0121 19"
            />
          </svg>
          {badgeByApi.circle != null && (
            <span className={badgeClass(badgeByApi.circle)}>
              {badgeByApi.circle}
            </span>
          )}
        </span>
        <span>Circle</span>
      </button>
          <div className="flex flex-col items-center hover:text-blue-400">
            <div
              className={chatButtonClass}
              onClick={() => {
                handleNavClick('chat', '/chat')
              }}
              role="button"
              tabIndex={0}
            >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M7 4h10a5 5 0 015 5v3a5 5 0 01-5 5h-4.5L8 20.5V17H7a5 5 0 01-5-5V9a5 5 0 015-5z" />
            <circle cx="9" cy="11" r="1.3" />
            <circle cx="12" cy="11" r="1.3" />
            <circle cx="15" cy="11" r="1.3" />
          </svg>
          {badgeByApi.chat != null && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full border-4 opacity-50" />
          )}
          {badgeByApi.chat != null && (
            <span className={badgeClass(badgeByApi.chat, '-right-1 -top-1')}>
              {badgeByApi.chat}
            </span>
          )}
            </div>
          </div>
          <button
        className="flex flex-col items-center text-[11px] leading-tight transition duration-200 ease-in hover:text-blue-400"
        onClick={() => {
          handleNavClick('memory', '/memory')
        }}
      >
        <span className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 7l8-4 8 4v4c0 5-3.5 9-8 10-4.5-1-8-5-8-10V7z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 12l2 2 4-4"
            />
          </svg>
          {badgeByApi.memory != null && (
            <span className={badgeClass(badgeByApi.memory)}>
              {badgeByApi.memory}
            </span>
          )}
        </span>
        <span>Memory</span>
      </button>
          <button
        className="flex flex-col items-center text-[11px] leading-tight transition duration-200 ease-in hover:text-blue-400"
        onClick={() => {
          handleNavClick('insideJoke', '/jokes')
        }}
      >
        <span className="relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <circle cx="12" cy="12" r="9" strokeWidth="2" />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 7v5l3 3"
            />
          </svg>
          {badgeByApi.insideJoke != null && (
            <span className={badgeClass(badgeByApi.insideJoke)}>
              {badgeByApi.insideJoke}
            </span>
          )}
        </span>
        <span>Jokes</span>
          </button>
        </div>
      </div>
    </div>
  )
}
