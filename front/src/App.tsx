import { useCallback, useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import MainSections from './components/MainSections'

function App() {
  const [view, setView] = useState<'home' | 'association' | 'evenements'>(
    'home',
  )

  const handleNavigate = useCallback((target: string) => {
    if (target === 'association') {
      setView('association')
      return
    }
    if (target === 'evenements') {
      setView('evenements')
      return
    }

    setView('home')
    requestAnimationFrame(() => {
      const section = document.getElementById(target)
      section?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }, [])

  return (
    <div className="min-h-screen text-slate-50">
      <Header onNavigate={handleNavigate} />
      {view === 'home' ? (
        <>
          <MainSections />
          <Footer />
        </>
      ) : (
        <main className="mx-auto flex min-h-[40vh] w-full max-w-6xl items-center justify-center px-6 pb-20 pt-20">
          <div className="rounded-3xl border border-slate-300/20 bg-slate-900/70 p-10 text-center shadow-panel backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-slate-300/70">
              {view === 'association' ? 'Association' : 'Événements'}
            </p>
            <h2 className="mt-4 font-display text-3xl text-slate-50">
              Page en préparation.
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-slate-200/80">
              Ce contenu sera ajouté prochainement.
            </p>
          </div>
        </main>
      )}
    </div>
  )
}

export default App
