// File: src/components/Header.tsx
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
// import NotificationCenter from "./notifications/NotificationCenter.tsx";

const Header: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
      <header className="bg-gradient-to-r from-[#C7C5C5] via-[#8F8C8C] to-[#736F6F] sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" onClick={() => window.scrollTo(0, 0)}>
            <img
                src="/images/hero/logo_sportRadar.png"
                alt="SportRadar"
                className="h-16"
            />
          </Link>
          <nav className="flex items-center gap-6 text-white font-bold">
            <Link
                to="/"
                onClick={() => window.scrollTo(0, 0)}
                className="hover:text-[#dc5f18] transition-colors"
            >
              Accueil
            </Link>

            {/* ===== UTILISATEUR NON CONNECTÉ ===== */}
            {!isAuthenticated && (
                <>
                  <Link
                      to="/activities"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Activités
                  </Link>
                  <Link
                      to="/coaches"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Coaches
                  </Link>
                  <Link
                      to="/companies"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Salles de Sport
                  </Link>
                  <Link
                      to="/login"
                      className="bg-[#dc5f18] px-4 py-2 rounded hover:bg-[#b84f14] transition-colors"
                      onClick={() => window.scrollTo(0, 0)}
                  >
                    Connexion
                  </Link>
                </>
            )}

            {/* ===== ADMIN ===== */}
            {isAuthenticated && user?.is_staff && (
                <>
                  <Link
                      to="/activities"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Activités
                  </Link>
                  <Link
                      to="/coaches"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Coaches
                  </Link>
                  <Link
                      to="/companies"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Salles de Sport
                  </Link>
                  <Link
                      to="/dashboard"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                      to="/admin"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Admin
                  </Link>
                  {/*<NotificationCenter />*/}
                  <button
                      onClick={handleLogout}
                      className="bg-[#dc5f18] px-4 py-2 rounded hover:bg-[#b84f14] transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
            )}

            {/* ===== BUSINESS (Salle de Sport) ===== */}
            {isAuthenticated && !user?.is_staff && user?.type === 'business' && (
                <>
                  <Link
                      to="/dashboard"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                      to="/business"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Espace Entreprise
                  </Link>
                  <Link
                      to="/activities"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Activités
                  </Link>
                  <Link
                      to="/coaches"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Coaches
                  </Link>
                  <Link
                      to="/companies"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Salles de Sport
                  </Link>
                  {/*<NotificationCenter />*/}
                  <button
                      onClick={handleLogout}
                      className="bg-[#dc5f18] px-4 py-2 rounded hover:bg-[#b84f14] transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
            )}

            {/* ===== PERSONAL (Client) ===== */}
            {isAuthenticated && !user?.is_staff && user?.type === 'personal' && (
                <>
                  <Link
                      to="/dashboard"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                      to="/activities"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Activités
                  </Link>
                  <Link
                      to="/coaches"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Coaches
                  </Link>
                  <Link
                      to="/companies"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Salles de Sport
                  </Link>
                  <Link
                      to="/profile"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Mon profil
                  </Link>
                  {/*<NotificationCenter />*/}
                  <button
                      onClick={handleLogout}
                      className="bg-[#dc5f18] px-4 py-2 rounded hover:bg-[#b84f14] transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
            )}

            {/* ===== COACH ===== */}
            {isAuthenticated && !user?.is_staff && user?.type === 'coach' && (
                <>
                  <Link
                      to="/dashboard"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Dashboard
                  </Link>
                  <Link
                      to="/activities"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Activités
                  </Link>
                  <Link
                      to="/coaches"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Coaches
                  </Link>
                  <Link
                      to="/companies"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Salles de Sport
                  </Link>
                  <Link
                      to="/profile"
                      onClick={() => window.scrollTo(0, 0)}
                      className="hover:text-[#dc5f18] transition-colors"
                  >
                    Mon profil
                  </Link>
                  {/*<NotificationCenter />*/}
                  <button
                      onClick={handleLogout}
                      className="bg-[#dc5f18] px-4 py-2 rounded hover:bg-[#b84f14] transition-colors"
                  >
                    Déconnexion
                  </button>
                </>
            )}
          </nav>
        </div>
      </header>
  );
};

export default Header;
