import { useAdminLoginController } from '../../controllers/useAdminLoginController'

type AdminLoginPageProps = {
  onSuccess: (token: string) => void
  onBack: () => void
}

function AdminLoginPage({ onSuccess, onBack }: AdminLoginPageProps) {
  const {
    email,
    setEmail,
    password,
    setPassword,
    status,
    errorMessage,
    handleSubmit,
  } = useAdminLoginController(onSuccess)

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

export default AdminLoginPage
