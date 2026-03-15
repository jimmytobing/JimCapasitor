import { useNavigate } from 'react-router-dom'

export default function ActivityPage() {
  const navigate = useNavigate()
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
    </div>
  )
}
