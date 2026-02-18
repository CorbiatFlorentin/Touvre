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
      <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col px-6 pb-20 pt-8">
        <nav className="flex items-start justify-between">
          <Logo className="h-28 w-28 rounded-full border border-white/40 object-cover shadow-lg sm:h-36 sm:w-36" />
          <div className="text-xs uppercase tracking-[0.45em] text-slate-200/80">
            Touvre
          </div>
        </nav>

        <div className="mt-auto max-w-2xl pb-6">
          <h1 className="animate-reveal [animation-delay:150ms] mt-4 font-display text-4xl leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
            Bienvenue sur le site du comitÃ© de jumelage de Touvre. Nous sommes ravis de vous accueillir.
          </h1>
        </div>
      </div>
    </header>
  )
}

export default Header


