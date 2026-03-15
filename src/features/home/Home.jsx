import { useLocation, useNavigate } from 'react-router-dom'

export default function Home({ showToast }) {
  debugger
  const navigate = useNavigate()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const menuItems = [
    { label: 'Send', icon: '📤', action: () => navigate('/module-1') },
    { label: 'Topup', icon: '➕', action: () => navigate('/module-2') },
    { label: 'Bills', icon: '🧾', action: () => showToast('Feature coming soon') },
    { label: 'Games', icon: '🎮', action: () => showToast('Feature coming soon') },
    { label: 'Food', icon: '🍔', action: () => showToast('Feature coming soon') },
    { label: 'Travel', icon: '✈️', action: () => showToast('Feature coming soon') },
    { label: 'Shop', icon: '🛒', action: () => showToast('Feature coming soon') },
    { label: 'More', icon: '➕', action: () => showToast('Feature coming soon') },
  ]

  return (
    <div className="mx-auto max-w-[420px] space-y-4 p-4">
      {/* Top Bar */}
      <div className="flex items-center gap-2">
        <input
          className="flex-1 rounded-lg bg-white p-2 shadow"
          placeholder="Search"
          type="text"
        />
        <div className="h-10 w-10 rounded-full bg-gray-300" />
      </div>

      {/* Banner */}
      <div className="rounded-lg bg-blue-100 p-4 shadow">Welcome</div>

      {/* Coin Card */}
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="text-sm text-gray-600">Balance</div>
        <div className="text-2xl font-semibold">$2,450.00</div>
        <div className="mt-2 flex gap-2">
          <button
            className="flex-1 rounded-lg bg-gray-100 p-2"
            onClick={() => showToast('Feature coming soon')}
          >
            Pay
          </button>
          <button
            className="flex-1 rounded-lg bg-gray-100 p-2"
            onClick={() => showToast('Feature coming soon')}
          >
            History
          </button>
          <button
            className="flex-1 rounded-lg bg-gray-100 p-2"
            onClick={() => showToast('Feature coming soon')}
          >
            More
          </button>
        </div>
      </div>

      {/* Menu Icon Grid */}
      <div className="grid grid-cols-4 gap-2">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="flex flex-col items-center gap-1 rounded-lg bg-white p-2 shadow"
            onClick={item.action}
          >
            <div className="text-xl">{item.icon}</div>
            <div className="text-xs">{item.label}</div>
          </button>
        ))}
      </div>

      {/* Quick Menu Card */}
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="font-semibold">Your Quick Menu</div>
      </div>

      {/* Promo Section */}
      <div className="flex gap-2">
        <div className="flex-1 rounded-lg bg-white p-3 text-center shadow">Promo 1</div>
        <div className="flex-1 rounded-lg bg-white p-3 text-center shadow">Promo 2</div>
        <div className="flex-1 rounded-lg bg-white p-3 text-center shadow">Promo 3</div>
      </div>

      {/* Bottom Spacer */}
      <div className="h-16" />

      {/* Bottom Sticky Nav */}
      <div className="fixed bottom-0 left-0 right-0">
        <div className="mx-auto flex max-w-[420px] justify-between bg-white p-2 shadow">
          <button
            className={`flex-1 ${isActive('/') ? 'font-semibold text-blue-600' : ''}`}
            onClick={() => navigate('/')}
          >
            Home
          </button>
          <button
            className={`flex-1 ${isActive('/promo') ? 'font-semibold text-blue-600' : ''}`}
            onClick={() => navigate('/promo')}
          >
            Promo
          </button>
          <button
            className={`flex-1 ${isActive('/activity') ? 'font-semibold text-blue-600' : ''}`}
            onClick={() => navigate('/activity')}
          >
            Activity
          </button>
          <button
            className={`flex-1 ${isActive('/chat') ? 'font-semibold text-blue-600' : ''}`}
            onClick={() => navigate('/chat')}
          >
            Chat
          </button>
        </div>
      </div>
    </div>
  )
}
