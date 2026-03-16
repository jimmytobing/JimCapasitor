import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import HomeTopStickyNav from '../../shared/components/HomeTopStickyNav.jsx'

export default function Home({ showToast }) {
  const notify = typeof showToast === 'function' ? showToast : () => {}

  return (
    <div
      className="relative min-h-screen bg-[#edf2f7]"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1507608158173-1dcec673a2e5?auto=format&fit=crop&w=1950&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/60" />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-h-[82vh] space-y-3 overflow-y-auto rounded-3xl border-8 border-gray-800 bg-white shadow-2xl sm:w-6/12 lg:w-4/12 xl:w-4/12 hide-scrollbar">
          <HomeTopStickyNav onAction={notify} />

            <div className="relative z-0 space-y-4 p-3">
            <h4 className="mt-2 font-semibold">Category</h4>
            <div className="flex items-center justify-between space-x-3 overflow-x-auto text-gray-500 hide-scrollbar">
              <button
                className="mb-2 flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-white p-1 text-green-600 shadow transition duration-300 ease-in hover:shadow-md"
                onClick={() => notify('Hotel tapped')}
              >
                <span className="text-xl">🏨</span>
                <p className="mt-1 text-sm">Hotel</p>
              </button>
              <button
                className="mb-2 flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-white p-1 text-yellow-600 shadow transition duration-300 ease-in hover:shadow-md"
                onClick={() => notify('Bus tapped')}
              >
                <span className="text-xl">🚌</span>
                <p className="mt-1 text-sm">Bus</p>
              </button>
              <button
                className="mb-2 flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-white p-1 text-indigo-500 shadow transition duration-300 ease-in hover:shadow-md"
                onClick={() => notify('Hills tapped')}
              >
                <span className="text-xl">⛰️</span>
                <p className="mt-1 text-sm">Hills</p>
              </button>
              <button
                className="mb-2 flex h-20 w-20 flex-col items-center justify-center rounded-2xl bg-white p-1 text-pink-500 shadow transition duration-300 ease-in hover:shadow-md"
                onClick={() => notify('Beach tapped')}
              >
                <span className="text-xl">🏖️</span>
                <p className="mt-1 text-sm">Beach</p>
              </button>
            </div>

            <h4 className="font-semibold">Recomented Hotels</h4>
            <div className="grid w-full grid-cols-2 space-x-4">
              <button
                className="relative my-2 h-64 w-full cursor-pointer overflow-hidden rounded-3xl bg-white bg-cover object-cover object-center shadow-md"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/reserve/8T8J12VQxyqCiQFGa2ct_bahamas-atlantis.jpg?auto=format&fit=crop&w=1050&q=80')",
                }}
                onClick={() => notify('Dubai hotel')}
              >
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-green-400 to-blue-400 opacity-50" />
                <div className="relative flex h-72 w-full flex-row items-end">
                  <div className="absolute right-0 top-0 m-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-9 w-9 rounded-full p-2 text-gray-200 transition duration-200 ease-in hover:bg-white hover:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </div>
                  <div className="z-10 flex w-full flex-col rounded-lg p-6">
                    <h4 className="mt-1 truncate text-xl font-semibold leading-tight text-white">
                      Loremipsum..
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h2 className="flex items-center text-sm font-normal text-gray-300">
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
                          Dubai
                        </h2>
                      </div>
                    </div>
                    <div className="flex pt-4 text-sm text-gray-300">
                      <div className="mr-auto flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1 h-5 w-5 text-yellow-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <p className="font-normal">4.5</p>
                      </div>
                      <div className="flex items-center font-medium text-white">
                        $1800
                        <span className="text-sm font-normal text-gray-300"> /wk</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>

              <button
                className="relative my-2 h-64 w-full cursor-pointer overflow-hidden rounded-3xl bg-white bg-cover object-cover object-center shadow-md"
                style={{
                  backgroundImage:
                    "url('https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80')",
                }}
                onClick={() => notify('India hotel')}
              >
                <div className="absolute inset-0 z-0 bg-gradient-to-t from-blue-500 to-yellow-400 opacity-50" />
                <div className="relative flex h-72 w-full flex-row items-end">
                  <div className="absolute right-0 top-0 m-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-9 w-9 rounded-full p-2 text-gray-200 transition duration-200 ease-in hover:bg-white hover:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </div>
                  <div className="z-10 flex w-full flex-col rounded-lg p-5">
                    <h4 className="mt-1 truncate text-xl font-semibold leading-tight text-white">
                      Loremipsum..
                    </h4>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <h2 className="flex items-center text-sm font-normal text-gray-300">
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
                          India
                        </h2>
                      </div>
                    </div>
                    <div className="flex pt-4 text-sm text-gray-300">
                      <div className="mr-auto flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1 h-5 w-5 text-yellow-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <p className="font-normal">4.5</p>
                      </div>
                      <div className="flex items-center font-medium text-white">
                        $1800
                        <span className="text-sm font-normal text-gray-300"> /wk</span>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            </div>

            <h4 className="font-semibold">Suggested By</h4>
            <div className="grid grid-cols-1">
              <div className="flex rounded-2xl bg-white p-2 shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1439130490301-25e322d88054?auto=format&fit=crop&w=1189&q=80"
                  alt="Just a flower"
                  className="h-16 w-16 rounded-xl object-cover"
                />
                <div className="flex w-full flex-col justify-center px-2 py-1">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      <h2 className="text-sm font-medium">Massive Dynamic</h2>
                    </div>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 cursor-pointer text-gray-500 hover:text-blue-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      onClick={() => notify('Saved')}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                  </div>
                  <div className="flex pt-2 text-sm text-gray-400">
                    <div className="mr-auto flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mr-1 h-5 w-5 text-yellow-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <p className="font-normal">4.5</p>
                    </div>
                    <div className="flex items-center font-medium text-gray-900">
                      $1800
                      <span className="text-sm font-normal text-gray-400"> /wk</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <BottomStickyNav onAction={notify} />
        </div>
      </div>
    </div>
  )
}
