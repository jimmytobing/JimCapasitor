import { useNavigate } from 'react-router-dom'

export default function BottomStickyNav({ onAction }) {
  const navigate = useNavigate()
  const notify = typeof onAction === 'function' ? onAction : () => {}
  const navBadges = [
    { apiname: 'home', badge: null },
    { apiname: 'explore', badge: 2 },
    { apiname: 'promo', badge: 3 },
    { apiname: 'activity', badge: 4 },
    { apiname: 'chat', badge: null },
  ]
  const badgeByApi = Object.fromEntries(
    navBadges.map((item) => [item.apiname, item.badge])
  )
  const badgeClass = (badge, position = '-right-2 -top-2') =>
    `absolute ${position} min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white${
      badge != null ? ' transition shadow' : ''
    }`
  const chatButtonClass = `relative flex h-20 w-20 items-center justify-center rounded-full border-4 border-gray-50 bg-blue-500 p-2 text-center text-3xl text-white shadow-2xl hover:border-blue-500${
    badgeByApi.chat != null ? ' transition duration-200 ease-in' : ''
  }`

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30">
      <div className="mx-auto max-w-[420px] pb-[calc(0.5rem+env(safe-area-inset-bottom))]">
        <div className="m-2 flex items-center justify-between rounded-2xl bg-gray-900 p-5 px-6 text-gray-400 shadow-3xl">
          <button
        className="flex flex-col items-center text-[11px] leading-tight transition duration-200 ease-in hover:text-blue-400"
        onClick={() => {
          notify('Home')
          navigate('/')
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
          notify('Explore')
          navigate('/explore')
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
          {badgeByApi.explore != null && (
            <span className={badgeClass(badgeByApi.explore)}>
              {badgeByApi.explore}
            </span>
          )}
        </span>
        <span>Explore</span>
      </button>
          <div className="flex flex-col items-center hover:text-blue-400">
            <div
              className={chatButtonClass}
              onClick={() => {
                notify('Chat')
                navigate('/chat')
              }}
              role="button"
              tabIndex={0}
            >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-8 w-8"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M4 6.5A2.5 2.5 0 016.5 4h11A2.5 2.5 0 0120 6.5v6A2.5 2.5 0 0117.5 15H9l-4.5 3v-3H6.5A2.5 2.5 0 014 12.5v-6z" />
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
          notify('Promo')
          navigate('/promo')
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
          {badgeByApi.promo != null && (
            <span className={badgeClass(badgeByApi.promo)}>
              {badgeByApi.promo}
            </span>
          )}
        </span>
        <span>Promo</span>
      </button>
          <button
        className="flex flex-col items-center text-[11px] leading-tight transition duration-200 ease-in hover:text-blue-400"
        onClick={() => {
          notify('Activity')
          navigate('/activity')
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
              d="M4 19h16M5 16l2-6 3 4 3-7 3 5 2-2"
            />
          </svg>
          {badgeByApi.activity != null && (
            <span className={badgeClass(badgeByApi.activity)}>
              {badgeByApi.activity}
            </span>
          )}
        </span>
        <span>Activity</span>
          </button>
        </div>
      </div>
    </div>
  )
}
