// File: src/pages/DashboardPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Helmet } from 'react-helmet-async';
import DashboardHeader from '../components/dashboard/common/DashboardHeader';
import PersonalDashboard from '../components/dashboard/personal/PersonalDashboard';
import CoachDashboard from '../components/dashboard/coach/CoachDashboard';
import BusinessDashboard from '../components/dashboard/business/BusinessDashboard';
import AdminDashboard from '../components/dashboard/admin/AdminDashboard';

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, loading, navigate]);

  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#C7C5C5]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-[#dc5f18] mb-4"></div>
            <p className="text-xl text-gray-700">Chargement de votre espace...</p>
          </div>
        </div>
    );
  }

  if (!user) return null;

  // Déterminer quel dashboard afficher selon le type d'utilisateur
  const renderDashboard = () => {
    switch (user.type) {
      case 'personal':
        return <PersonalDashboard user={user} />;
      case 'coach':
        return <CoachDashboard user={user} />;
      case 'business':
        return <BusinessDashboard user={user} />;
      case 'admin':
        return <AdminDashboard user={user} />;
      default:
        return (
            <div className="text-center py-16">
              <p className="text-gray-600 text-lg">Type d'utilisateur non reconnu.</p>
            </div>
        );
    }
  };

  return (
      <>
        <Helmet>
          <title>Mon Espace - SportRadar</title>
          <meta name="description" content="Consultez vos statistiques, activités et gérez votre espace personnel sur SportRadar." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="min-h-screen bg-gradient-to-br from-[#C7C5C5] via-gray-100 to-white p-6">
          <div className="max-w-7xl mx-auto">
            {/* Header universel */}
            <DashboardHeader user={user} />

            {/* Dashboard spécifique au type d'utilisateur */}
            {renderDashboard()}
          </div>
        </div>
      </>
  );
};

export default DashboardPage;
