export default function TopBar() {
  return (
    <div className="flex items-center gap-2">
      <input
        className="flex-1 rounded-lg bg-white p-2 shadow"
        placeholder="Search"
        type="text"
      />
      <div className="h-10 w-10 rounded-full bg-gray-300" />
    </div>
  )
}
