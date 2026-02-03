import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useAuth } from '../contexts/AuthContext';
import { Navigate } from 'react-router-dom';

interface BusinessForm {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

const AdminBackOffice: React.FC = () => {
  const { user } = useAuth();
  const [form, setForm] = useState<BusinessForm>({
    email: '', username: '', password: '', confirmPassword: ''
  });
  const [error, setError] = useState<string|null>(null);
  const [success, setSuccess] = useState<string|null>(null);
  const [businessList, setBusinessList] = useState<any[]>([]);

  // 1) Guard : seuls les is_staff accèdent
  if (!user?.is_staff) {
    return <Navigate to="/" replace />;
  }

  // 2) Charger les comptes business existants
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosInstance.get('/api/users/'); // ou un endpoint admin pour lister users
        setBusinessList(res.data.filter((u:any)=>u.type==='business'));
      } catch {
        // ignorer
      }
    })();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f=>({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (form.password !== form.confirmPassword) {
      return setError("Mots de passe différents");
    }
    try {


      await axiosInstance.post('/api/users/register-business/', {
        email: form.email,
        username: form.username,
        password: form.password,
        preferences: {}
      });
      setSuccess("Compte business créé !");
      // recharger la liste
      const res = await axiosInstance.get('/api/users/');
      setBusinessList(res.data.filter((u:any)=>u.type==='business'));
    } catch (err: any) {
      setError(err.response?.data||"Erreur serveur");
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Back-office Admin</h2>

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
        <input
          name="email" type="email" required
          placeholder="Email business"
          value={form.email} onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="username" type="text" required
          placeholder="Nom d’utilisateur"
          value={form.username} onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="password" type="password" required
          placeholder="Mot de passe"
          value={form.password} onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <input
          name="confirmPassword" type="password" required
          placeholder="Confirmer mot de passe"
          value={form.confirmPassword} onChange={handleChange}
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Créer compte Business
        </button>
      </form>

      <h3 className="text-xl font-semibold mb-2">Comptes Business existants</h3>
      <ul className="list-disc pl-5">
        {businessList.map(b => (
          <li key={b.id}>{b.username} — {b.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default AdminBackOffice;
