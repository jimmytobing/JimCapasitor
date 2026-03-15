import { useLocation, useNavigate } from 'react-router-dom'

export default function BottomStickyNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const navBadges = [
    { apiname: 'home', badge: null },
    { apiname: 'explore', badge: 2 },
    { apiname: 'promo', badge: 3 },
    { apiname: 'activity', badge: 4 },
    { apiname: 'chat', badge: 5 },
  ]
  const badgeByApi = Object.fromEntries(
    navBadges.map((item) => [item.apiname, item.badge])
  )

  return (
    <div className="fixed bottom-0 left-0 right-0">
      <div className="mx-auto flex max-w-[420px] justify-between bg-white p-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] shadow">
        <button
          className={`flex flex-1 flex-col items-center gap-0.5 text-xs ${isActive('/') ? 'font-semibold text-blue-600' : ''}`}
          onClick={() => navigate('/')}
        >
          <span className="relative text-base">
            🏠
            {badgeByApi.home != null && (
              <span className="absolute -right-2 -top-2 min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white">
                {badgeByApi.home}
              </span>
            )}
          </span>
          <span>Home</span>
        </button>
        <button
          className={`flex flex-1 flex-col items-center gap-0.5 text-xs ${isActive('/explore') ? 'font-semibold text-blue-600' : ''}`}
          onClick={() => navigate('/explore')}
        >
          <span className="relative text-base">
            🧭
            {badgeByApi.explore != null && (
              <span className="absolute -right-2 -top-2 min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white">
                {badgeByApi.explore}
              </span>
            )}
          </span>
          <span>Explore</span>
        </button>
        <button
          className={`flex flex-1 flex-col items-center gap-0.5 text-xs ${isActive('/promo') ? 'font-semibold text-blue-600' : ''}`}
          onClick={() => navigate('/promo')}
        >
          <span className="relative text-base">
            🎁
            {badgeByApi.promo != null && (
              <span className="absolute -right-2 -top-2 min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white">
                {badgeByApi.promo}
              </span>
            )}
          </span>
          <span>Promo</span>
        </button>
        <button
          className={`flex flex-1 flex-col items-center gap-0.5 text-xs ${isActive('/activity') ? 'font-semibold text-blue-600' : ''}`}
          onClick={() => navigate('/activity')}
        >
          <span className="relative text-base">
            🧾
            {badgeByApi.activity != null && (
              <span className="absolute -right-2 -top-2 min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white">
                {badgeByApi.activity}
              </span>
            )}
          </span>
          <span>Activity</span>
        </button>
        <button
          className={`flex flex-1 flex-col items-center gap-0.5 text-xs ${isActive('/chat') ? 'font-semibold text-blue-600' : ''}`}
          onClick={() => navigate('/chat')}
        >
          <span className="relative text-base">
            💬
            {badgeByApi.chat != null && (
              <span className="absolute -right-2 -top-2 min-w-[1.1rem] rounded-full bg-red-500 px-1 text-[10px] leading-4 text-white">
                {badgeByApi.chat}
              </span>
            )}
          </span>
          <span>Chat</span>
        </button>
      </div>
    </div>
  )
}
