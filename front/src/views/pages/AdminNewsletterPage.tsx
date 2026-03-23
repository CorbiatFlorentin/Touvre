/* eslint-disable @typescript-eslint/no-unused-vars */
import { useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import type { AsyncStatus, NewsletterPayload } from '../../models/app'
import { publishNewsletter } from '../../services/api'

type AdminNewsletterPageProps = {
  onLogout: () => void
  onBack: () => void
  token: string | null
}

const initialPayload: NewsletterPayload = {
  title: '',
  subject: '',
  summary: '',
  content: '',
  ctaLabel: '',
  ctaUrl: '',
  scheduledAt: null,
}

function AdminNewsletterPage({ onLogout, onBack, token }: AdminNewsletterPageProps) {
  const [payload, setPayload] = useState<NewsletterPayload>(initialPayload)
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const isValid = useMemo(() => {
    return (
      payload.title.trim().length > 0 &&
      payload.subject.trim().length > 0 &&
      payload.summary.trim().length > 0 &&
      payload.content.trim().length > 0
    )
  }, [payload])

  const handleChange =
    (field: keyof NewsletterPayload) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const value = event.target.value
      setPayload((current) => ({
        ...current,
        [field]: value,
      }))
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
        {
          ...payload,
          ctaLabel: payload.ctaLabel?.trim() || undefined,
          ctaUrl: payload.ctaUrl?.trim() || undefined,
          scheduledAt: payload.scheduledAt?.trim() || null,
        },
        token
      )

      if (!response.ok) {
        setErrorMessage("Impossible de publier la newsletter.")
        setStatus('error')
        return
      }

      setStatus('success')
    } catch (error) {
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
              Categorie: Newsletter
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
              Objet email
              <input
                className="rounded-xl border border-slate-200/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-slate-100/70"
                value={payload.subject}
                onChange={handleChange('subject')}
                placeholder="Ex: Les prochaines dates du comite"
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-200/80">
              Resume
              <textarea
                className="min-h-[110px] rounded-xl border border-slate-200/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-slate-100/70"
                value={payload.summary}
                onChange={handleChange('summary')}
                placeholder="Intro courte pour la newsletter."
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
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-200/80">
                Texte du bouton (optionnel)
                <input
                  className="rounded-xl border border-slate-200/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-slate-100/70"
                  value={payload.ctaLabel || ''}
                  onChange={handleChange('ctaLabel')}
                  placeholder="Decouvrir"
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-200/80">
                Lien du bouton (optionnel)
                <input
                  className="rounded-xl border border-slate-200/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-slate-100/70"
                  value={payload.ctaUrl || ''}
                  onChange={handleChange('ctaUrl')}
                  placeholder="https://"
                />
              </label>
            </div>
            <label className="grid gap-2 text-sm text-slate-200/80">
              Date de publication (optionnel)
              <input
                type="datetime-local"
                className="rounded-xl border border-slate-200/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-slate-100/70"
                value={payload.scheduledAt || ''}
                onChange={handleChange('scheduledAt')}
              />
            </label>
          </div>

          {errorMessage && (
            <p className="mt-6 rounded-2xl border border-rose-200/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </p>
          )}
          {status === 'success' && (
            <p className="mt-6 rounded-2xl border border-emerald-200/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              Newsletter publiee.
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
              Champs obligatoires: titre, objet, resume, contenu.
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
            {payload.subject || 'Objet email'}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-slate-200/80">
            {payload.summary || 'Resume court pour situer le sujet.'}
          </p>
          <div className="mt-6 whitespace-pre-line text-sm leading-relaxed text-slate-100">
            {payload.content || 'Contenu detaille de la newsletter.'}
          </div>
          {payload.ctaLabel && payload.ctaUrl && (
            <div className="mt-8">
              <span className="inline-flex items-center rounded-full bg-slate-100 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900">
                {payload.ctaLabel}
              </span>
              <p className="mt-3 text-xs text-slate-300/70">{payload.ctaUrl}</p>
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}

export default AdminNewsletterPage
