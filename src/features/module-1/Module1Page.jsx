import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import PageShell from '../../shared/components/PageShell.jsx'

export default function Module1Page() {
  const navigate = useNavigate()

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
      <div className="rounded-lg bg-white p-4 shadow">Hello World Jimmy</div>

      {/* Bottom Sticky Nav */}
      <BottomStickyNav />
    </PageShell>
  )
}
