import { useEffect, useMemo, useState } from 'react'
import type { ChangeEvent } from 'react'
import type {
  AssociationContentPayload,
  AssociationMemberInput,
  AsyncStatus,
} from '../../models/app'
import {
  fetchAssociationContent,
  parseAssociationContent,
  saveAssociationContent,
} from '../../services/api'
import { optimizeImageFile } from '../../utils/imageUpload'

type AdminAssociationPageProps = {
  onLogout: () => void
  onBack: () => void
  token: string | null
}

const emptyMember = (): AssociationMemberInput => ({
  name: '',
  imageDataUrl: '',
})

function AdminAssociationPage({
  onLogout,
  onBack,
  token,
}: AdminAssociationPageProps) {
  const [payload, setPayload] = useState<AssociationContentPayload>({
    body: '',
    members: [emptyMember()],
  })
  const [status, setStatus] = useState<AsyncStatus>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let isMounted = true

    const loadContent = async () => {
      try {
        const response = await fetchAssociationContent()
        if (!response.ok) {
          return
        }

        const data = await parseAssociationContent(response)
        if (!isMounted) {
          return
        }

        setPayload({
          body: data.body,
          members: data.members.length > 0 ? data.members : [emptyMember()],
        })
      } catch (_error) {
        // Keep editable defaults.
      }
    }

    loadContent()

    return () => {
      isMounted = false
    }
  }, [])

  const isValid = useMemo(() => {
    return (
      payload.body.trim().length > 0 &&
      payload.members.length > 0 &&
      payload.members.every(
        (member) =>
          member.name.trim().length > 0 && member.imageDataUrl.trim().length > 0
      )
    )
  }, [payload])

  const updateMember = (
    index: number,
    field: keyof AssociationMemberInput,
    value: string
  ) => {
    setPayload((current) => ({
      ...current,
      members: current.members.map((member, memberIndex) =>
        memberIndex === index ? { ...member, [field]: value } : member
      ),
    }))
  }

  const handleMemberImageChange =
    (index: number) => async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) {
        return
      }

      try {
        const imageDataUrl = await optimizeImageFile(file)
        updateMember(index, 'imageDataUrl', imageDataUrl)
        setErrorMessage('')
      } catch (_error) {
        setErrorMessage("Impossible de preparer la photo selectionnee.")
      }
    }

  const handleSave = async () => {
    if (!token) {
      setErrorMessage("Session admin manquante. Reconnectez-vous.")
      return
    }
    if (!isValid) {
      setErrorMessage('Completer le texte et chaque membre avec une photo.')
      return
    }

    setErrorMessage('')
    setStatus('loading')

    try {
      const response = await saveAssociationContent(payload, token)
      if (!response.ok) {
        setErrorMessage("Impossible d'enregistrer la page association.")
        setStatus('error')
        return
      }

      setStatus('success')
    } catch (_error) {
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
            Page association
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
          <label className="grid gap-2 text-sm text-slate-200/80">
            Texte de presentation
            <textarea
              className="min-h-[180px] rounded-xl border border-slate-200/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-slate-100/70"
              value={payload.body}
              onChange={(event) =>
                setPayload((current) => ({ ...current, body: event.target.value }))
              }
              placeholder="Presentation de l'association."
            />
          </label>

          <div className="mt-8 grid gap-5">
            {payload.members.map((member, index) => (
              <div
                key={index}
                className="rounded-2xl border border-slate-200/10 bg-slate-950/50 p-5"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-xl text-slate-50">
                    Membre {index + 1}
                  </h3>
                  {payload.members.length > 1 && (
                    <button
                      type="button"
                      onClick={() =>
                        setPayload((current) => ({
                          ...current,
                          members: current.members.filter(
                            (_entry, memberIndex) => memberIndex !== index
                          ),
                        }))
                      }
                      className="text-xs uppercase tracking-[0.2em] text-rose-200"
                    >
                      Supprimer
                    </button>
                  )}
                </div>
                <div className="mt-4 grid gap-4">
                  <label className="grid gap-2 text-sm text-slate-200/80">
                    Nom
                    <input
                      className="rounded-xl border border-slate-200/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none transition focus:border-slate-100/70"
                      value={member.name}
                      onChange={(event) =>
                        updateMember(index, 'name', event.target.value)
                      }
                      placeholder="Nom du membre"
                    />
                  </label>
                  <label className="grid gap-2 text-sm text-slate-200/80">
                    Photo
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleMemberImageChange(index)}
                      className="rounded-xl border border-slate-200/20 bg-slate-950/60 px-4 py-3 text-sm text-slate-50 outline-none transition file:mr-4 file:rounded-lg file:border-0 file:bg-slate-100 file:px-4 file:py-2 file:text-xs file:font-semibold file:uppercase file:tracking-[0.2em] file:text-slate-900"
                    />
                  </label>
                  {member.imageDataUrl && (
                    <img
                      src={member.imageDataUrl}
                      alt={member.name || `Membre ${index + 1}`}
                      className="h-40 w-full rounded-2xl object-cover"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() =>
                setPayload((current) => ({
                  ...current,
                  members: [...current.members, emptyMember()],
                }))
              }
              className="rounded-xl border border-slate-200/40 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Ajouter un membre
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValid || status === 'loading'}
              className="rounded-xl border border-slate-200/40 bg-slate-100 px-6 py-3 text-xs font-semibold uppercase tracking-[0.25em] text-slate-900 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-slate-200/60"
            >
              {status === 'loading' ? 'Enregistrement...' : 'Enregistrer'}
            </button>
          </div>

          {errorMessage && (
            <p className="mt-6 rounded-2xl border border-rose-200/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              {errorMessage}
            </p>
          )}
          {status === 'success' && (
            <p className="mt-6 rounded-2xl border border-emerald-200/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
              Page association enregistree.
            </p>
          )}
        </section>

        <aside className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Apercu
          </p>
          <h3 className="mt-3 font-display text-2xl text-slate-50">
            Association
          </h3>
          <p className="mt-6 whitespace-pre-line text-sm leading-relaxed text-slate-100">
            {payload.body || 'Le texte de presentation apparaitra ici.'}
          </p>
          <div className="mt-6 grid gap-4">
            {payload.members.map((member, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-2xl border border-slate-200/10 bg-slate-950/50"
              >
                {member.imageDataUrl ? (
                  <img
                    src={member.imageDataUrl}
                    alt={member.name || `Membre ${index + 1}`}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center text-xs uppercase tracking-[0.2em] text-slate-400">
                    Photo
                  </div>
                )}
                <div className="px-4 py-4 text-sm text-slate-100">
                  {member.name || `Membre ${index + 1}`}
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </main>
  )
}

export default AdminAssociationPage
