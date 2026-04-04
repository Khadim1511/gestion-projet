import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Layout from './components/Layout';

import LoginPage        from './pages/auth/LoginPage';
import DashboardPage    from './pages/dashboard/DashboardPage';
import ProjetsPage      from './pages/projets/ProjetsPage';
import ProjetFormPage   from './pages/projets/ProjetFormPage';
import ProjetDetailPage from './pages/projets/ProjetDetailPage';
import PhaseFormPage    from './pages/phases/PhaseFormPage';
import EmployesPage     from './pages/employes/EmployesPage';
import EmployeFormPage  from './pages/employes/EmployeFormPage';
import ProfilsPage      from './pages/profils/ProfilsPage';
import OrganismesPage   from './pages/organismes/OrganismesPage';
import ProfilePage      from './pages/auth/ProfilePage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage  from './pages/auth/ResetPasswordPage';

import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#18181b', // Zinc-900
              color: '#f4f4f5',      // Zinc-100
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '16px',
              fontWeight: '600',
              fontSize: '14px',
            },
          }}
        />
        <Routes>
          {/* Public */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          {/* Protected */}
          <Route element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"  element={<DashboardPage />} />

            <Route path="/projets"               element={<ProjetsPage />} />
            <Route path="/projets/nouveau"        element={<PrivateRoute roles={['SEC','ADMIN','DIR']}><ProjetFormPage /></PrivateRoute>} />
            <Route path="/projets/:id"            element={<ProjetDetailPage />} />
            <Route path="/projets/:id/modifier"   element={<PrivateRoute roles={['SEC','ADMIN','DIR','CP']}><ProjetFormPage /></PrivateRoute>} />

            <Route path="/projets/:projetId/phases/nouvelle" element={<PrivateRoute roles={['SEC','ADMIN','DIR','CP']}><PhaseFormPage /></PrivateRoute>} />
            <Route path="/phases/:phaseId/modifier"          element={<PrivateRoute roles={['SEC','ADMIN','DIR','CP']}><PhaseFormPage /></PrivateRoute>} />

            <Route path="/employes"           element={<EmployesPage />} />
            <Route path="/employes/nouveau"   element={<PrivateRoute roles={['ADMIN']}><EmployeFormPage /></PrivateRoute>} />
            <Route path="/employes/:id/modifier" element={<PrivateRoute roles={['ADMIN']}><EmployeFormPage /></PrivateRoute>} />
            <Route path="/organismes"         element={<OrganismesPage />} />
            <Route path="/profils"            element={<PrivateRoute roles={['ADMIN']}><ProfilsPage /></PrivateRoute>} />
            <Route path="/profile"            element={<ProfilePage />} />

            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
    </ThemeProvider>
  );
}
