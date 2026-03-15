import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import PageShell from '../../shared/components/PageShell.jsx'
import TopBar from '../../shared/components/TopBar.jsx'

export default function Home({ showToast }) {
  
  const navigate = useNavigate()

  const menuItems = [
    { label: 'Send', icon: '📤', action: () => navigate('/module-1') },
    { label: 'Topup', icon: '➕', action: () => navigate('/module-2') },
    { label: 'Explore', icon: '🧭', action: () => navigate('/explore') },
    { label: 'Bills', icon: '🧾', action: () => showToast('Feature coming soon') },
    { label: 'Games', icon: '🎮', action: () => showToast('Feature coming soon') },
    { label: 'Food', icon: '🍔', action: () => showToast('Feature coming soon') },
    { label: 'Travel', icon: '✈️', action: () => showToast('Feature coming soon') },
    { label: 'Shop', icon: '🛒', action: () => showToast('Feature coming soon') },
    { label: 'More', icon: '➕', action: () => showToast('Feature coming soon') },
  ]

  return (
    <PageShell>
      {/* Top Bar */}
      <TopBar />

      {/* Banner */}
      <div className="rounded-lg bg-blue-100 p-4 shadow">Welcome</div>

      {/* Coin Card */}
      <div className="rounded-lg bg-white p-4 shadow">
        <div className="text-sm text-gray-600">Balance</div>
        <div className="text-2xl font-semibold">$2,450.00</div>
        <div className="mt-2 flex gap-2">
          <button
            className="flex-1 rounded-lg bg-gray-100 p-2"
            onClick={() => navigate('/module-1')}
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

      {/* Bottom Sticky Nav */}
      <BottomStickyNav />
    </PageShell>
  )
}
