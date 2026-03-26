import { useCallback, useMemo } from 'react'
import type { Registration, RegistrationUpdatePayload } from '../../models/app'
import AdminTable from '../components/AdminTable'

type AdminDashboardPageProps = {
  onLogout: () => void
  onNavigateNewsletter: () => void
  onNavigateAssociation: () => void
  mechoui: Registration[]
  videGrenier: Registration[]
  onSave: (id: number, payload: RegistrationUpdatePayload) => Promise<void>
  onDelete: (id: number) => Promise<void>
  pendingIds: number[]
  errorMessage: string
}

function AdminDashboardPage({
  onLogout,
  onNavigateNewsletter,
  onNavigateAssociation,
  mechoui,
  videGrenier,
  onSave,
  onDelete,
  pendingIds,
  errorMessage,
}: AdminDashboardPageProps) {
  const amountFormatter = useMemo(() => new Intl.NumberFormat('fr-FR'), [])

  const formatAmount = useCallback(
    (amount: number | null) => {
      if (amount === null) {
        return '-'
      }
      return `${amountFormatter.format(amount)} EUR`
    },
    [amountFormatter]
  )

  return (
    <main className="mx-auto w-full max-w-[1500px] px-6 pb-20 pt-20">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
            Admin
          </p>
          <h2 className="mt-3 font-display text-3xl text-slate-50">
            Tableau de bord des inscriptions
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onNavigateNewsletter}
            className="rounded-xl border border-slate-200/40 bg-slate-100 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white"
          >
            Publier une newsletter
          </button>
          <button
            type="button"
            onClick={onNavigateAssociation}
            className="rounded-xl border border-slate-200/40 bg-slate-100 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-900 transition hover:bg-white"
          >
            Editer l'association
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="rounded-xl border border-slate-200/40 bg-transparent px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-slate-100 transition hover:bg-slate-100 hover:text-slate-900"
          >
            Se deconnecter
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <AdminTable
          title="Mechoui"
          entries={mechoui}
          formatAmount={formatAmount}
          onSave={onSave}
          onDelete={onDelete}
          pendingIds={pendingIds}
          tableError={errorMessage}
        />
        <AdminTable
          title="Vide grenier"
          entries={videGrenier}
          formatAmount={formatAmount}
          onSave={onSave}
          onDelete={onDelete}
          pendingIds={pendingIds}
          tableError={errorMessage}
        />
      </div>
    </main>
  )
}

export default AdminDashboardPage
