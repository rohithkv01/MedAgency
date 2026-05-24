import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/LandingPage';
import AgencyListPage from './pages/AgencyListPage';
import AgencyDetailsPage from './pages/AgencyDetailsPage';
import OwnerLogin from './pages/OwnerLogin';
import OwnerRegister from './pages/OwnerRegister';
import OwnerDashboard from './pages/OwnerDashboard';
import ManageAgency from './pages/ManageAgency';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/agencies" element={<AgencyListPage />} />
          <Route path="/agencies/:id" element={<AgencyDetailsPage />} />
          <Route path="/login" element={<OwnerLogin />} />
          <Route path="/register" element={<OwnerRegister />} />
          <Route path="/dashboard" element={<ProtectedRoute><OwnerDashboard /></ProtectedRoute>} />
          <Route path="/manage-agency" element={<ProtectedRoute><ManageAgency /></ProtectedRoute>} />
          <Route path="/manage-agency/:id" element={<ProtectedRoute><ManageAgency /></ProtectedRoute>} />
        </Routes>
        <Footer />
      </Router>
    </AuthProvider>
  );
}
