import Footer from './views/components/Footer'
import Header from './views/components/Header'
import MainSections from './views/components/MainSections'
import { useAppController } from './controllers/useAppController'
import AdminDashboardPage from './views/pages/AdminDashboardPage'
import AdminLoginPage from './views/pages/AdminLoginPage'
import AssociationPage from './views/pages/AssociationPage'
import EventRegistrationPage from './views/pages/EventRegistrationPage'
import EventsPage from './views/pages/EventsPage'

function App() {
  const {
    view,
    handleNavigate,
    setViewWithRoute,
    handleAdminLoginWithToken,
    handleAdminLogout,
    mechouiRegistrations,
    videGrenierRegistrations,
    handleSaveRegistration,
    handleDeleteRegistration,
    pendingIds,
    adminErrorMessage,
  } = useAppController()

  return (
    <div className="min-h-screen text-slate-50">
      <Header onNavigate={handleNavigate} />
      {view === 'home' && (
        <>
          <MainSections />
          <Footer />
        </>
      )}
      {view === 'association' && <AssociationPage />}
      {view === 'evenements' && <EventsPage onNavigate={handleNavigate} />}
      {view === 'inscription-vide-grenier' && (
        <EventRegistrationPage
          title="Inscription au vide grenier de Touvre"
          onBack={() => setViewWithRoute('evenements')}
          eventType="VIDE_GRENIER"
        />
      )}
      {view === 'inscription-mechoui' && (
        <EventRegistrationPage
          title="Inscription au mechoui de Touvre"
          onBack={() => setViewWithRoute('evenements')}
          eventType="MICHOUI"
        />
      )}
      {view === 'admin-login' && (
        <AdminLoginPage
          onSuccess={handleAdminLoginWithToken}
          onBack={() => setViewWithRoute('home')}
        />
      )}
      {view === 'admin' && (
        <AdminDashboardPage
          onLogout={handleAdminLogout}
          mechoui={mechouiRegistrations}
          videGrenier={videGrenierRegistrations}
          onSave={handleSaveRegistration}
          onDelete={handleDeleteRegistration}
          pendingIds={pendingIds}
          errorMessage={adminErrorMessage}
        />
      )}
    </div>
  )
}

export default App
