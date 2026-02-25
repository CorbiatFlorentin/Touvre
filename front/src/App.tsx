import { useCallback, useEffect, useMemo, useState, type FormEvent } from 'react'
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

const API_BASE =
  import.meta.env.VITE_API_URL?.toString() || 'http://localhost:3001'

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
  eventType,
}: {
  title: string
  onBack: () => void
  eventType: 'MICHOUI' | 'VIDE_GRENIER'
}) {
  const [nom, setNom] = useState('')
  const [email, setEmail] = useState('')
  const [accompte, setAccompte] = useState(false)
  const [montant, setMontant] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>(
    'idle'
  )
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (!accompte) {
      setMontant('')
    }
  }, [accompte])

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setStatus('loading')
      setErrorMessage('')

      try {
        const response = await fetch(`${API_BASE}/api/inscriptions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nom,
            email,
            event: eventType,
            accompteVerser: accompte,
            accompteMontant: accompte ? montant : null,
          }),
        })

        if (!response.ok) {
          setStatus('error')
          setErrorMessage(
            "Impossible d'envoyer l'inscription. Verifiez les champs."
          )
          return
        }

        setStatus('success')
        setNom('')
        setEmail('')
        setAccompte(false)
        setMontant('')
      } catch (error) {
        setStatus('error')
        setErrorMessage("Erreur reseau. Verifiez que l'API est demarree.")
      }
    },
    [accompte, email, eventType, montant, nom]
  )

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

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Nom complet
            <input
              type="text"
              className="rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
              placeholder="Votre nom"
              value={nom}
              onChange={(event) => setNom(event.target.value)}
              required
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Email
            <input
              type="email"
              className="rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
              placeholder="votre@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
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
                required={accompte}
              />
            </label>
          )}
          {status === 'success' && (
            <p className="text-sm text-emerald-300">
              Inscription envoyee. Merci.
            </p>
          )}
          {status === 'error' && (
            <p className="text-sm text-rose-300">{errorMessage}</p>
          )}
          <button
            type="submit"
            className="rounded-xl border border-slate-200/40 bg-slate-100 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white"
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Envoi en cours...' : "Envoyer l'inscription"}
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
  onSuccess: (token: string) => void
  onBack: () => void
}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      setStatus('loading')
      setErrorMessage('')

      try {
        const response = await fetch(`${API_BASE}/api/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        })

        if (!response.ok) {
          setStatus('error')
          setErrorMessage('Identifiants invalides.')
          return
        }

        const data = await response.json()
        if (!data?.token) {
          setStatus('error')
          setErrorMessage('Connexion impossible.')
          return
        }

        setStatus('idle')
        onSuccess(data.token)
      } catch (error) {
        setStatus('error')
        setErrorMessage("Erreur reseau. Verifiez que l'API est demarree.")
      }
    },
    [email, onSuccess, password]
  )

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

        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
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
            disabled={status === 'loading'}
          >
            {status === 'loading' ? 'Connexion...' : 'Se connecter'}
          </button>
          {status === 'error' && (
            <p className="text-sm text-rose-300">{errorMessage}</p>
          )}
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
  const [token, setToken] = useState<string | null>(() => {
    if (typeof window === 'undefined') {
      return null
    }
    return localStorage.getItem('admin_token')
  })
  const [isAdminAuthed, setIsAdminAuthed] = useState(Boolean(token))
  const [michouiRegistrations, setMichouiRegistrations] = useState<
    Registration[]
  >([])
  const [videGrenierRegistrations, setVideGrenierRegistrations] = useState<
    Registration[]
  >([])

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

  useEffect(() => {
    setIsAdminAuthed(Boolean(token))
  }, [token])

  const fetchRegistrations = useCallback(async (authToken: string) => {
    const [michouiResponse, videGrenierResponse] = await Promise.all([
      fetch(`${API_BASE}/api/inscriptions?event=MICHOUI`, {
        headers: { Authorization: `Bearer ${authToken}` },
      }),
      fetch(`${API_BASE}/api/inscriptions?event=VIDE_GRENIER`, {
        headers: { Authorization: `Bearer ${authToken}` },
      }),
    ])

    if (!michouiResponse.ok || !videGrenierResponse.ok) {
      return
    }

    const [michouiData, videGrenierData] = await Promise.all([
      michouiResponse.json(),
      videGrenierResponse.json(),
    ])
    setMichouiRegistrations(michouiData)
    setVideGrenierRegistrations(videGrenierData)
  }, [])

  useEffect(() => {
    if (view === 'admin' && token) {
      fetchRegistrations(token)
    }
  }, [fetchRegistrations, token, view])

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

  const handleAdminLoginWithToken = useCallback(
    (authToken: string) => {
      setToken(authToken)
      localStorage.setItem('admin_token', authToken)
      setIsAdminAuthed(true)
      setViewWithRoute('admin')
    },
    [setViewWithRoute]
  )

  const handleAdminLogout = useCallback(() => {
    setIsAdminAuthed(false)
    setToken(null)
    localStorage.removeItem('admin_token')
    setMichouiRegistrations([])
    setVideGrenierRegistrations([])
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
          eventType="VIDE_GRENIER"
        />
      )}
      {view === 'inscription-michoui' && (
        <EventRegistrationPage
          title="Inscription au michoui de Touvre"
          onBack={() => setViewWithRoute('evenements')}
          eventType="MICHOUI"
        />
      )}
      {view === 'admin-login' && (
        <AdminLoginPage
          onSuccess={handleAdminLoginWithToken}
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
