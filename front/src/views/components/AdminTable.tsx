import { useCallback, useState } from 'react'
import type {
  Registration,
  RegistrationUpdatePayload,
} from '../../models/app'

type AdminTableProps = {
  title: string
  entries: Registration[]
  formatAmount: (amount: number | null) => string
  onSave: (id: number, payload: RegistrationUpdatePayload) => Promise<void>
  onDelete: (id: number) => Promise<void>
  pendingIds: number[]
  tableError: string
}

function AdminTable({
  title,
  entries,
  formatAmount,
  onSave,
  onDelete,
  pendingIds,
  tableError,
}: AdminTableProps) {
  const [editingId, setEditingId] = useState<number | null>(null)
  const [draft, setDraft] = useState<RegistrationUpdatePayload | null>(null)

  const isPending = useCallback(
    (id: number) => pendingIds.includes(id),
    [pendingIds]
  )

  const startEdit = useCallback((entry: Registration) => {
    setEditingId(entry.id)
    setDraft({
      nom: entry.nom,
      email: entry.email,
      phoneNumber: entry.phoneNumber || '',
      event: entry.event,
      accompteVerser: entry.accompteVerser,
      accompteMontant: entry.accompteMontant,
    })
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
    setDraft(null)
  }, [])

  const saveEdit = useCallback(
    async (id: number) => {
      if (!draft) {
        return
      }

      await onSave(id, {
        ...draft,
        phoneNumber: draft.phoneNumber ? draft.phoneNumber : null,
        accompteMontant: draft.accompteVerser
          ? Number(draft.accompteMontant || 0)
          : null,
      })
      cancelEdit()
    },
    [cancelEdit, draft, onSave]
  )

  return (
    <section className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-6 shadow-panel backdrop-blur">
      <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
        Tableau
      </p>
      <h3 className="mt-3 font-display text-2xl text-slate-50">{title}</h3>
      <div className="mt-6">
        <table className="w-full table-fixed text-left text-sm text-slate-100">
          <thead className="text-xs uppercase tracking-[0.2em] text-slate-300">
            <tr>
              <th className="pb-3">Nom</th>
              <th className="pb-3">Email</th>
              <th className="pb-3">Telephone</th>
              <th className="pb-3">Accompte</th>
              <th className="pb-3">Montant</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-300/10">
            {entries.length === 0 && (
              <tr>
                <td className="py-4 text-slate-300/80" colSpan={7}>
                  Aucun inscrit pour le moment.
                </td>
              </tr>
            )}
            {entries.map((entry) => (
              <tr key={`${title}-${entry.id}`}>
                <td className="py-3 break-words font-medium text-slate-50">
                  {editingId === entry.id && draft ? (
                    <input
                      type="text"
                      value={draft.nom}
                      onChange={(event) =>
                        setDraft({ ...draft, nom: event.target.value })
                      }
                      className="w-full rounded-md border border-slate-300/20 bg-slate-950/70 px-2 py-1 text-slate-50 outline-none"
                    />
                  ) : (
                    entry.nom
                  )}
                </td>
                <td className="py-3 break-words text-slate-200/80">
                  {editingId === entry.id && draft ? (
                    <input
                      type="email"
                      value={draft.email}
                      onChange={(event) =>
                        setDraft({ ...draft, email: event.target.value })
                      }
                      className="w-full rounded-md border border-slate-300/20 bg-slate-950/70 px-2 py-1 text-slate-50 outline-none"
                    />
                  ) : (
                    entry.email
                  )}
                </td>
                <td className="py-3 break-words text-slate-200/80">
                  {editingId === entry.id && draft ? (
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={draft.phoneNumber || ''}
                      onChange={(event) =>
                        setDraft({ ...draft, phoneNumber: event.target.value })
                      }
                      className="w-full rounded-md border border-slate-300/20 bg-slate-950/70 px-2 py-1 text-slate-50 outline-none"
                    />
                  ) : (
                    entry.phoneNumber || '-'
                  )}
                </td>
                <td className="py-3">
                  {editingId === entry.id && draft ? (
                    <input
                      type="checkbox"
                      checked={draft.accompteVerser}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          accompteVerser: event.target.checked,
                          accompteMontant: event.target.checked
                            ? draft.accompteMontant
                            : null,
                        })
                      }
                    />
                  ) : entry.accompteVerser ? (
                    'Oui'
                  ) : (
                    'Non'
                  )}
                </td>
                <td className="py-3">
                  {editingId === entry.id && draft ? (
                    <input
                      type="number"
                      inputMode="numeric"
                      min="0"
                      value={draft.accompteMontant ?? ''}
                      disabled={!draft.accompteVerser}
                      onChange={(event) =>
                        setDraft({
                          ...draft,
                          accompteMontant: event.target.value
                            ? Number(event.target.value)
                            : null,
                        })
                      }
                      className="w-24 rounded-md border border-slate-300/20 bg-slate-950/70 px-2 py-1 text-slate-50 outline-none disabled:opacity-50"
                    />
                  ) : (
                    formatAmount(entry.accompteMontant)
                  )}
                </td>
                <td className="py-3 break-words text-slate-200/80">
                  {entry.createdAt}
                </td>
                <td className="py-3">
                  {editingId === entry.id ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => saveEdit(entry.id)}
                        disabled={isPending(entry.id)}
                        className="rounded-md border border-emerald-300/30 px-2 py-1 text-xs text-emerald-200 disabled:opacity-50"
                      >
                        Enregistrer
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        disabled={isPending(entry.id)}
                        className="rounded-md border border-slate-300/30 px-2 py-1 text-xs text-slate-200 disabled:opacity-50"
                      >
                        Annuler
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEdit(entry)}
                        disabled={isPending(entry.id)}
                        className="rounded-md border border-slate-300/30 px-2 py-1 text-xs text-slate-200 disabled:opacity-50"
                      >
                        Modifier
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(entry.id)}
                        disabled={isPending(entry.id)}
                        className="rounded-md border border-rose-300/30 px-2 py-1 text-xs text-rose-200 disabled:opacity-50"
                      >
                        Supprimer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tableError && <p className="mt-4 text-sm text-rose-300">{tableError}</p>}
    </section>
  )
}

export default AdminTable
