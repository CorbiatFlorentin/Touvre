import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { AsyncStatus, NewsletterPayload } from '../../models/app'
import { publishNewsletter } from '../../services/api'
import { optimizeImageFile } from '../../utils/imageUpload'

type AdminNewsletterPageProps = {
  onLogout: () => void
  onBack: () => void
  token: string | null
  onPublished: () => Promise<void>
}

const initialPayload: NewsletterPayload = {
  title: '',
  content: '',
  publishedAt: '',
  images: [],
}

function AdminNewsletterPage({
  onLogout,
  onBack,
  token,
  onPublished,
}: AdminNewsletterPageProps) {
  const [payload, setPayload] = useState<NewsletterPayload>(initialPayload)
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const isValid = useMemo(() => {
    return (
      payload.title.trim().length > 0 &&
      payload.content.trim().length > 0 &&
      payload.publishedAt.trim().length > 0 &&
      payload.images.length > 0
    )
  }, [payload])

  const handleChange =
    (field: 'title' | 'content' | 'publishedAt') =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setPayload((current) => ({
        ...current,
        [field]: value,
      }))
    }

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || [])

    try {
      const images = await Promise.all(files.map((file) => optimizeImageFile(file)))
      setPayload((current) => ({
        ...current,
        images,
      }))
      setErrorMessage('')
    } catch {
      setErrorMessage("Impossible de preparer les photos selectionnees.")
    }
  }

  const handlePublish = async () => {
    if (!token) {
      setErrorMessage("Session admin manquante. Reconnectez-vous.")
      return
    }
    if (!isValid) {
      setErrorMessage('Completer les champs obligatoires.')
      return
    }

    setErrorMessage('')
    setStatus('loading')
    try {
      const response = await publishNewsletter(
        payload,
        token
      )

      if (!response.ok) {
        setErrorMessage("Impossible de publier la newsletter.")
        setStatus('error')
        return
      }

      setStatus('success')
      await onPublished()
    } catch {
      setErrorMessage("Erreur reseau. Verifiez l'API.")
      setStatus('error')
    }
  }

  return (
    <main className="mx-auto w-full max-w-[1500px] px-6 pb-20 pt-20">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Admin
          </p>
          <h2 className="mt-3 font-display text-3xl text-slate-50">
            Publication newsletter
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl border border-slate-200/40 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Retour tableau de bord
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-slate-200/40 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Se deconnecter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
                Redaction
              </p>
              <h3 className="mt-3 font-display text-2xl text-slate-50">
                Nouvelle publication
              </h3>
            </div>
	            <div className="rounded-full border border-slate-200/40 px-4 py-1 text-xs uppercase tracking-[0.2em] text-slate-200">
	              Categorie: Site public
	            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5">
	            <label className="grid gap-2 text-sm text-slate-200/80">
	              Titre
              <input
                className="rounded-xl border border-slate-200/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-slate-100/70"
                value={payload.title}
                onChange={handleChange('title')}
                placeholder="Annonce principale"
              />
            </label>
	            <label className="grid gap-2 text-sm text-slate-200/80">
	              Contenu
              <textarea
                className="min-h-[220px] rounded-xl border border-slate-200/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-slate-100/70"
                value={payload.content}
                onChange={handleChange('content')}
                placeholder="Corps de la newsletter."
              />
            </label>
	            <label className="grid gap-2 text-sm text-slate-200/80">
	              Date de publication
	              <input
	                type="date"
	                className="rounded-xl border border-slate-200/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-slate-100/70"
	                value={payload.publishedAt}
	                onChange={handleChange('publishedAt')}
	              />
	            </label>
	            <label className="grid gap-2 text-sm text-slate-200/80">
	              Photos
	              <input
	                type="file"
	                accept="image/*"
	                multiple
	                onChange={handleImageChange}
	                className="rounded-xl border border-slate-200/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.2em] file:text-slate-900"
	              />
	            </label>
	            {payload.images.length > 0 && (
	              <div className="grid grid-cols-2 gap-3">
	                {payload.images.map((image, index) => (
	                  <img
	                    key={index}
	                    src={image}
	                    alt={`Apercu ${index + 1}`}
	                    className="h-32 w-full rounded-2xl object-cover"
	                  />
	                ))}
	              </div>
	            )}
	          </div>

          {errorMessage && (
            <p className="mt-6 rounded-2xl border border-rose-200/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </p>
          )}
          {status === 'success' && (
	            <p className="mt-6 rounded-2xl border border-emerald-200/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
	              Newsletter publiee sur le site.
	            </p>
	          )}

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePublish}
              disabled={!isValid || status === 'loading'}
              className="rounded-xl border border-slate-200/40 bg-slate-100 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-200/60"
            >
              {status === 'loading' ? 'Publication...' : 'Publier'}
            </button>
	            <p className="text-xs uppercase tracking-[0.25em] text-slate-300/70">
	              Champs obligatoires: titre, texte, date, photos.
	            </p>
	          </div>
	        </section>

        <aside className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Apercu
          </p>
	          <h3 className="mt-3 font-display text-2xl text-slate-50">
	            {payload.title || 'Titre de la newsletter'}
	          </h3>
	          <p className="mt-4 text-sm uppercase tracking-[0.3em] text-slate-300/70">
	            {payload.publishedAt
	              ? new Date(payload.publishedAt).toLocaleDateString('fr-FR')
	              : 'Date de publication'}
	          </p>
	          <div className="mt-6 whitespace-pre-line text-sm leading-relaxed text-slate-100">
	            {payload.content || 'Contenu de la newsletter.'}
	          </div>
	          {payload.images.length > 0 && (
	            <div className="mt-6 grid grid-cols-2 gap-3">
	              {payload.images.map((image, index) => (
	                <img
	                  key={index}
	                  src={image}
	                  alt={`Newsletter ${index + 1}`}
	                  className="h-36 w-full rounded-2xl object-cover"
	                />
	              ))}
	            </div>
	          )}
	        </aside>
	      </div>
	    </main>
  )
}

export default AdminNewsletterPage
