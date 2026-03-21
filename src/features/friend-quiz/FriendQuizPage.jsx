import { useNavigate, useSearchParams } from 'react-router-dom'
import BottomStickyNav from '../../shared/components/BottomStickyNav.jsx'
import { currentUser } from '../chat/chatData.js'
import { getCircleTitle, quizQuestions } from './friendQuizData.js'

export default function FriendQuizPage({ showToast }) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const circleId = searchParams.get('circle') || 'best-friend'
  const notify = typeof showToast === 'function' ? showToast : () => {}

  const circleTitle = getCircleTitle(circleId)

  return (
    <div className="h-screen overflow-y-auto bg-[#edf2f7] hide-scrollbar">
      <div className="min-h-screen pb-28">
        <section className="bg-white shadow-none">
          <div className="bg-gradient-to-r from-violet-700 via-fuchsia-600 to-pink-500 px-5 pb-8 pt-[calc(1rem+env(safe-area-inset-top)+1rem)] text-white">
            <button
              className="text-sm font-medium text-white/80"
              onClick={() => navigate('/circle')}
            >
              {'< Back'}
            </button>
            <h1 className="mt-1 text-2xl font-semibold">Friend Quiz</h1>
            <p className="mt-2 max-w-[24rem] text-sm leading-6 text-white/90">
              Teman menjawab pertanyaan tentang kamu. Kalau benar, mereka dapat point.
            </p>
          </div>

          <div className="space-y-4 p-3">
            <div className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{circleTitle}</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Quiz kecil untuk ngetes seberapa kenal teman dengan {currentUser.name}.
                  </p>
                </div>
                <button
                  type="button"
                  className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700"
                  onClick={() => navigate(`/friend-quiz/new?circle=${circleId}`)}
                >
                  + Add question
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {quizQuestions.map((quiz, index) => (
                  <div
                    key={quiz.id}
                    className="rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-100"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
                        Question {index + 1}
                      </p>
                      <span className="rounded-full bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                        +10 point
                      </span>
                    </div>

                    <h3 className="mt-2 text-lg font-semibold text-slate-900">{quiz.question}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-500">{quiz.description}</p>

                    <div className="mt-4 space-y-3">
                      {quiz.options.map((option) => (
                        <button
                          key={option.id}
                          className="flex w-full items-center justify-between rounded-2xl bg-white px-4 py-4 text-left shadow-sm ring-1 ring-slate-100 transition hover:bg-slate-100"
                          onClick={() =>
                            notify(
                              option.isCorrect
                                ? `${option.label} benar. Teman dapat 10 point.`
                                : `${option.label} belum tepat.`
                            )
                          }
                        >
                          <span className="text-sm font-semibold text-slate-800">
                            {option.label}
                          </span>
                          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-500">
                            Choose
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
      <BottomStickyNav />
    </div>
  )
}
