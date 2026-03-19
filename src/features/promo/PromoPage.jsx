import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import PageShell from '../../shared/components/PageShell.jsx'

export default function PromoPage() {
  const items = ['Promo Card A', 'Promo Card B', 'Promo Card C']

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
