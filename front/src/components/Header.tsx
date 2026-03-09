import Logo from './Logo'
import Menu from './Menu'

type HeaderProps = {
  onNavigate: (target: string) => void
}

function Header({ onNavigate }: HeaderProps) {
  return (
    <header className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-hero bg-cover bg-center [filter:saturate(1.05)_contrast(1.08)] [transform:rotate(360deg)_scale(1.12)]"
        aria-hidden="true"
      />
      <Menu onNavigate={onNavigate} />
      <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col px-6 pb-20 pt-16 sm:pt-8">
        <nav className="flex items-start justify-between gap-6">
          <Logo className="-ml-12 h-28 w-28 rounded-full border border-white/40 object-cover shadow-lg sm:-ml-20 sm:h-36 sm:w-36" />
          <div className="-mr-14 flex flex-col items-end gap-3 rounded-2xl border border-white/20 bg-slate-950/45 px-4 py-3 backdrop-blur-md sm:-mr50 lg:-mr-40">
            <button
              type="button"
              onClick={() => onNavigate('admin-login')}
              className="rounded-full border border-white/40 bg-white/15 px-4 py-2 text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-white transition hover:bg-white/30"
            >
              Connexion admin
            </button>
          </div>
        </nav>

        <div className="mt-auto max-w-2xl rounded-2xl border border-white/15 bg-slate-950/50 p-5 pb-6 backdrop-blur-md">
          <h1 className="animate-reveal [animation-delay:150ms] mt-4 font-display text-4xl leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
            Bienvenue sur le site du comité des fêtes de Touvre. Nous sommes ravis de vous accueillir.
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header



