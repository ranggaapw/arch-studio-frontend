import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './features/client/components/ProtectedRoute';
import PortfolioPage from './features/client/pages/PortfolioPage';
import ServicesPage from './features/client/pages/ServicesPage';
import AboutPage from './features/client/pages/AboutPage';
import ClientHome from './features/client/pages/ClientHome';
import LoginPage from './features/client/pages/LoginPage';
import AdminDashboard from './features/admin/pages/AdminDashboard'; 
import KarirPage from './features/client/pages/KarirPage';
import PrivacyPage from './features/client/pages/PrivacyPage';
import TermsPage from './features/client/pages/TermsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute Publik */}
        <Route path="/" element={<ClientHome />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/karir" element={<KarirPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Rute yang Dilindungi */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;