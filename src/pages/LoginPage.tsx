// File: src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, User, Building, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosInstance';

interface Me {
  is_staff: boolean;
  type: 'personal' | 'business';
}

const LoginPage: React.FC = () => {
  const [accountType, setAccountType] = useState<'personal' | 'business'>('personal');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  // si on a été redirigé ici depuis ActivitiesPage
  const from = (location.state as any)?.from as string | undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        if (formData.password !== formData.confirmPassword) {
          setErrorMsg("Les mots de passe ne correspondent pas.");
          setLoading(false);
          return;
        }
        await axiosInstance.post('/register/', {
          email: formData.email,
          username: formData.name,
          password: formData.password,
          type: accountType,
          preferences: { activities: ['yoga'], location: 'Paris', level: 'débutant' }
        });
        await login(formData.email, formData.password);
      }

      // si on vient d'une page précise, on y retourne
      if (from) {
        navigate(from, { replace: true });
        return;
      }

      // sinon on récupère le profil pour déterminer la redirection
      const { data: me } = await axiosInstance.get<Me>('/users/me/');
      if (me.is_staff) {
        navigate('/admin', { replace: true });
      } else if (me.type === 'business') {
        navigate('/business', { replace: true });
      } else {
        navigate('/profile', { replace: true });
      }

    } catch (err: any) {
      console.error('Auth error:', err);
      setErrorMsg(
        err.response?.data?.detail ||
        JSON.stringify(err.response?.data) ||
        'Erreur serveur'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-[#C7C5C5] py-12">
      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="px-6 py-8 bg-[#0a1128] text-gray-400 text-center">
            <Link to="/" className="inline-flex items-center mb-4">
              <Heart className="w-8 h-8 text-[#dc5f18]" />
              <span className="text-xl font-bold ml-2 text-white">SportRadar</span>
            </Link>
            <h1 className="text-2xl font-bold text-white">
              {isLogin ? 'Bienvenue !' : 'Rejoignez-nous'}
            </h1>
            <p className="text-sky-100 mt-2">
              {isLogin ? 'Connectez-vous à votre espace' : 'Créez votre compte'}
            </p>
          </div>

          {!isLogin && (
            <div className="px-6 py-4 border-b border-[#dc5f18]">
              <div className="flex rounded-lg bg-[#0a1128] p-1">
                {['personal', 'business'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setAccountType(type as 'personal' | 'business')}
                    className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md text-sm font-medium transition-all ${accountType === type
                        ? 'bg-white text-[#0a1128]'
                        : 'text-[#C7C5C5] hover:bg-[#dc5f18] hover:text-white'
                      }`}
                  >
                    {type === 'personal' ? <User className="w-4 h-4" /> : <Building className="w-4 h-4" />}
                    <span className="capitalize">
                      {type === 'personal' ? 'Personnel' : 'Entreprise'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="bg-red-100 text-red-800 p-3 rounded mb-4">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {accountType === 'business' ? "Nom de l'entreprise" : 'Nom complet'}
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500"
                  placeholder={accountType === 'business' ? 'Mon Entreprise' : 'Jean Dupont'}
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500"
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(v => !v)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 bg-[#0a1128] text-white rounded-lg font-semibold hover:brightness-110 disabled:opacity-50"
            >
              {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
            </button>
          </form>

          <div className="px-6 py-4 text-center text-gray-600">
            {isLogin ? (
              <>
                Pas encore de compte ?{' '}
                <button
                  type="button"
                  onClick={() => { setIsLogin(false); setErrorMsg(null); }}
                  className="text-[#dc5f18] font-medium"
                >
                  S’inscrire
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{' '}
                <button
                  type="button"
                  onClick={() => { setIsLogin(true); setErrorMsg(null); }}
                  className="text-[#dc5f18] font-medium"
                >
                  Se connecter
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
