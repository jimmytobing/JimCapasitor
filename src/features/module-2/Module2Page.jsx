import { useNavigate } from 'react-router-dom'

export default function Module2Page() {
  const navigate = useNavigate()

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
      <div className="rounded-lg bg-white p-4 shadow">Apa kabar dunia</div>
    </div>
  )
}
