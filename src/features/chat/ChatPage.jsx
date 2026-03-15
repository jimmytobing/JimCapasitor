import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import PageShell from '../../shared/components/PageShell.jsx'

export default function ChatPage() {
  const navigate = useNavigate()
  const items = ['Chat Thread A', 'Chat Thread B', 'Chat Thread C']

  return (
    <PageShell>
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
      <BottomStickyNav />
    </PageShell>
  )
}
