import ContactForm from './ContactForm'

function MainSections() {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-12 pt-12">
      <section id="newsletter" className="mb-10">
        <div className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Newsletter
          </p>
          <h2 className="mt-4 font-display text-3xl text-slate-50">
            Recevez les actualites du comite.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
            Dernieres nouvelles, evenements a venir, et plus encore.
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
            Vous pouvez ecrire au comite pour toute question ou collaboration.
          </p>
          <ContactForm />
        </div>
      </section>
    </main>
  )
}

export default MainSections
