import { useNavigate } from 'react-router-dom'
import { getAvatarProfileByName } from '../data/avatarDirectory.js'

const defaultAvatarImage = getAvatarProfileByName('me')?.avatarImage ?? null

export default function HomeTopStickyNav({
  onAction,
  title = 'HypeZone',
  subtitle = 'Bekasi',
  avatarImage = defaultAvatarImage,
  showSearch = true,
  searchPlaceholder = 'Search something...',
  themeMode = 'default',
}) {
  const navigate = useNavigate()
  const notify = typeof onAction === 'function' ? onAction : () => {}
  const isBlackTheme = themeMode === 'black'

  return (
    <div
      className={`relative sticky top-0 z-20 w-full cursor-pointer rounded-b-3xl shadow-lg ${
        'bg-gradient-to-r from-cyan-400 via-sky-500 to-fuchsia-500'
      }`}
      style={{
        height: 'calc(9rem + env(safe-area-inset-top))',
        paddingTop: 'env(safe-area-inset-top)',
      }}
    >
      <div
        className={`absolute inset-0 z-0 ${
          isBlackTheme
            ? 'bg-[linear-gradient(180deg,rgba(15,23,42,0.06)_0%,rgba(15,23,42,0.22)_100%)]'
            : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.06)_0%,rgba(255,255,255,0.18)_100%)]'
        }`}
      />
      <nav className="relative z-10 mx-auto flex h-18 items-center justify-between p-2">
        <div className="inline relative">
          <button
            type="button"
            className={`relative mr-3 inline-flex items-center ${
              isBlackTheme ? 'text-gray-300 hover:text-white' : 'text-slate-500 hover:text-slate-900'
            }`}
            onClick={() => {
              notify('Buka settings')
              navigate('/settings')
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </button>
        </div>
        <div className="inline-flex">
          <div className="hidden" />
        </div>
        <div className="flex-initial">
          <div className="relative flex items-center justify-end">
            <div className="inline relative">
              <div className="block flex-grow-0 flex-shrink-0">
                <button type="button" onClick={() => navigate('/user-profile')}>
                  <img
                    className={`h-8 w-8 rounded-xl shadow ${
                      isBlackTheme ? 'border border-yellow-300' : 'border border-slate-200'
                    } object-cover`}
                    src={avatarImage}
                    alt="User avatar"
                    referrerPolicy="no-referrer"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="relative z-10 flex w-full flex-col rounded-lg px-3">
        <h4
          className={`truncate text-xl font-semibold leading-tight ${
            isBlackTheme ? 'text-white' : 'text-slate-900'
          }`}
        >
          {title}
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2
              className={`flex items-center text-sm font-normal ${
                isBlackTheme ? 'text-gray-100' : 'text-slate-500'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="mr-1 h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              {subtitle}
            </h2>
          </div>
        </div>
      </div>

      {showSearch && (
        <div className="absolute inset-x-0 bottom-0 z-30 translate-y-1/2 px-3">
          <div className="relative z-30 w-full">
            <input
              type="text"
              className={`w-full rounded-xl p-3 shadow backdrop-blur-sm ${
                isBlackTheme
                  ? 'border border-white/30 bg-white/90'
                  : 'border border-slate-300 bg-white/75'
              }`}
              placeholder={searchPlaceholder}
            />
            <div
              className={`absolute right-0 top-0 z-40 p-4 pr-3 ${
                isBlackTheme ? 'text-gray-400' : 'text-slate-400'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
