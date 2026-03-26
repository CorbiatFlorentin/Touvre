import type { Newsletter } from '../../models/app'
import ContactForm from './ContactForm'

type MainSectionsProps = {
  newsletters: Newsletter[]
}

function MainSections({ newsletters }: MainSectionsProps) {
  return (
    <main className="mx-auto w-full max-w-6xl px-6 pb-12 pt-12">
      <section id="newsletter" className="mb-10">
        <div className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-8 shadow-panel backdrop-blur">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Newsletter
          </p>
          <h2 className="mt-4 font-display text-3xl text-slate-50">
            Les dernieres publications du comite.
          </h2>
          {newsletters.length === 0 ? (
            <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
              Les newsletters publiees depuis l'espace admin s'afficheront ici.
            </p>
          ) : (
            <div className="mt-8 grid gap-6">
              {newsletters.map((item) => (
                <article
                  key={item.id}
                  className="rounded-2xl border border-slate-200/10 bg-slate-950/50 p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-2xl text-slate-50">
                      {item.title}
                    </h3>
                    <span className="text-xs uppercase tracking-[0.25em] text-slate-300/70">
                      {new Date(item.publishedAt).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-200/85">
                    {item.content}
                  </p>
                  <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                    {item.images.map((image, index) => (
                      <img
                        key={`${item.id}-${index}`}
                        src={image}
                        alt={`${item.title} ${index + 1}`}
                        className="h-64 w-full rounded-2xl object-cover"
                      />
                    ))}
                  </div>
                </article>
              ))}
            </div>
          )}
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
