// File: src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

import Header from './components/Header';
import Footer from './components/Footer';
import PrivateRoute from './components/PrivateRoute';
import BusinessRoute from './components/BusinessRoute';
import AdminRoute from './components/AdminRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ActivitiesPage from './pages/ActivitiesPage';
import ProfilePage from './pages/ProfilePage';
import BusinessPage from './pages/BusinessPage';
import AddActivityPage from './pages/AddActivityPage';
import AdminActivitiesPage from './pages/AdminActivitiesPage';
import AdminBackOffice from './pages/AdminBackOffice';
import NotFoundPage from './pages/NotFoundPage';
import BusinessActivitiesPage from './pages/BusinessActivitiesPage';
import GestionEquipePage from './pages/features/GestionEquipePage';
import AnalyticsAvancesPage from './pages/features/AnalyticsAvancesPage';
import PlanificationFlexiblePage from './pages/features/PlanificationFlexiblePage';
import ConformiteRgpdPage from './pages/features/ConformiteRgpdPage';
import BusinessSignupForm from './components/BusinessSignupForm';
import InviteEmployee from './components/InviteEmployee';
import AcceptInvitationPage from './pages/AcceptInvitationPage';
//import StarterForm from './pages/StarterForm';
//import ProfessionalForm from './pages/ProfessionalForm';
//import EnterpriseForm from './pages/EnterpriseForm';
import PlanForm from './components/PlanForm';
import RecommendationsPage from './pages/RecommendationsPage';
import BadgePage from './pages/BadgePage';
import CorporateOffersPage from './pages/CorporateOffersPage';
import ActivityDetailPage from './pages/ActivityDetailPage';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LegalPage from './pages/LegalPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import FaqPage from './pages/FaqPage';
import SitemapPage from './pages/SitemapPage';
import CookieConsentBanner from './components/CookieConsentBanner';
import CoachDetailPage from "./pages/CoachDetailPage.tsx";
import CompanyDetailPage from "./pages/CompanyDetailPage.tsx";
import CompaniesPage from "./pages/CompaniesPage.tsx";
import CoachesPage from "./pages/CoachesPage.tsx";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Header />  {/* Mise à jour de Header pour B2B/B2C */}
          <main className="flex-1">
            <Routes>
              {/* Public */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              {/* Company signup invitation */}
              <Route path="/signup-company" element={<BusinessSignupForm />} />
              <Route path="/invite-employee" element={<InviteEmployee />} />
              <Route path="/accept-invite" element={<AcceptInvitationPage />} />
              <Route path="/activities" element={<ActivitiesPage />} />
              <Route path="/activities/:id" element={<ActivityDetailPage />} />
              <Route path="/coaches/:id" element={<CoachDetailPage />} />
              <Route path="/companies/:id" element={<CompanyDetailPage />} />
              <Route path="/companies" element={<CompaniesPage />} />
              <Route path="/coaches" element={<CoachesPage />} />

              {/* B2C Authenticated */}
              <Route path="/dashboard" element={<PrivateRoute><DashboardPage /></PrivateRoute>} />

              <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
              <Route path="/business" element={<PrivateRoute><BusinessPage /></PrivateRoute>} />
              <Route path="/my-activities" element={<PrivateRoute><BusinessActivitiesPage /></PrivateRoute>} />

              {/* Business-only */}
              <Route path="/activities/new" element={<PrivateRoute><BusinessRoute><AddActivityPage /></BusinessRoute></PrivateRoute>} />
              <Route path="/admin/activities" element={<PrivateRoute><BusinessRoute><AdminActivitiesPage /></BusinessRoute></PrivateRoute>} />

              {/* Admin-only BackOffice */}
              <Route path="/admin" element={<PrivateRoute><AdminRoute><AdminBackOffice /></AdminRoute></PrivateRoute>} />

              {/* Feature detail pages */}
              <Route path="/features/gestion-equipe" element={<GestionEquipePage />} />
              <Route path="/features/analytics-avances" element={<AnalyticsAvancesPage />} />
              <Route path="/features/planification-flexible" element={<PlanificationFlexiblePage />} />
              <Route path="/features/conformite-rgpd" element={<ConformiteRgpdPage />} />

              <Route path="/subscribe/:planKey" element={<PlanFormWrapper />} />
              {/*<Route path="/subscribe/starter" element={<StarterForm />} />
              <Route path="/subscribe/professional" element={<ProfessionalForm />} />
              <Route path="/subscribe/enterprise" element={<EnterpriseForm />} /> */}

              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/badges" element={<BadgePage />} />
              <Route path="/corporate-offers" element={<CorporateOffersPage />} />
              <Route path="/legal" element={<LegalPage />} />
              <Route path="/privacy" element={<PrivacyPolicyPage />} />
              <Route path="/faq" element={<FaqPage />} />
              <Route path="/sitemap" element={<SitemapPage />} />

              {/* Catch-all 404 */}
              <Route path="*" element={<NotFoundPage />} />


            </Routes>
          </main>
          <Footer />
          <ToastContainer />
        </div>
        <CookieConsentBanner />
      </Router>
    </AuthProvider>
  );
}

// Wrapper pour typer le paramètre
const PlanFormWrapper: React.FC = () => {
  const { planKey } = useParams<'planKey'>();
  if (!['basic', 'intermediate', 'enterprise'].includes(planKey!)) {
    return <div>Plan invalide</div>;
  }
  return <PlanForm planKey={planKey as 'basic' | 'intermediate' | 'enterprise'} />;
};
export default App;
