import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import PageShell from '../../shared/components/PageShell.jsx'

export default function ActivityPage() {
  const items = ['Activity 1', 'Activity 2', 'Activity 3']

  return (
    <PageShell>
      <div className="space-y-2">
        {items.map((item) => (
          <div key={item} className="rounded-lg bg-white p-4 shadow">
            {item}
          </div>
        ))}
      </div>
      <BottomStickyNav />
    </PageShell>
  )
}
