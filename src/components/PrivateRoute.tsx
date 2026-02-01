// File: src/components/PrivateRoute.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();  // ✅ AJOUT : Récupérer loading

  // ✅ AJOUT : Attendre que le chargement soit terminé
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#C7C5C5]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-[#dc5f18] mb-4"></div>
            <p className="text-xl text-gray-700">Chargement...</p>
          </div>
        </div>
    );
  }

  // ✅ Maintenant on peut vérifier si l'utilisateur est connecté
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
