import Footer from './views/components/Footer'
import Header from './views/components/Header'
import MainSections from './views/components/MainSections'
import { useAppController } from './controllers/useAppController'
import AdminDashboardPage from './views/pages/AdminDashboardPage'
import AdminAssociationPage from './views/pages/AdminAssociationPage'
import AdminLoginPage from './views/pages/AdminLoginPage'
import AdminNewsletterPage from './views/pages/AdminNewsletterPage'
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
    adminToken,
    newsletters,
    refreshNewsletters,
  } = useAppController()

  return (
    <div className="min-h-screen text-slate-50">
      <Header onNavigate={handleNavigate} />
      {view === 'home' && (
        <>
          <MainSections newsletters={newsletters} />
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
          title="Inscription au Méchoui de Touvre"
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
          onNavigateNewsletter={() => setViewWithRoute('admin-newsletter')}
          onNavigateAssociation={() => setViewWithRoute('admin-association')}
          mechoui={mechouiRegistrations}
          videGrenier={videGrenierRegistrations}
          onSave={handleSaveRegistration}
          onDelete={handleDeleteRegistration}
          pendingIds={pendingIds}
          errorMessage={adminErrorMessage}
        />
      )}
      {view === 'admin-newsletter' && (
        <AdminNewsletterPage
          onLogout={handleAdminLogout}
          onBack={() => setViewWithRoute('admin')}
          token={adminToken}
          onPublished={refreshNewsletters}
        />
      )}
      {view === 'admin-association' && (
        <AdminAssociationPage
          onLogout={handleAdminLogout}
          onBack={() => setViewWithRoute('admin')}
          token={adminToken}
        />
      )}
    </div>
  )
}

export default App
