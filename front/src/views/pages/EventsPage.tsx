type EventsPageProps = {
  onNavigate: (target: string) => void
}

function EventsPage({ onNavigate }: EventsPageProps) {
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
            Mechoui de Touvre
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
            Rejoignez la liste des participants pour le repas convivial.
          </p>
          <button
            type="button"
            className="mt-6 rounded-xl border border-slate-200/40 bg-slate-100 px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white"
            onClick={() => onNavigate('inscription-mechoui')}
          >
            S'inscrire
          </button>
        </article>
      </div>
    </main>
  )
}

export default EventsPage
