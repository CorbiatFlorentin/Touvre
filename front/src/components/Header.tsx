import Logo from './Logo'
import Menu from './Menu'

function Header() {
  return (
    <header className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-hero bg-cover bg-center [filter:saturate(1.05)_contrast(1.08)] [transform:rotate(360deg)_scale(1.12)]"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-hero-overlay"
        aria-hidden="true"
      />
      <Menu />
      <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col px-6 pb-20 pt-8">
        <nav className="flex items-start justify-between">
          <Logo className="h-28 w-28 rounded-full border border-white/40 object-cover shadow-lg sm:h-36 sm:w-36" />
          <div className="text-xs uppercase tracking-[0.45em] text-slate-200/80">
            Touvre
          </div>
        </nav>

        <div className="mt-auto max-w-2xl pb-6">
          <p className="animate-reveal text-[11px] uppercase tracking-[0.35em] text-slate-200/70">
            Site en construction
          </p>
          <h1 className="animate-reveal [animation-delay:150ms] mt-4 font-display text-4xl leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
            Un lieu visuel, simple, guidé par la lumière.
          </h1>
          <p className="animate-reveal [animation-delay:200ms] mt-6 max-w-xl text-base text-slate-200/90 sm:text-lg">
            Le header utilise l&apos;image 1806 avec une rotation complète. Le
            logo IMG 1812 reste en haut à gauche, clair et épuré.
          </p>
        </div>
      </div>
    </header>
  )
}

export default Header
