// File: src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Heart, User, Building, Mail, Lock, Eye, EyeOff, Briefcase, MapPin } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

interface Me {
  is_staff: boolean;
  type: 'personal' | 'business' | 'coach';
}

const LoginPage: React.FC = () => {
  const [accountType, setAccountType] = useState<'personal' | 'coach' | 'business'>('personal');
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    confirmPassword: '',
    // Infos Entreprise
    company_name: '',
    company_address: '',
    company_phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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

        const registerData: any = {
          email: formData.email,
          username: formData.username,
          password: formData.password,
          type: accountType,
          preferences: { activities: [], location: '', level: 'débutant' }
        };

        if (accountType === 'business') {
          registerData.company_info = {
            name: formData.company_name,
            address: formData.company_address,
            phone_number: formData.company_phone
          };
        }

        await axiosInstance.post('/users/', registerData);
        toast.success('Compte créé avec succès !');
        await login(formData.email, formData.password);
      }

      if (from) {
        navigate(from, { replace: true });
        return;
      }

      const { data: me } = await axiosInstance.get<Me>('/users/me/');
      if (me.is_staff) navigate('/admin', { replace: true });
      else if (me.type === 'business') navigate('/business', { replace: true });
      else if (me.type === 'coach') navigate('/coach-dashboard', { replace: true });
      else navigate('/profile', { replace: true });

    } catch (err: any) {
      setErrorMsg(err.response?.data?.detail || 'Erreur lors de l\'authentification');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
      <div className="min-h-screen bg-[#C7C5C5] py-12 flex flex-col justify-center">
        <div className="max-w-md w-full mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-8 bg-[#0a1128] text-center">
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

            {/* Onglets à 3 types */}
            {!isLogin && (
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex rounded-lg bg-[#0a1128] p-1">
                    {[
                      { id: 'personal', label: 'Personnel', icon: User },
                      { id: 'coach', label: 'Coach', icon: Briefcase },
                      { id: 'business', label: 'Entreprise', icon: Building }
                    ].map(role => (
                        <button
                            key={role.id}
                            type="button"
                            onClick={() => setAccountType(role.id as any)}
                            className={`flex-1 flex items-center justify-center space-x-1 py-2 px-1 rounded-md text-[11px] font-bold transition-all ${
                                accountType === role.id
                                    ? 'bg-white text-[#0a1128] shadow-sm'
                                    : 'text-gray-400 hover:text-white hover:bg-[#dc5f18]/20'
                            }`}
                        >
                          <role.icon className="w-3.5 h-3.5" />
                          <span>{role.label}</span>
                        </button>
                    ))}
                  </div>
                </div>
            )}

            {errorMsg && (
                <div className="mx-6 mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-sm border border-red-200">
                  {errorMsg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
              {/* --- SECTION UTILISATEUR (Toujours visible pour l'inscription) --- */}
              {!isLogin && (
                  <div className="space-y-4">
                    <p className="text-[10px] font-bold text-[#dc5f18] uppercase tracking-widest border-b border-gray-100 pb-1">
                      Informations de compte
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom d'utilisateur</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dc5f18] outline-none"
                            placeholder="Ex: sport_passion"
                        />
                      </div>
                    </div>
                  </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dc5f18] outline-none"
                      placeholder="test@test.com"
                  />
                </div>
              </div>

              {/* --- SECTION ENTREPRISE (Uniquement si Business sélectionné) --- */}
              {!isLogin && accountType === 'business' && (
                  <div className="space-y-4 pt-2">
                    <p className="text-[10px] font-bold text-[#dc5f18] uppercase tracking-widest border-b border-gray-100 pb-1">
                      Informations de l'entreprise
                    </p>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nom de l'entreprise</label>
                      <div className="relative">
                        <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            name="company_name"
                            type="text"
                            value={formData.company_name}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dc5f18] outline-none"
                            placeholder="Mon Entreprise"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            name="company_address"
                            type="text"
                            value={formData.company_address}
                            onChange={handleInputChange}
                            required
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dc5f18] outline-none"
                            placeholder="123 rue du Sport, Paris"
                        />
                      </div>
                    </div>
                  </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className="w-full pl-10 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-[#dc5f18] outline-none"
                      placeholder="••••••••••••"
                  />
                  <button
                      type="button"
                      onClick={() => setShowPassword(v => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {!isLogin && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                          name="confirmPassword"
                          type="password"
                          value={formData.confirmPassword}
                          onChange={handleInputChange}
                          required
                          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#dc5f18] outline-none"
                      />
                    </div>
                  </div>
              )}

              <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-[#0a1128] text-white rounded-lg font-bold hover:bg-[#1a2148] transition-all disabled:opacity-50 shadow-md"
              >
                {loading ? 'Chargement...' : isLogin ? 'Se connecter' : 'Créer mon compte'}
              </button>
            </form>

            <div className="px-6 pb-8 text-center">
              <p className="text-gray-600 text-sm">
                {isLogin ? "Pas encore de compte ?" : "Déjà un compte ?"}
                <button
                    type="button"
                    onClick={() => { setIsLogin(!isLogin); setErrorMsg(null); }}
                    className="ml-2 text-[#dc5f18] font-bold hover:underline"
                >
                  {isLogin ? "S'inscrire" : "Se connecter"}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
  );
};

export default LoginPage;
