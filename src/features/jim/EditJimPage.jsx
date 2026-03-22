import { useEditJimPage } from './useEditJimPage.js'

export default function EditJimPage({ showToast }) {
  const { error, formState, handleChange, handleSubmit, isSaving, loadingMessage, navigate, record } =
    useEditJimPage(showToast)

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
            {!record ? (
              <div className="mb-4 rounded-2xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                Data record belum dibawa dari halaman Jim. Kembali lalu pilih card untuk mulai edit.
              </div>
            ) : null}
                        
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
                  name="title"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  value={formState.title}
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
                  name="content"
                  rows="6"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none"
                  value={formState.content}
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
