import { useCallback, useEffect, useMemo, useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import MainSections from './components/MainSections'

type View =
  | 'home'
  | 'association'
  | 'evenements'
  | 'inscription-vide-grenier'
  | 'inscription-michoui'
  | 'admin-login'
  | 'admin'

type Registration = {
  id: number
  nom: string
  email: string
  accompteVerser: boolean
  accompteMontant: number | null
  createdAt: string
}

const michouiRegistrations: Registration[] = [
  {
    id: 1,
    nom: 'Camille Roy',
    email: 'camille.roy@example.com',
    accompteVerser: true,
    accompteMontant: 1500,
    createdAt: '2026-02-10',
  },
  {
    id: 2,
    nom: 'Lucas Bernard',
    email: 'lucas.bernard@example.com',
    accompteVerser: false,
    accompteMontant: null,
    createdAt: '2026-02-12',
  },
]

const videGrenierRegistrations: Registration[] = [
  {
    id: 1,
    nom: 'Sophie Martin',
    email: 'sophie.martin@example.com',
    accompteVerser: true,
    accompteMontant: 500,
    createdAt: '2026-02-09',
  },
  {
    id: 2,
    nom: 'Hugo Petit',
    email: 'hugo.petit@example.com',
    accompteVerser: true,
    accompteMontant: 700,
    createdAt: '2026-02-11',
  },
]

const getViewFromPath = (path: string): View => {
  if (path === '/admin') {
    return 'admin'
  }
  if (path === '/admin/connexion') {
    return 'admin-login'
  }
  return 'home'
}

const getPathFromView = (view: View) => {
  if (view === 'admin') {
    return '/admin'
  }
  if (view === 'admin-login') {
    return '/admin/connexion'
  }
  return '/'
}

const getInitialView = (): View => {
  if (typeof window === 'undefined') {
    return 'home'
  }
  return getViewFromPath(window.location.pathname)
}

function EventRegistrationPage({
  title,
  onBack,
}: {
  title: string
  onBack: () => void
}) {
  const [accompte, setAccompte] = useState(false)
  const [montant, setMontant] = useState('')

  useEffect(() => {
    if (!accompte) {
      setMontant('')
    }
  }, [accompte])

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
          <label className="flex items-center gap-3 text-sm text-slate-200">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-slate-300/40 bg-slate-950/70"
              checked={accompte}
              onChange={(event) => setAccompte(event.target.checked)}
            />
            Accompte
          </label>
          {accompte && (
            <label className="flex flex-col gap-2 text-sm text-slate-200">
              Montant de l'acompte
              <input
                type="number"
                inputMode="numeric"
                min="0"
                step="1"
                value={montant}
                onChange={(event) => setMontant(event.target.value)}
                className="rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
                placeholder="Montant de l'acompte (EUR)"
              />
            </label>
          )}
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

function AdminLoginPage({
  onSuccess,
  onBack,
}: {
  onSuccess: () => void
  onBack: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  return (
    <main className="mx-auto w-full max-w-3xl px-6 pb-20 pt-20">
      <div className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
          Admin
        </p>
        <h2 className="mt-4 font-display text-3xl text-slate-50">
          Connexion admin
        </h2>
        <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
          Acces reserve au comite. Saisissez vos identifiants.
        </p>

        <form
          className="mt-6 grid gap-4"
          onSubmit={(event) => {
            event.preventDefault()
            onSuccess()
          }}
        >
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
              placeholder="admin@touvre.fr"
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Mot de passe
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
              placeholder="********"
              required
            />
          </label>
          <button
            type="submit"
            className="rounded-xl border border-slate-200/40 bg-slate-100 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white"
          >
            Se connecter
          </button>
        </form>

        <button
          type="button"
          onClick={onBack}
          className="mt-4 text-sm text-slate-200/80 underline underline-offset-4 transition hover:text-slate-50"
        >
          Retour
        </button>
      </div>
    </main>
  )
}

function AdminTable({
  title,
  entries,
  formatAmount,
}: {
  title: string
  entries: Registration[]
  formatAmount: (amount: number | null) => string
}) {
  return (
    <section className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-6 shadow-panel backdrop-blur">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
        Tableau
      </p>
      <h3 className="mt-3 font-display text-2xl text-slate-50">{title}</h3>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[520px] text-left text-sm text-slate-100">
          <thead className="text-xs uppercase tracking-[0.2em] text-slate-300">
            <tr>
              <th className="pb-3">Nom</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Accompte</th>
              <th className="pb-3">Montant</th>
              <th className="pb-3">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300/10">
            {entries.length === 0 && (
              <tr>
                <td className="py-4 text-slate-300/80" colSpan={5}>
                  Aucun inscrit pour le moment.
                </td>
              </tr>
            )}
            {entries.map((entry) => (
              <tr key={`${title}-${entry.id}`}>
                <td className="py-3 font-medium text-slate-50">{entry.nom}</td>
                <td className="py-3 text-slate-200/80">{entry.email}</td>
                <td className="py-3">
                  {entry.accompteVerser ? 'Oui' : 'Non'}
                </td>
                <td className="py-3">{formatAmount(entry.accompteMontant)}</td>
                <td className="py-3 text-slate-200/80">{entry.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function AdminDashboard({
  onLogout,
  michoui,
  videGrenier,
}: {
  onLogout: () => void
  michoui: Registration[]
  videGrenier: Registration[]
}) {
  const amountFormatter = useMemo(() => new Intl.NumberFormat('fr-FR'), [])

  const formatAmount = useCallback(
    (amount: number | null) => {
      if (amount === null) {
        return '-'
      }
      return `${amountFormatter.format(amount)} EUR`
    },
    [amountFormatter]
  )

  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-20">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Admin
          </p>
          <h2 className="mt-3 font-display text-3xl text-slate-50">
            Tableau de bord des inscriptions
          </h2>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-xl border border-slate-200/40 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 transition hover:bg-slate-100 hover:text-slate-900"
        >
          Se deconnecter
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <AdminTable
          title="Michoui"
          entries={michoui}
          formatAmount={formatAmount}
        />
        <AdminTable
          title="Vide grenier"
          entries={videGrenier}
          formatAmount={formatAmount}
        />
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
            Vide grenier de Touvre
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
            Inscrivez-vous pour exposer ou participer a la prochaine edition.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl border border-slate-200/40 bg-slate-100 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white"
            onClick={() => onNavigate('inscription-vide-grenier')}
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
  const [view, setView] = useState<View>(() => getInitialView())
  const [isAdminAuthed, setIsAdminAuthed] = useState(false)

  useEffect(() => {
    const handlePopState = () => {
      setView(getViewFromPath(window.location.pathname))
    }

    window.addEventListener('popstate', handlePopState)
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  useEffect(() => {
    if (view === 'admin' && !isAdminAuthed) {
      setView('admin-login')
      window.history.pushState({}, '', getPathFromView('admin-login'))
    }
  }, [view, isAdminAuthed])

  const setViewWithRoute = useCallback((nextView: View) => {
    setView(nextView)
    if (nextView === 'admin' || nextView === 'admin-login') {
      window.history.pushState({}, '', getPathFromView(nextView))
      return
    }
    if (window.location.pathname !== '/') {
      window.history.pushState({}, '', '/')
    }
  }, [])

  const handleNavigate = useCallback(
    (target: string) => {
      if (target === 'association') {
        setViewWithRoute('association')
        return
      }
      if (target === 'evenements') {
        setViewWithRoute('evenements')
        return
      }
      if (target === 'inscription-vide-grenier') {
        setViewWithRoute('inscription-vide-grenier')
        return
      }
      if (target === 'inscription-michoui') {
        setViewWithRoute('inscription-michoui')
        return
      }
      if (target === 'admin-login') {
        setViewWithRoute('admin-login')
        return
      }
      if (target === 'admin') {
        setViewWithRoute('admin')
        return
      }

      setViewWithRoute('home')
      requestAnimationFrame(() => {
        const section = document.getElementById(target)
        section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      })
    },
    [setViewWithRoute]
  )

  const handleAdminLogin = useCallback(() => {
    setIsAdminAuthed(true)
    setViewWithRoute('admin')
  }, [setViewWithRoute])

  const handleAdminLogout = useCallback(() => {
    setIsAdminAuthed(false)
    setViewWithRoute('admin-login')
  }, [setViewWithRoute])

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
      {view === 'inscription-vide-grenier' && (
        <EventRegistrationPage
          title="Inscription au vide grenier de Touvre"
          onBack={() => setViewWithRoute('evenements')}
        />
      )}
      {view === 'inscription-michoui' && (
        <EventRegistrationPage
          title="Inscription au michoui de Touvre"
          onBack={() => setViewWithRoute('evenements')}
        />
      )}
      {view === 'admin-login' && (
        <AdminLoginPage
          onSuccess={handleAdminLogin}
          onBack={() => setViewWithRoute('home')}
        />
      )}
      {view === 'admin' && (
        <AdminDashboard
          onLogout={handleAdminLogout}
          michoui={michouiRegistrations}
          videGrenier={videGrenierRegistrations}
        />
      )}
    </div>
  )
}

export default App
