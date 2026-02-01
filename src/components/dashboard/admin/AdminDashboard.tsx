// File: src/components/dashboard/admin/AdminDashboard.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { Users, Building, Calendar, TrendingUp } from 'lucide-react';
import StatsCard from '../common/StatsCard';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import type { Activity, User, Company } from '../../../types';

interface AdminDashboardProps {
    user: User;
}

const AdminDashboard: React.FC<AdminDashboardProps> = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [companies, setCompanies] = useState<Company[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [usersRes, companiesRes, activitiesRes] = await Promise.all([
                    axiosInstance.get<User[]>('/users/'),
                    axiosInstance.get<Company[]>('/companies/'),
                    axiosInstance.get<Activity[]>('/activities/')
                ]);
                setUsers(usersRes.data);
                setCompanies(companiesRes.data);
                setActivities(activitiesRes.data);
            } catch {
                toast.error('Erreur lors du chargement des données.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Statistiques par type d'utilisateur
    const usersByType = useMemo(() => {
        const counts: Record<string, number> = {
            personal: 0,
            coach: 0,
            business: 0,
            admin: 0
        };
        users.forEach(u => {
            counts[u.type] = (counts[u.type] || 0) + 1;
        });
        return [
            { name: 'Clients', value: counts.personal },
            { name: 'Coaches', value: counts.coach },
            { name: 'Salles', value: counts.business },
            { name: 'Admins', value: counts.admin }
        ];
    }, [users]);

    const COLORS = ['#dc5f18', '#0a1128', '#ffc658', '#82ca9d'];

    // Graphique : Croissance des utilisateurs par mois
    const userGrowth = useMemo(() => {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const counts = Array(12).fill(0);
        users.forEach(u => {
            if (u.created_at) {
                const month = new Date(u.created_at).getMonth();
                counts[month]++;
            }
        });
        return months.map((name, index) => ({ name, count: counts[index] }));
    }, [users]);

    // Graphique : Activités par catégorie
    const activitiesByCategory = useMemo(() => {
        const counts: Record<string, number> = {};
        activities.forEach(a => {
            counts[a.category] = (counts[a.category] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [activities]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#dc5f18]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Utilisateurs totaux"
                    value={users.length}
                    icon={Users}
                    color="bg-[#dc5f18]"
                    trend={{ value: 12, isPositive: true }}
                />
                <StatsCard
                    title="Salles de sport"
                    value={companies.length}
                    icon={Building}
                    color="bg-blue-500"
                    trend={{ value: 8, isPositive: true }}
                />
                <StatsCard
                    title="Activités totales"
                    value={activities.length}
                    icon={Calendar}
                    color="bg-green-500"
                    trend={{ value: 15, isPositive: true }}
                />
                <StatsCard
                    title="Coaches actifs"
                    value={users.filter(u => u.type === 'coach' && u.is_active).length}
                    icon={TrendingUp}
                    color="bg-purple-500"
                />
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Graphique : Croissance des utilisateurs */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-[#0a1128] mb-4">📈 Croissance des utilisateurs</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={userGrowth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#dc5f18"
                                strokeWidth={3}
                                dot={{ fill: '#0a1128', r: 5 }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Graphique : Répartition des utilisateurs */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-[#0a1128] mb-4">👥 Répartition des utilisateurs</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={usersByType}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                animationDuration={1500}
                            >
                                {usersByType.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Graphique : Activités par catégorie */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-[#0a1128] mb-4">📊 Activités par catégorie</h3>
                <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={activitiesByCategory}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="name" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0a1128" animationDuration={1500} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Dernières inscriptions */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-[#0a1128] mb-4">🆕 Dernières inscriptions</h3>
                <div className="space-y-3">
                    {users
                        .sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())
                        .slice(0, 5)
                        .map(user => (
                            <div
                                key={user.id}
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-all"
                            >
                                <div className="flex items-center space-x-3">
                                    <img
                                        src={user.avatar || '/images/avatar-default.png'}
                                        alt={user.username}
                                        className="w-10 h-10 rounded-full object-cover"
                                    />
                                    <div>
                                        <p className="font-semibold text-[#0a1128]">{user.username}</p>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                    </div>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                    user.type === 'coach' ? 'bg-blue-100 text-blue-800' :
                                        user.type === 'business' ? 'bg-purple-100 text-purple-800' :
                                            'bg-green-100 text-green-800'
                                }`}>
                                    {user.type === 'coach' ? '🥋 Coach' :
                                        user.type === 'business' ? '🏢 Salle' :
                                            '👤 Client'}
                                </span>
                            </div>
                        ))}
                </div>
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => navigate('/admin')}
                    className="bg-gradient-to-r from-[#dc5f18] to-[#ff7b3d] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                    ⚙️ Backoffice
                </button>
                <button
                    onClick={() => navigate('/users')}
                    className="bg-gradient-to-r from-[#0a1128] to-[#14213d] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                    👥 Gérer les utilisateurs
                </button>
                <button
                    onClick={() => navigate('/activities')}
                    className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                    📅 Gérer les activités
                </button>
            </div>
        </div>
    );
};

export default AdminDashboard;
