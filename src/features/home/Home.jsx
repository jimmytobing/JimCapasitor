import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import HomeTopStickyNav from '../../shared/components/HomeTopStickyNav.jsx'
import { getRandomBadges } from '../../shared/utils/badges.js'

const getAssetUrl = (path) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

const groupPurchaseCards = [
  {
    title: 'Nitip Bahan Project Kelas 7',
    location: 'Bekasi',
    rating: '4.9',
    price: 'Kumpulin Rp 15k',
    unit: ' / siswa',
    description:
      'Daftar untuk ikut nitip bahan project kelas 7. Kumpulin duitnya ke HypeZone supaya benang wool, jarum, kain, dan manik-manik bisa di pesenin sekalian buat mu.',
    image: '/resources/images/hotel-1.jpg',
    gradient: 'from-emerald-500 to-cyan-500',
    action: 'Nitip Bahan Project Kelas 7',
  },
  {
    title: 'Nitip Pesenin Bakso Rusuk',
    location: 'Bekasi',
    rating: '4.8',
    price: 'Kumpulin Rp 22k',
    unit: ' / porsi',
    description:
      'Nitip pesenin Bakso Rusuk untuk di anterin pas lagi lunch-break, jadi kamu tinggal ambil dan makan bareng teman-teman.',
    image: '/resources/images/hotel-2.jpg',
    gradient: 'from-amber-500 to-orange-500',
    action: 'Nitip Pesenin Bakso Rusuk',
  },
  {
    title: 'Nitip Tiket Bioskop Nobar Circle',
    location: 'Bekasi',
    rating: '4.7',
    price: 'Kumpulin Rp 35k',
    unit: ' / orang',
    description:
      'Nitip pesenin tiket bioskop untuk Nobar Circle supaya kursinya berdekatan dan kamu tidak perlu rebutan jam tayang.',
    image: '/resources/images/hotel-1.jpg',
    gradient: 'from-indigo-500 to-sky-500',
    action: 'Nitip Tiket Bioskop Nobar Circle',
  },
  {
    title: 'Nitip Paket Buku Kelas 8',
    location: 'Bekasi',
    rating: '4.9',
    price: 'Kumpulin Rp 180k',
    unit: ' / paket',
    description:
      'Nitip pesenin paket buku untuk di prepare kenaikan ke kelas 8, jadi nanti pas udah naik kelas semua buku pelajaran tinggal di ambil di depan sekolah.',
    image: '/resources/images/hotel-2.jpg',
    gradient: 'from-rose-500 to-orange-400',
    action: 'Nitip Paket Buku Kelas 8',
  },
  {
    title: 'Nitip Print dan Jilid Tugas',
    location: 'Bekasi',
    rating: '4.8',
    price: 'Kumpulin Rp 12k',
    unit: ' / set',
    description:
      'Nitip print dan jilid tugas biar hasilnya rapi, lalu tinggal kamu ambil sebelum masuk kelas.',
    image: '/resources/images/suggested-1.jpg',
    gradient: 'from-teal-500 to-emerald-400',
    action: 'Nitip Print dan Jilid Tugas',
  },
  {
    title: 'Nitip Snack Box Buat Study Group',
    location: 'Bekasi',
    rating: '4.7',
    price: 'Kumpulin Rp 18k',
    unit: ' / box',
    description:
      'Nitip snack box buat study group supaya pas kumpul belajar semuanya sudah siap tanpa harus beli satu-satu.',
    image: '/resources/images/hotel-1.jpg',
    gradient: 'from-fuchsia-500 to-pink-400',
    action: 'Nitip Snack Box Buat Study Group',
  },
]

const communitySuggestions = [
  {
    title: 'Bakso Rusuk Joss enak banget',
    by: 'Rekomendasi Bayu',
    rating: '4.8',
    tag: 'Kuliner',
    image: '/resources/images/suggested-1.jpg',
    action: 'Bakso Rusuk Joss',
  },
  {
    title: 'Summarecon Mall Bekasi seru banget',
    by: 'Rekomendasi Vina',
    rating: '4.7',
    tag: 'Hangout',
    image: '/resources/images/hotel-1.jpg',
    action: 'Summarecon Mall Bekasi',
  },
  {
    title: 'Game Stardew Valley keren',
    by: 'Rekomendasi Joshua',
    rating: '4.9',
    tag: 'Game',
    image: '/resources/images/hotel-2.jpg',
    action: 'Stardew Valley',
  },
]

export default function Home({ showToast }) {
  const notify = typeof showToast === 'function' ? showToast : () => {}
  const navigate = useNavigate()
  const refillBadges = () => {
    const nextBadges = getRandomBadges()
    localStorage.setItem('bottomNavBadges', JSON.stringify(nextBadges))
    window.dispatchEvent(
      new CustomEvent('bottomNavBadgesUpdate', { detail: nextBadges })
    )
  }
  const glowButtonClass =
    'shadow-md transition duration-200 ease-in-out active:shadow-[inset_0_0_18px_rgba(59,130,246,0.35)] active:scale-[0.98]'

  return (
    <div className="h-screen bg-[#edf2f7] overflow-y-auto hide-scrollbar">
      <div className="min-h-screen pb-28 pt-0">
        <div className="w-full space-y-3 rounded-none border-0 bg-white shadow-none">
          <HomeTopStickyNav onAction={notify} />

            <div className="relative z-0 space-y-4 p-3">
            <div className="rounded-2xl bg-white p-4 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-100 text-2xl">
                    👛
                  </div>
                  <div className="space-y-0.5 leading-tight">
                    <div className="flex items-center gap-2">
                      <p className="text-[11px] text-gray-500">Saldo Rupiah</p>
                      <button
                        className="flex h-5 w-5 items-center justify-center rounded-full border border-blue-200 text-[12px] font-semibold text-blue-600 shadow"
                        onClick={() => {
                          notify('Top up')
                          refillBadges()
                        }}
                        aria-label="Top Up"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                      Rp 12.780.500
                    </p>
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <button
                    className="group flex w-10 flex-col items-center justify-center text-blue-600"
                    onClick={() => notify('Bayar')}
                    aria-label="Bayar"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition duration-300 ease-in hover:shadow-md group-active:shadow-[inset_0_0_18px_rgba(59,130,246,0.35)]">
                      💵
                    </span>
                    <span className="mt-1 text-[9px] text-gray-600">Bayar</span>
                  </button>
                  <button
                    className="group flex w-10 flex-col items-center justify-center text-blue-600"
                    onClick={() => notify('Riwayat')}
                    aria-label="Riwayat"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition duration-300 ease-in hover:shadow-md group-active:shadow-[inset_0_0_18px_rgba(59,130,246,0.35)]">
                      🧾
                    </span>
                    <span className="mt-1 text-[9px] text-gray-600">Riwayat</span>
                  </button>
                  <button
                    className="group flex w-10 flex-col items-center justify-center text-blue-600"
                    onClick={() => notify('Lainnya')}
                    aria-label="Lainnya"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md transition duration-300 ease-in hover:shadow-md group-active:shadow-[inset_0_0_18px_rgba(59,130,246,0.35)]">
                      ⋯
                    </span>
                    <span className="mt-1 text-[9px] text-gray-600">Lainnya</span>
                  </button>
                </div>
              </div>
            </div>

            <h4 className="mt-2 font-semibold">Jelajahi Fitur</h4>
            <div className="grid grid-cols-4 gap-3 text-gray-500">
              <button
                className={`flex h-20 w-full flex-col items-center justify-center rounded-2xl bg-white p-1 text-green-600 shadow hover:shadow-md ${glowButtonClass}`}
                onClick={() => navigate('/daily')}
              >
                <span className="text-xl">📆</span>
                <p className="mt-1 text-center text-xs leading-tight">Daily Check-in</p>
              </button>
              <button
                className={`flex h-20 w-full flex-col items-center justify-center rounded-2xl bg-white p-1 text-yellow-600 shadow hover:shadow-md ${glowButtonClass}`}
                onClick={() => navigate('/today-friends')}
              >
                <span className="text-xl">👥</span>
                <p className="mt-1 text-center text-[11px] leading-tight">Today With Friends</p>
              </button>
              <button
                className={`flex h-20 w-full flex-col items-center justify-center rounded-2xl bg-white p-1 text-indigo-500 shadow hover:shadow-md ${glowButtonClass}`}
                onClick={() => navigate('/activity')}
              >
                <span className="text-xl">🏃</span>
                <p className="mt-1 text-center text-[11px] leading-tight">Activity</p>
              </button>
              <button
                className={`flex h-20 w-full flex-col items-center justify-center rounded-2xl bg-white p-1 text-pink-500 shadow hover:shadow-md ${glowButtonClass}`}
                onClick={() => navigate('/mini-challenge')}
              >
                <span className="text-xl">🎯</span>
                <p className="mt-1 text-center text-[11px] leading-tight">Mini Challenge</p>
              </button>
              <button
                className={`flex h-20 w-full flex-col items-center justify-center rounded-2xl bg-white p-1 text-purple-500 shadow hover:shadow-md ${glowButtonClass}`}
                onClick={() => navigate('/friend-radar')}
              >
                <span className="text-xl">📍</span>
                <p className="mt-1 text-center text-[11px] leading-tight">Friend Radar</p>
              </button>
              <button
                className={`flex h-20 w-full flex-col items-center justify-center rounded-2xl bg-white p-1 text-blue-500 shadow hover:shadow-md ${glowButtonClass}`}
                onClick={() => navigate('/activity-suggestion')}
              >
                <span className="text-xl">💡</span>
                <p className="mt-1 text-center text-[11px] leading-tight">Activity Suggestion</p>
              </button>
              <button
                className={`flex h-20 w-full flex-col items-center justify-center rounded-2xl bg-white p-1 text-orange-500 shadow hover:shadow-md ${glowButtonClass}`}
                onClick={() => navigate('/friend-stats')}
              >
                <span className="text-xl">📊</span>
                <p className="mt-1 text-center text-[11px] leading-tight">Friend Stats</p>
              </button>
              <button
                className={`flex h-20 w-full flex-col items-center justify-center rounded-2xl bg-white p-1 text-gray-600 shadow hover:shadow-md ${glowButtonClass}`}
                onClick={() => notify('More tapped')}
              >
                <span className="text-xl">➕</span>
                <p className="mt-1 text-sm">More</p>
              </button>
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold">Titip Yuk</h4>
              <p className="text-sm text-gray-500">
                Buat kebutuhan project kelas seperti benang wool, jarum, kain, dan
                manik-manik, siswa bisa titip ke HypeZone supaya lebih gampang dan
                praktis.
              </p>
            </div>
            <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto pb-2 hide-scrollbar">
              {groupPurchaseCards.map((card) => (
                <button
                  key={card.title}
                  className={`relative my-2 h-64 min-w-[70%] snap-start cursor-pointer overflow-hidden rounded-3xl bg-white bg-cover object-cover object-center shadow-md ${glowButtonClass}`}
                  style={{
                    backgroundImage: `url('${getAssetUrl(card.image)}')`,
                  }}
                  onClick={() => notify(card.action)}
                >
                  <div
                    className={`absolute inset-0 z-0 bg-gradient-to-t ${card.gradient} opacity-75`}
                  />
                  <div className="relative flex h-64 w-full flex-row items-end">
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
                    <div className="z-10 flex w-full flex-col rounded-lg p-6 text-left">
                      <span className="mb-3 inline-flex w-fit rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
                        HypeZone Nitip
                      </span>
                      <h4 className="text-xl font-semibold leading-tight text-white">
                        {card.title}
                      </h4>
                      <div className="mt-2 flex items-center justify-between">
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
                            {card.location}
                          </h2>
                        </div>
                      </div>
                      <p className="pt-3 text-sm text-gray-100">{card.description}</p>
                      <div className="flex items-center justify-between gap-3 pt-4 text-sm text-gray-100">
                        <div className="flex items-center whitespace-nowrap">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="mr-1 h-5 w-5 text-yellow-300"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <p className="font-normal">{card.rating}</p>
                        </div>
                        <div className="flex items-center whitespace-nowrap font-medium text-white">
                          {card.price}
                          <span className="text-sm font-normal text-gray-100">{card.unit}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="space-y-1">
              <h4 className="font-semibold">Rekomendasi Komunitas</h4>
              <p className="text-sm text-gray-500">
                Ide pilihan dari teman-teman untuk makan, hangout, dan hiburan.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {communitySuggestions.map((item) => (
                <div key={item.title} className="flex rounded-2xl bg-white p-2 shadow-md">
                  <img
                    src={getAssetUrl(item.image)}
                    alt={item.title}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="flex w-full flex-col justify-center px-2 py-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex flex-col">
                        <h2 className="text-sm font-medium text-gray-900">{item.title}</h2>
                        <p className="mt-1 text-xs text-gray-500">{item.by}</p>
                      </div>
                      <button
                        type="button"
                        className="rounded-full p-1 text-gray-500 transition hover:bg-gray-100 hover:text-blue-400"
                        onClick={() => notify(`Simpan ${item.action}`)}
                        aria-label={`Simpan ${item.title}`}
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
                            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className="flex items-center pt-2 text-sm text-gray-400">
                      <div className="mr-auto flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="mr-1 h-5 w-5 text-yellow-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <p className="font-normal">{item.rating}</p>
                      </div>
                      <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700">
                        {item.tag}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <BottomStickyNav onAction={notify} />
        </div>
      </div>
    </div>
  )
}
