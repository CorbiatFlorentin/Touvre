import { useCallback, useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import MainSections from './components/MainSections'

type View =
  | 'home'
  | 'association'
  | 'evenements'
  | 'inscription-bric-a-brac'
  | 'inscription-michoui'

function EventRegistrationPage({
  title,
  onBack,
}: {
  title: string
  onBack: () => void
}) {
  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-20 pt-20">
      <div className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
          Inscriptions
        </p>
        <h2 className="mt-4 font-display text-3xl text-slate-50">{title}</h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
          Completez le formulaire pour vous inscrire a cet evenement.
        </p>

        <form className="mt-6 grid gap-4">
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Nom complet
            <input
              type="text"
              className="rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
              placeholder="Votre nom"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Email
            <input
              type="email"
              className="rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
              placeholder="votre@email.com"
            />
          </label>
          <button
            type="submit"
            className="rounded-xl border border-slate-200/40 bg-slate-100 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white"
          >
            Envoyer l'inscription
          </button>
        </form>

        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-sm text-slate-200/80 underline underline-offset-4 transition hover:text-slate-50"
        >
          Retour aux evenements
        </button>
      </div>
    </main>
  )
}

function EventsPage({ onNavigate }: { onNavigate: (target: string) => void }) {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-20">
      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Evenement
          </p>
          <h2 className="mt-4 font-display text-3xl text-slate-50">
            Bric a Brac de Touvre
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
            Inscrivez-vous pour exposer ou participer a la prochaine edition.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl border border-slate-200/40 bg-slate-100 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white"
            onClick={() => onNavigate('inscription-bric-a-brac')}
          >
            S'inscrire
          </button>
        </article>

        <article className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Evenement
          </p>
          <h2 className="mt-4 font-display text-3xl text-slate-50">
            Michoui de Touvre
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
            Rejoignez la liste des participants pour le repas convivial.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl border border-slate-200/40 bg-slate-100 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white"
            onClick={() => onNavigate('inscription-michoui')}
          >
            S'inscrire
          </button>
        </article>
      </div>
    </main>
  )
}

function App() {
  const [view, setView] = useState<View>('home')

  const handleNavigate = useCallback((target: string) => {
    if (target === 'association') {
      setView('association')
      return
    }
    if (target === 'evenements') {
      setView('evenements')
      return
    }
    if (target === 'inscription-bric-a-brac') {
      setView('inscription-bric-a-brac')
      return
    }
    if (target === 'inscription-michoui') {
      setView('inscription-michoui')
      return
    }

    setView('home')
    requestAnimationFrame(() => {
      const section = document.getElementById(target)
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  return (
    <div className="min-h-screen text-slate-50">
      <Header onNavigate={handleNavigate} />
      {view === 'home' && (
        <>
          <MainSections />
          <Footer />
        </>
      )}
      {view === 'association' && (
        <main className="mx-auto flex min-h-[40vh] w-full max-w-6xl items-center justify-center px-6 pb-20 pt-20">
          <div className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-10 text-center shadow-panel backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
              Association
            </p>
            <h2 className="mt-4 font-display text-3xl text-slate-50">
              Page en preparation.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
              Ce contenu sera ajoute prochainement.
            </p>
          </div>
        </main>
      )}
      {view === 'evenements' && <EventsPage onNavigate={handleNavigate} />}
      {view === 'inscription-bric-a-brac' && (
        <EventRegistrationPage
          title="Inscription au Bric a Brac de Touvre"
          onBack={() => setView('evenements')}
        />
      )}
      {view === 'inscription-michoui' && (
        <EventRegistrationPage
          title="Inscription au Michoui de Touvre"
          onBack={() => setView('evenements')}
        />
      )}
    </div>
  )
}

export default App
