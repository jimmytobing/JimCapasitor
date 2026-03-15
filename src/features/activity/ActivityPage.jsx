import { useLocation, useNavigate } from 'react-router-dom'

export default function ActivityPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path
  const items = ['Activity 1', 'Activity 2', 'Activity 3']

  return (
    <div className="mx-auto max-w-[420px] space-y-4 p-4">
      {/* Back Button */}
      <button
        className="rounded-lg bg-white p-2 shadow"
        onClick={() => navigate('/')}
      >
        Back
      </button>

      {/* Content */}
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-lg bg-white p-4 shadow">
            {item}
          </div>
        ))}
      </div>

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
