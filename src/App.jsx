import { Navigate, Route, Routes } from 'react-router-dom'
import useSessions from './hooks/useSessions'
import Login from './pages/Login'
import Header from './components/Header/Header'
import NavSlide from './components/navSlide/NavSlide'
import { useEffect, useState } from 'react'
import "./index.css";
import Me from './pages/Me'
import Push from './components/Push/Push'
import CardSelectStateCall from './components/Management/CardSelectStateCall/CardSelectStateCall'
import CardStructure from './components/CardStructure/CardStructure'
import CardCondonacion from './components/CardCondonacion/CardCondonacion'
import Loader from './components/Loader/loader'
import Home from './pages/Home'
import Usuarios from './pages/Usuarios'
import Credits from './pages/Credits/Credits'
import Credit from './pages/Credit/Credit'
import Payments from './pages/Payments/Payments'
import Campain from './pages/Campain'
import Consult from './pages/Consult/Consult'
import Gestion from './pages/Gestion'
import Historial from './pages/Historial'
import Contacts from './pages/Contacts/Contacts'
import Templates from './pages/Templates/Templates'

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

function PublicRoute({ children }) {
  const isAuthenticated = useSessions();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
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
      <CardStructure />
      <CardCondonacion />
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
          path="/"
          element={<Navigate to={useSessions() ? "/dashboard" : "/login"} replace />}
        />

        <Route
          path="*"
          element={<Navigate to={useSessions() ? "/dashboard" : "/login"} replace />}
        />
      </Routes>
    </>
  );
}

export default App
