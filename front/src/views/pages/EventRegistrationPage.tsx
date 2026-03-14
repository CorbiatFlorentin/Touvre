import { Fragment } from 'react'
import type { EventType, MechouiTarif } from '../../models/app'
import { useEventRegistrationController } from '../../controllers/useEventRegistrationController'

type EventRegistrationPageProps = {
  title: string
  onBack: () => void
  eventType: EventType
}

function EventRegistrationPage({
  title,
  onBack,
  eventType,
}: EventRegistrationPageProps) {
  const {
    isMechoui,
    nom,
    setNom,
    email,
    setEmail,
    phone,
    setPhone,
    accompte,
    setAccompte,
    montant,
    setMontant,
    participants,
    updateParticipant,
    addParticipant,
    removeParticipant,
    status,
    errorMessage,
    handleSubmit,
  } = useEventRegistrationController(eventType)

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
          {isMechoui ? (
            <div className="rounded-2xl border border-slate-300/20 bg-slate-950/40 p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-slate-100">
                    Table Mechoui
                  </p>
                  <p className="mt-1 text-xs text-slate-300/70">
                    Ajoutez une ligne par personne inscrite.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={addParticipant}
                  className="rounded-lg border border-slate-200/40 px-3 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-100 hover:text-slate-900"
                >
                  +
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[520px] table-fixed text-left text-sm text-slate-100">
                  <thead className="text-xs uppercase tracking-[0.2em] text-slate-300">
                    <tr>
                      <th className="pb-3">Nom</th>
                      <th className="pb-3">Prenom</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-300/10">
                    {participants.map((participant, index) => (
                      <Fragment key={`participant-${index}`}>
                        <tr key={`participant-${index}-main`}>
                          <td className="py-3 pr-3 align-top">
                            <input
                              type="text"
                              className="w-full rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
                              placeholder="Nom"
                              value={participant.nom}
                              onChange={(event) =>
                                updateParticipant(index, 'nom', event.target.value)
                              }
                              required
                            />
                          </td>
                          <td className="py-3 pr-3 align-top">
                            <input
                              type="text"
                              className="w-full rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
                              placeholder="Prenom"
                              value={participant.prenom}
                              onChange={(event) =>
                                updateParticipant(
                                  index,
                                  'prenom',
                                  event.target.value
                                )
                              }
                              required
                            />
                          </td>
                          <td className="py-3 text-right align-top">
                            <button
                              type="button"
                              onClick={() => removeParticipant(index)}
                              disabled={participants.length === 1}
                              className="rounded-lg border border-rose-300/30 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
                            >
                              Supprimer
                            </button>
                          </td>
                        </tr>
                        <tr key={`participant-${index}-tarif`}>
                          <td className="pb-4" colSpan={3}>
                            <label className="flex flex-col gap-2 text-sm text-slate-200">
                              Tarif
                              <select
                                className="rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
                                value={participant.tarif}
                                onChange={(event) =>
                                  updateParticipant(
                                    index,
                                    'tarif',
                                    event.target.value as MechouiTarif
                                  )
                                }
                              >
                                <option value="ADULTE">Adulte</option>
                                <option value="ENFANT_MOINS_12">
                                  Enfant de moins de 12 ans
                                </option>
                                <option value="ENFANT_MOINS_3">
                                  Enfant de moins de 3 ans (gratuit)
                                </option>
                              </select>
                            </label>
                          </td>
                        </tr>
                      </Fragment>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
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
          )}
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
          <label className="flex flex-col gap-2 text-sm text-slate-200">
            Telephone
            <input
              type="tel"
              inputMode="numeric"
              className="rounded-xl border border-slate-300/20 bg-slate-950/70 px-4 py-3 text-slate-50 outline-none transition focus:border-slate-200/60"
              placeholder="0600000000"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </label>
          <label className="flex items-center gap-3 text-sm text-slate-200">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border border-slate-300/40 bg-slate-950/70"
              checked={accompte}
              onChange={(event) => {
                const checked = event.target.checked
                setAccompte(checked)
                if (!checked) {
                  setMontant('')
                }
              }}
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
            <p className="text-sm text-emerald-300">Inscription envoyee. Merci.</p>
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

export default EventRegistrationPage
