function App() {
  return (
    <div className="min-h-screen text-slate-50">
      <header className="hero relative overflow-hidden">
        <div className="hero-bg absolute inset-0" aria-hidden="true" />
        <div className="hero-overlay absolute inset-0" aria-hidden="true" />
        <div className="absolute left-0 right-0 top-0 z-20">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-center px-6 pt-6">
            <ul className="flex gap-8 text-[11px] uppercase tracking-[0.35em] text-slate-200/80">
              <li>
                <a className="transition hover:text-slate-50" href="#newsletter">
                  Newsletter.
                </a>
              </li>
              <li>
                <a className="transition hover:text-slate-50" href="#evenements">
                  Evenements
                </a>
              </li>
              <li>
                <a className="transition hover:text-slate-50" href="#contact">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="relative z-10 mx-auto flex min-h-[70vh] w-full max-w-6xl flex-col px-6 pb-20 pt-8">
          <nav className="flex items-start justify-between">
            <img
              className="h-28 w-28 rounded-full border border-white/40 object-cover shadow-lg sm:h-36 sm:w-36"
              src="/IMG_1812.jpeg"
              alt="Logo IMG 1812"
            />
            <div className="text-xs uppercase tracking-[0.45em] text-slate-200/80">
              Touvre
            </div>
          </nav>

          <div className="mt-auto max-w-2xl pb-6">
            <p className="reveal text-[11px] uppercase tracking-[0.35em] text-slate-200/70">
              Site en construction
            </p>
            <h1 className="reveal reveal-delay mt-4 font-display text-4xl leading-tight text-slate-50 sm:text-5xl lg:text-6xl">
              Un lieu visuel, simple, guidé par la lumière.
            </h1>
            <p className="reveal reveal-delay mt-6 max-w-xl text-base text-slate-200/90 sm:text-lg">
              Le header utilise l&apos;image 1806, retournée horizontalement pour un
              effet miroir. Le logo IMG 1812 reste en haut à droite, clair et
              épuré.
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pb-20 pt-12">
        <section className="grid gap-6 md:grid-cols-2">
          <div className="panel rounded-3xl p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
              Intention
            </p>
            <h2 className="mt-4 font-display text-3xl text-slate-50">
              Une base sobre et élégante.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
              Cette structure est prête à recevoir du contenu : sections, textes,
              galeries ou liens. Le style reste léger et laisse respirer les
              images.
            </p>
          </div>
          <div className="panel rounded-3xl p-8">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
              Palette
            </p>
            <h2 className="mt-4 font-display text-3xl text-slate-50">
              Profondeur douce, contraste maîtrisé.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
              Dégradés bleutés, typographie expressive et reflets discrets pour
              un rendu moderne sans surcharge.
            </p>
          </div>
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
          <div className="panel overflow-hidden rounded-3xl">
            <img src="/IMG_1806.jpeg" alt="Image 1806" />
          </div>
          <div className="panel flex flex-col justify-between rounded-3xl p-8">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
                Logo
              </p>
              <h3 className="mt-4 font-display text-3xl text-slate-50">
                IMG 1812 en repère graphique.
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
                Positionné en haut à droite pour un repère direct, il peut
                devenir un bouton ou un lien vers l&apos;accueil.
              </p>
            </div>
            <img
              className="mt-8 h-24 w-24 rounded-full border border-white/30 object-cover"
              src="/IMG_1812.jpeg"
              alt="Logo IMG 1812"
            />
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
