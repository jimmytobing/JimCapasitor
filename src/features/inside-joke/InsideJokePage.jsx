import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'

const boardItems = [
  {
    id: 'meme',
    icon: '😂',
    title: 'Meme internal',
    description: 'Kumpulan meme yang cuma circle kalian yang paham konteksnya.',
    note: 'Saved 12 times',
    tone: 'from-amber-300 to-orange-400',
    examples: [
      {
        id: 'meme-1',
        art: '🤣',
        sender: 'Joshua',
        time: '09:14',
        title: 'Joshua tiap bilang "OTW"',
        caption: 'Padahal masih mandi dan baru cari kaos.',
      },
      {
        id: 'meme-2',
        art: '⏰',
        sender: 'Bayu',
        time: '19:02',
        title: 'Alarm rapat circle jam 7',
        caption: 'Semua baca, semua mute, tidak ada yang join tepat waktu.',
      },
      {
        id: 'meme-3',
        art: '🫥',
        sender: 'Ryan',
        time: '22:16',
        title: 'Mode silent pas ditag',
        caption: 'Aktif di grup lain, tapi begitu ditanya langsung menghilang.',
      },
    ],
  },
  {
    id: 'joke',
    icon: '🤣',
    title: 'Joke teman',
    description: 'Quote receh, punchline absurd, dan candaan khas tongkrongan.',
    note: 'Hot this week',
    tone: 'from-fuchsia-400 to-pink-500',
    examples: [
      {
        id: 'joke-1',
        art: '🎤',
        sender: 'Bayu',
        time: '11:08',
        title: 'Bayu: "Aku serius"',
        caption: 'Kalimat yang selalu muncul sebelum semua orang ketawa.',
      },
      {
        id: 'joke-2',
        art: '🫠',
        sender: 'Angga',
        time: '08:21',
        title: 'Angga typo legendaris',
        caption: '"Semnagat" sekarang jadi quote wajib tiap pagi.',
      },
      {
        id: 'joke-3',
        art: '😌',
        sender: 'Joshua',
        time: '20:04',
        title: 'Percaya diri tanpa alasan',
        caption: '"Tenang, aku hafal jalan" lalu tetap nyasar dua kali.',
      },
    ],
  },
  {
    id: 'screenshot',
    icon: '📸',
    title: 'Screenshot lucu',
    description: 'Chat random, typo ikonik, dan momen yang tidak boleh hilang.',
    note: 'Archive ready',
    tone: 'from-sky-400 to-cyan-500',
    examples: [
      {
        id: 'screenshot-1',
        art: '💬',
        sender: 'Ryan',
        time: '02:07',
        title: 'Chat jam 2 pagi',
        caption: 'Thread debat mie instan yang berakhir jadi sharing hidup.',
      },
      {
        id: 'screenshot-2',
        art: '📱',
        sender: 'Vina',
        time: '22:41',
        title: 'Voice note salah kirim',
        caption: 'Momen paling chaos yang masih sering di-replay.',
      },
      {
        id: 'screenshot-3',
        art: '📷',
        sender: 'Bayu',
        time: '18:27',
        title: 'Screenshot chat setengah sadar',
        caption: 'Balasan yang dikirim terlalu cepat dan langsung disesali.',
      },
    ],
  },
]

export default function InsideJokePage() {
  const navigate = useNavigate()
  const [openItemId, setOpenItemId] = useState('meme')
  const itemRefs = useRef({})
  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-stone-900 via-slate-800 to-orange-700 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/70"
              onClick={() => navigate('/')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Inside Joke Board</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/85">
              Tempat menyimpan meme internal, joke teman, dan screenshot lucu yang
              membentuk memori persahabatan.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">Memory board</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Semua inside joke tersimpan rapi dan gampang dibuka lagi kapan saja.
                  </p>
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                  3 boards
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {boardItems.map((item) => {
                  const isOpen = openItemId === item.id
                  return (
                    <div
                      key={item.id}
                      ref={(node) => {
                        itemRefs.current[item.id] = node
                      }}
                      className="overflow-hidden rounded-3xl bg-slate-50 shadow-sm ring-1 ring-slate-100"
                    >
                      <button
                        className={`flex w-full items-center gap-3 bg-gradient-to-r ${item.tone} px-4 py-4 text-left text-white`}
                        onClick={() => {
                          setOpenItemId((prev) => {
                            const nextId = prev === item.id ? '' : item.id
                            if (nextId) {
                              requestAnimationFrame(() => {
                                itemRefs.current[item.id]?.scrollIntoView({
                                  behavior: 'smooth',
                                  block: 'start',
                                })
                              })
                            }
                            return nextId
                          })
                        }}
                      >
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl backdrop-blur-sm">
                          {item.icon}
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-semibold">{item.title}</h3>
                          <p className="text-sm text-white/80">{item.note}</p>
                        </div>
                        <span className="text-2xl leading-none">{isOpen ? '−' : '+'}</span>
                      </button>

                      {isOpen && (
                        <div className="bg-white px-4 py-4">
                          <p className="text-sm leading-6 text-slate-600">{item.description}</p>
                          <div className="mt-4 space-y-3">
                            {item.examples.map((example) => (
                              <div
                                key={example.id}
                                className="rounded-3xl bg-slate-50 p-3 ring-1 ring-slate-100"
                              >
                                <div className="flex items-center justify-between gap-3 px-1">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      className={`flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br ${item.tone} text-base text-white shadow-sm`}
                                      onClick={() =>
                                        navigate(`/memory-timeline/${example.sender.toLowerCase()}`)
                                      }
                                    >
                                      {example.sender[0]}
                                    </button>
                                    <div>
                                      <p className="text-sm font-semibold text-slate-900">
                                        {example.sender}
                                      </p>
                                      <p className="text-xs text-slate-400">saved image message</p>
                                    </div>
                                  </div>
                                  <span className="text-xs font-medium text-slate-400">
                                    {example.time}
                                  </span>
                                </div>

                                <div className="mt-3 pl-8">
                                  <div className="relative w-full max-w-[88%]">
                                    <div className="relative rounded-[22px] rounded-tl-md bg-[#dcf8c6] p-2 shadow-sm">
                                      <span className="absolute -left-2 top-4 h-4 w-4 rotate-45 rounded-sm bg-[#dcf8c6]" />
                                      <p className="px-1 pb-2 text-sm font-semibold leading-5 text-slate-800">
                                        {example.title}
                                      </p>
                                      <div className="overflow-hidden rounded-[18px] bg-white p-4 shadow-inner">
                                        <div className="flex items-center justify-center rounded-[14px] border border-slate-200 bg-white px-4 py-10 text-center">
                                          <div>
                                            <div className="text-5xl">{example.art}</div>
                                            <p className="mt-3 text-base font-semibold text-slate-800">
                                              {example.caption}
                                            </p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
      <BottomStickyNav />
    </div>
  )
}
