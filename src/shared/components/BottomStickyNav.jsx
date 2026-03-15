import { useLocation, useNavigate } from 'react-router-dom'

export default function BottomStickyNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className="mx-auto flex max-w-[420px] justify-between bg-white p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow">
        <button
          className={`flex flex-1 flex-col items-center gap-0.5 text-xs ${isActive('/') ? 'font-semibold text-blue-600' : ''}`}
          onClick={() => navigate('/')}
        >
          <span className="relative text-base">
            🏠
            <span className="absolute -right-2 -top-2 min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white">
              1
            </span>
          </span>
          <span>Home</span>
        </button>
        <button
          className={`flex flex-1 flex-col items-center gap-0.5 text-xs ${isActive('/explore') ? 'font-semibold text-blue-600' : ''}`}
          onClick={() => navigate('/explore')}
        >
          <span className="relative text-base">
            🧭
            <span className="absolute -right-2 -top-2 min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white">
              2
            </span>
          </span>
          <span>Explore</span>
        </button>
        <button
          className={`flex flex-1 flex-col items-center gap-0.5 text-xs ${isActive('/promo') ? 'font-semibold text-blue-600' : ''}`}
          onClick={() => navigate('/promo')}
        >
          <span className="relative text-base">
            🎁
            <span className="absolute -right-2 -top-2 min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white">
              3
            </span>
          </span>
          <span>Promo</span>
        </button>
        <button
          className={`flex flex-1 flex-col items-center gap-0.5 text-xs ${isActive('/activity') ? 'font-semibold text-blue-600' : ''}`}
          onClick={() => navigate('/activity')}
        >
          <span className="relative text-base">
            🧾
            <span className="absolute -right-2 -top-2 min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white">
              4
            </span>
          </span>
          <span>Activity</span>
        </button>
        <button
          className={`flex flex-1 flex-col items-center gap-0.5 text-xs ${isActive('/chat') ? 'font-semibold text-blue-600' : ''}`}
          onClick={() => navigate('/chat')}
        >
          <span className="relative text-base">
            💬
            <span className="absolute -right-2 -top-2 min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white">
              5
            </span>
          </span>
          <span>Chat</span>
        </button>
      </div>
    </div>
  )
}
