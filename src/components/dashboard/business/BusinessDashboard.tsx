// File: src/components/dashboard/business/BusinessDashboard.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { Calendar, Users, TrendingUp, DollarSign, Trash2 } from 'lucide-react';
import StatsCard from '../common/StatsCard';
import {
    LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import type {Activity, User, User as CoachUser} from '../../../types';
import {getMediaUrl} from "../../../utils/media.ts";

interface BusinessDashboardProps {
    user: User;
}

const BusinessDashboard: React.FC<BusinessDashboardProps> = ({ user }) => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [coaches, setCoaches] = useState<CoachUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                if (user.company) {
                    // Récupérer les activités de l'entreprise
                    const { data: activitiesData } = await axiosInstance.get<Activity[]>(`/companies/${user.company}/activities/`);
                    setActivities(activitiesData);

                    // Récupérer les coaches de l'entreprise
                    const { data: coachesData } = await axiosInstance.get<CoachUser[]>(`/companies/${user.company}/coaches/`);
                    setCoaches(coachesData);
                }
            } catch {
                toast.error('Erreur lors du chargement des données.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.company]);

    const handleDeleteActivity = async (e: React.MouseEvent, activityId: number) => {
        e.stopPropagation(); // Empêche la navigation vers le détail de l'activité
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) return;

        try {
            await axiosInstance.delete(`/activities/${activityId}/`);
            toast.success('Activité supprimée avec succès ✅');
            setActivities(prev => prev.filter(a => a.id !== activityId));
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            toast.error('Erreur lors de la suppression de l\'activité ❌');
        }
    };

    const today = useMemo(() => new Date(), []);
    const upcoming = useMemo(() => activities.filter(a => new Date(a.start_time) >= today), [activities, today]);

    const totalRevenue = useMemo(() => {
        return activities.reduce((sum, a) => {
            const price = parseFloat(a.price?.replace(/[^\d.]/g, '') || '0');
            return sum + (price * (a.participants_count || 0));
        }, 0);
    }, [activities]);

    const totalParticipants = useMemo(() => {
        return activities.reduce((sum, a) => sum + (a.participants_count || 0), 0);
    }, [activities]);

    // Graphique : Répartition des activités par catégorie
    const categoryData = useMemo(() => {
        const counts: Record<string, number> = {};
        activities.forEach(a => {
            counts[a.category] = (counts[a.category] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [activities]);

    const COLORS = ['#dc5f18', '#0a1128', '#ffc658', '#82ca9d', '#8884d8'];

    // Graphique : Revenus par mois
    const revenueByMonth = useMemo(() => {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const revenues = Array(12).fill(0);
        activities.forEach(a => {
            const month = new Date(a.start_time).getMonth();
            const price = parseFloat(a.price?.replace(/[^\d.]/g, '') || '0');
            revenues[month] += price * (a.participants_count || 0);
        });
        return months.map((name, index) => ({ name, revenue: revenues[index] }));
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
                    title="Activités totales"
                    value={activities.length}
                    icon={Calendar}
                    color="bg-[#dc5f18]"
                />
                <StatsCard
                    title="Coaches actifs"
                    value={coaches.length}
                    icon={Users}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="Participants totaux"
                    value={totalParticipants}
                    icon={TrendingUp}
                    color="bg-green-500"
                />
                <StatsCard
                    title="Revenus estimés"
                    value={Math.round(totalRevenue)}
                    suffix="€"
                    icon={DollarSign}
                    color="bg-purple-500"
                />
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Graphique : Revenus par mois */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-[#0a1128] mb-4">💰 Revenus mensuels (€)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={revenueByMonth}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="revenue"
                                stroke="#dc5f18"
                                strokeWidth={3}
                                dot={{ fill: '#0a1128', r: 5 }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Graphique : Répartition par catégorie */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-[#0a1128] mb-4">📊 Activités par catégorie</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                animationDuration={1500}
                            >
                                {categoryData.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Prochaines activités */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-[#0a1128] mb-4">📅 Prochaines activités</h3>
                {upcoming.length > 0 ? (
                    <div className="space-y-3">
                        {upcoming.slice(0, 5).map(activity => (
                            <div
                                key={activity.id}
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-all cursor-pointer group"
                                onClick={() => navigate(`/activities/${activity.id}`)}
                            >
                                <div className="flex-1">
                                    <p className="font-semibold text-[#0a1128]">{activity.name}</p>
                                    <p className="text-sm text-gray-600">
                                        Coach : {activity.instructor?.username || 'Non assigné'}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="text-right">
                                        <p className="text-[#dc5f18] font-semibold">
                                            {activity.participants_count}/{activity.max_participants}
                                        </p>
                                        <p className="text-xs text-gray-500">{activity.price}€</p>
                                    </div>
                                    <button
                                        onClick={(e) => handleDeleteActivity(e, activity.id)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all opacity-0 group-hover:opacity-100"
                                        title="Supprimer l'activité"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-center py-8">Aucune activité à venir</p>
                )}
            </div>

            {/* Coaches */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-[#0a1128] mb-4">👥 Mes coaches</h3>
                {coaches.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {coaches.slice(0, 6).map(coach => (
                            <div
                                key={coach.id}
                                className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:shadow-md transition-all cursor-pointer"
                                onClick={() => navigate(`/coaches/${coach.id}`)}
                            >
                                <img

                                    src={getMediaUrl(coach.avatar) || '/src/assets/avatars/default-avatar.png'}

                                    alt={coach.username}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                                <div>
                                    <p className="font-semibold text-[#0a1128]">{coach.username}</p>
                                    <p className="text-xs text-gray-500">{coach.email}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-center py-8">Aucun coach pour l'instant</p>
                )}
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => navigate('/activities/new')}
                    className="bg-gradient-to-r from-[#dc5f18] to-[#ff7b3d] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                    ➕ Créer une activité
                </button>
                <button
                    onClick={() => navigate('/business')}
                    className="bg-gradient-to-r from-[#0a1128] to-[#14213d] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                    👥 Gérer mon équipe
                </button>
                <button
                    onClick={() => navigate('/profile')}
                    className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                    ⚙️ Mon profil
                </button>
            </div>
        </div>
    );
};

export default BusinessDashboard;
