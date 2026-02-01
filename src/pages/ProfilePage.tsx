// File: src/pages/ProfilePage.tsx
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import SEO from '../components/SEO';
import ProfileHeader from '../components/profile/ProfileHeader';
import PasswordChangeForm from '../components/profile/PasswordChangeForm';
import PersonalPreferences from '../components/profile/PersonalPreferences';
import CoachInfo from '../components/profile/CoachInfo';
import BusinessInfo from '../components/profile/BusinessInfo';

const ProfilePage: React.FC = () => {
  const { user, fetchMe } = useAuth();

  if (!user) {
    return (
        <div className="min-h-screen bg-[#C7C5C5] flex items-center justify-center">
          <p className="text-xl text-gray-700">Chargement du profil…</p>
        </div>
    );
  }

  return (
      <>
        <SEO
            title="Mon Profil"
            description="Gérez vos informations personnelles, votre mot de passe et vos préférences sur SportRadar."
        />

        <div className="min-h-screen bg-[#C7C5C5] py-12">
          <div className="max-w-4xl mx-auto px-4 space-y-6">
            {/* En-tête avec titre */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h1 className="text-4xl font-bold text-[#0a1128]">Mon Profil</h1>
              <p className="text-gray-600 mt-2">
                Gérez vos informations personnelles et vos préférences
              </p>
              <div className="mt-3 inline-block bg-[#0a1128] text-white px-3 py-1 rounded-full text-sm">
                {user.type === 'personal' && '👤 Client'}
                {user.type === 'coach' && '🥋 Coach'}
                {user.type === 'business' && '🏢 Entreprise'}
                {user.is_staff && '⚙️ Administrateur'}
              </div>
            </div>

            {/* Composant commun : Avatar + Infos de base */}
            <ProfileHeader user={user} onUpdate={fetchMe} />

            {/* Composants spécifiques selon le type d'utilisateur */}
            {user.type === 'personal' && (
                <PersonalPreferences user={user} onUpdate={fetchMe} />
            )}

            {user.type === 'coach' && (
                <CoachInfo user={user} />
            )}

            {user.type === 'business' && (
                <BusinessInfo user={user} />
            )}

            {/* Composant commun : Changement de mot de passe */}
            <PasswordChangeForm userId={user.id} />

            {/* Message pour les admins */}
            {user.is_staff && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h2 className="text-xl font-bold text-blue-900 mb-2">⚙️ Accès Administrateur</h2>
                  <p className="text-blue-700 mb-3">
                    Vous avez accès à toutes les fonctionnalités d'administration de la plateforme.
                  </p>
                  <a
                      href="/admin"
                      className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Accéder à l'administration
                  </a>
                </div>
            )}
          </div>
        </div>
      </>
  );
};

export default ProfilePage;
