export default function HomeTopStickyNav({
  onAction,
  title = 'Loremipsum Title',
  subtitle = 'Massive Dynamic',
  backgroundImage = "https://images.unsplash.com/photo-1622180203374-9524a54b734d?auto=format&fit=crop&w=1950&q=80",
  avatarImage = "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  showSearch = true,
  searchPlaceholder = 'Search something...',
}) {
  const notify = typeof onAction === 'function' ? onAction : () => {}

  return (
    <div
      className="relative sticky top-0 z-20 h-36 w-full cursor-pointer rounded-b-3xl bg-center object-cover shadow-lg"
      style={{
        backgroundImage: `url('${backgroundImage}')`,
      }}
    >
      <nav className="relative z-10 mx-auto flex h-18 items-center justify-between p-2">
        <div className="inline relative">
          <button
            type="button"
            className="relative mr-3 inline-flex items-center text-gray-300 hover:text-white"
            onClick={() => notify('Menu tapped')}
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
                <img
                  className="h-8 w-8 rounded-xl border border-yellow-300 shadow"
                  src={avatarImage}
                  alt="User avatar"
                />
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex w-full flex-col rounded-lg px-3">
        <h4 className="truncate text-xl font-semibold leading-tight text-white">
          {title}
        </h4>
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h2 className="flex items-center text-sm font-normal text-gray-100">
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
        <div className="z-10 mt-3 flex items-center justify-between px-3">
          <div className="relative w-full">
            <input
              type="text"
              className="w-full rounded-xl border-0 bg-white/90 p-3 shadow"
              placeholder={searchPlaceholder}
            />
            <div className="absolute right-0 top-0 p-4 pr-3 text-gray-400">
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
