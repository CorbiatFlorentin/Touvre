import Logo from './Logo'

function MainSections() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-12 pt-12">
      <section id="newsletter" className="mb-10">
        <div className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Newsletter
          </p>
          <h2 className="mt-4 font-display text-3xl text-slate-50">
            Recevez les actualités du comité.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
            Inscription prochainement disponible. Nous partagerons les dates
            clés, les événements et les projets en cours.
          </p>
        </div>
      </section>

      <section id="contact" className="mb-12">
        <div className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Contact
          </p>
          <h2 className="mt-4 font-display text-3xl text-slate-50">
            Parlons de vos besoins.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
            Vous pouvez écrire au comité pour toute question ou collaboration.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
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
        <div className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Palette
          </p>
          <h2 className="mt-4 font-display text-3xl text-slate-50">
            Profondeur douce, contraste maîtrisé.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
            Dégradés bleutés, typographie expressive et reflets discrets pour un
            rendu moderne sans surcharge.
          </p>
        </div>
      </section>

      <section className="mt-10 grid gap-6 lg:grid-cols-[1.2fr,0.8fr]">
        <div className="overflow-hidden rounded-3xl border border-slate-300/20 bg-slate-900/70 shadow-panel backdrop-blur">
          <img src="/IMG_1806.jpeg" alt="Image 1806" />
        </div>
        <div className="flex flex-col justify-between rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
              Logo
            </p>
            <h3 className="mt-4 font-display text-3xl text-slate-50">
              IMG 1812 en repère graphique.
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
              Positionné en haut à gauche pour un repère direct, il peut devenir
              un bouton ou un lien vers l&apos;accueil.
            </p>
          </div>
          <Logo className="mt-8 h-24 w-24 rounded-full border border-white/30 object-cover" />
        </div>
      </section>
    </main>
  )
}

export default MainSections
