import { useEffect, useState } from 'react'
import type { AssociationContent } from '../../models/app'
import {
  fetchAssociationContent,
  parseAssociationContent,
} from '../../services/api'

const emptyContent: AssociationContent = {
  body: '',
  members: [],
  updatedAt: '',
}

function AssociationPage() {
  const [content, setContent] = useState<AssociationContent>(emptyContent)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadContent = async () => {
      try {
        const response = await fetchAssociationContent()
        if (!response.ok) {
          return
        }

        const data = await parseAssociationContent(response)
        if (isMounted) {
          setContent(data)
        }
      } catch {
        // Keep the fallback state.
      }
    }

    loadContent()

    return () => {
      isMounted = false
    }
  }, [])

  const memberCount = content.members.length
  const safeIndex = memberCount === 0 ? 0 : Math.min(activeIndex, memberCount - 1)
  const activeMember = content.members[safeIndex] ?? null

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-20">
      <section className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
          Association
        </p>
        <h2 className="mt-4 font-display text-3xl text-slate-50">
          Le comite et ses membres
        </h2>
        <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-200/85">
          {content.body || "Le texte de presentation ajoute depuis l'admin s'affichera ici."}
        </p>
      </section>

      <section className="mt-8 rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
              Membres
            </p>
            <h3 className="mt-3 font-display text-2xl text-slate-50">
              Carrousel de l'association
            </h3>
          </div>
          {content.updatedAt && (
            <span className="text-xs uppercase tracking-[0.25em] text-slate-300/70">
              Mise a jour le {new Date(content.updatedAt).toLocaleDateString('fr-FR')}
            </span>
          )}
        </div>

        {activeMember ? (
          <div className="mt-8">
            <div className="relative overflow-hidden rounded-3xl border border-slate-200/10 bg-slate-950/60 p-4">
              <img
                src={activeMember.imageDataUrl}
                alt={activeMember.name}
                className="h-[420px] w-full rounded-2xl object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-slate-950/70 px-5 py-4 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.25em] text-slate-300/70">
                  Membre
                </p>
                <h4 className="mt-2 font-display text-2xl text-slate-50">
                  {activeMember.name}
                </h4>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(() =>
                      safeIndex === 0 ? memberCount - 1 : safeIndex - 1
                    )
                  }
                  className="rounded-xl border border-slate-200/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Precedent
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setActiveIndex(() =>
                      safeIndex === memberCount - 1 ? 0 : safeIndex + 1
                    )
                  }
                  className="rounded-xl border border-slate-200/30 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  Suivant
                </button>
              </div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-300/70">
                {safeIndex + 1} / {content.members.length}
              </p>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
              {content.members.map((member, index) => (
                <button
                  key={member.id}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  className={`overflow-hidden rounded-2xl border text-left transition ${
                    index === safeIndex
                      ? 'border-slate-100'
                      : 'border-slate-200/10'
                  }`}
                >
                  <img
                    src={member.imageDataUrl}
                    alt={member.name}
                    className="h-28 w-full object-cover"
                  />
                  <div className="px-3 py-3 text-sm text-slate-100">{member.name}</div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <p className="mt-6 text-sm leading-relaxed text-slate-200/80">
            Les membres ajoutes depuis l'espace admin s'afficheront ici.
          </p>
        )}
      </section>
    </main>
  )
}

export default AssociationPage
