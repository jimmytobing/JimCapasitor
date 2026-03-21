const data = [
  {
    title: 'Hello',
    avatarInitial: 'H',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
  },
  {
    title: 'jimmy',
    avatarInitial: 'J',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
  },
]

export default function JimPage() {
  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <div className="mx-auto flex max-w-md flex-col gap-4">



        {data.map((item) => (
          <section
            key={item.title}
            className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
                {item.avatarInitial}
              </div>
              <h2 className="text-xl font-semibold text-slate-900">{item.title}</h2>
            </div>
            <p className="mt-3 text-base leading-7 text-slate-700">{item.content}</p>
          </section>
        ))}



      </div>
    </main>
  )
}
