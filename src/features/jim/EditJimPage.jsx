import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createFormChangeHandler } from '../../shared/utils/forms.js'
import { createEmptyCard, useEditJimPage } from './useEditJimPage.js'

export default function EditJimPage({ showToast }) {
  const navigate = useNavigate()
  const [card, setCard] = useState(createEmptyCard)
  const handleChange = createFormChangeHandler(setCard)
  const {
    error,
    loadingMessage,
    handleSubmit,
    isSaving,
  } = useEditJimPage(showToast, card, setCard)

  return (
    <div className="min-h-screen bg-slate-100">
      <section className="bg-white shadow-none">
        <div className="space-y-4 p-3 pb-8">
          <button className="bg-black" onClick={() => navigate('/jim')}>
            {'< Back'}
          </button>
          <form
            className="rounded-3xl bg-white p-4 shadow-sm ring-1 ring-slate-100"
            onSubmit={(event) => void handleSubmit(event)}
          >
            {loadingMessage ? (
              <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm text-sky-700">
                {loadingMessage}
              </div>
            ) : null}

            {error ? (
              <div className="rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {error}
              </div>
            ) : null}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="title">
                  Title
                </label>
                <input
                  id="title"
                  name="Title"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  value={card.Title}
                  onChange={handleChange}
                  disabled={Boolean(loadingMessage) || isSaving}
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-800" htmlFor="content">
                  Content
                </label>
                <textarea
                  id="content"
                  name="Content"
                  rows="6"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  value={card.Content}
                  onChange={handleChange}
                  disabled={Boolean(loadingMessage) || isSaving}
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white"
                disabled={Boolean(loadingMessage) || isSaving}
              >
                {isSaving ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  )
}
