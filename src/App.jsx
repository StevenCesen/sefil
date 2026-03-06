import { Navigate, Route, Routes } from 'react-router-dom'
import useSessions from './hooks/useSessions'
import Login from './pages/Login'
import Header from './components/Header/Header'
import NavSlide from './components/navSlide/NavSlide'
import { useEffect, useState } from 'react'
import "./index.css";
import Me from './pages/Me/Me'
import Push from './components/Push/Push'
import CardSelectStateCall from './components/Management/CardSelectStateCall/CardSelectStateCall'
import CardStructure from './components/CardStructure/CardStructure'
import CardEditAgreement from './components/CardEditAgreement/CardEditAgreement'
import CardCondonacion from './components/CardCondonacion/CardCondonacion'
import Loader from './components/Loader/loader'
import Home from './pages/Home/Home'
import Usuarios from './pages/Users/Users'
import Credits from './pages/Credits/Credits'
import Credit from './pages/Credit/Credit'
import Payments from './pages/Payments/Payments'
import Campain from './pages/Campains/Campains'
import Consult from './pages/Consult/Consult'
import Gestion from './pages/Management/Management'
import Historial from './pages/ManagementHistorial/ManagementHistorial'
import Contacts from './pages/Contacts/Contacts'
import Templates from './pages/Templates/Templates'
import Monitor from './pages/Monitor/Monitor'
import Directions from './pages/Directions/Directions'
import Businesses from './pages/Businesses/Businesses'
import ImportPayments from './pages/ImportPayments/ImportPayments'
import AccountingPayments from './pages/Reports/AccountingPayments/AccountingPayments'
import CampaignAssignment from './pages/Reports/CampaignAssignment/CampaignAssignment'
import ReportPaymentsWithManagement from './pages/Reports/ReportPaymentsWithManagement/ReportPaymentsWithManagement'
import Geogestion from './pages/geogestion/Geogestion';
import FieldTrip from './pages/fieldTrip/FieldTrip';
import PagosEfectivo from './pages/PagosEfectivo';
import ReportCobranza from './pages/ReportCobranza';
import ReportCondonations from './pages/ReportCondonations';
import ReportJudicial from './pages/ReportJudicial';

function ProtectedRoute({ children }) {
  const isAuthenticated = useSessions();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="Dashboard">
      <NavSlide />
      <div className="Dashboard__content">
        {children}
      </div>
    </div>
  );
}

function getDefaultRoute() {
  const userRole = localStorage.getItem('role');
  if (userRole === 'admin' || userRole === 'superadmin' || userRole === 'supervisor') {
    return '/dashboard';
  } else {
    // Roles: campo, call, legal -> redirigir a management
    return '/dashboard/management';
  }
}

function PublicRoute({ children }) {
  const isAuthenticated = useSessions();

  if (isAuthenticated) {
    return <Navigate to={getDefaultRoute()} replace />;
  }

  return children;
}

function RootRedirect() {
  const isAuthenticated = useSessions();

  if (isAuthenticated) {
    return <Navigate to={getDefaultRoute()} replace />;
  }

  return <Navigate to="/login" replace />;
}

function App() {

  const [session, setSession] = useState({});

  useEffect(() => {
    setSession({
      state: true
    });
  }, []);

  if (!session.state) return <Loader />;

  return (
    <>
      <Header />
      <Push />
      <CardSelectStateCall />
      <CardStructure />      <CardEditAgreement/>      <CardCondonacion />
      <Loader />

      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/me"
          element={
            <ProtectedRoute>
              <Me />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/credits"
          element={
            <ProtectedRoute>
              <Credits />
            </ProtectedRoute>
          }
        />

        <Route
          path="/credits/:id"
          element={
            <ProtectedRoute>
              <Credit />
            </ProtectedRoute>
          }
        />

        <Route
          path="/credits/payments/:id"
          element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          }
        />

        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <Usuarios />
            </ProtectedRoute>
          }
        />

        <Route
          path="/campains"
          element={
            <ProtectedRoute>
              <Campain/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/consult"
          element={
            <ProtectedRoute>
              <Consult/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/contacts-consult"
          element={
            <ProtectedRoute>
              <Contacts/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/management"
          element={
            <ProtectedRoute>
              <Gestion/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/managements-historial"
          element={
            <ProtectedRoute>
              <Historial/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/templates"
          element={
            <ProtectedRoute>
              <Templates/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/monitor"
          element={
            <ProtectedRoute>
              <Monitor/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/directions"
          element={
            <ProtectedRoute>
              <Directions/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/businesses"
          element={
            <ProtectedRoute>
              <Businesses/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/import-payments"
          element={
            <ProtectedRoute>
              <ImportPayments/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/cash-payments"
          element={
            <ProtectedRoute>
              <PagosEfectivo/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/collection-expenses-billing"
          element={
            <ProtectedRoute>
              <ReportCobranza/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/condonations"
          element={
            <ProtectedRoute>
              <ReportCondonations/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/judicial-expenses"
          element={
            <ProtectedRoute>
              <ReportJudicial/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/accounting-payments"
          element={
            <ProtectedRoute>
              <AccountingPayments/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/campaign-assignment"
          element={
            <ProtectedRoute>
              <CampaignAssignment/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/reports/payments-with-management"
          element={
            <ProtectedRoute>
              <ReportPaymentsWithManagement/>
            </ProtectedRoute>
          }
        />

        <Route
          path="/geogestion"
          element={
            <ProtectedRoute>
              <Geogestion />
            </ProtectedRoute>
          }
        />

        <Route
          path="/field-trip"
          element={
            <ProtectedRoute>
              <FieldTrip />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={<RootRedirect />}
        />

        <Route
          path="*"
          element={<RootRedirect />}
        />
      </Routes>
    </>
  );
}

export default App
