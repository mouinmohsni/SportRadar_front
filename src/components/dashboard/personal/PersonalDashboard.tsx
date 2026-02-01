// File: src/components/dashboard/personal/PersonalDashboard.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { Calendar, TrendingUp, Target, Award } from 'lucide-react';
import StatsCard from '../common/StatsCard';
import {
    AreaChart, Area, PieChart, Pie, Cell,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import type {Activity, Booking, User} from '../../../types';

interface PersonalDashboardProps {
    user: User;
}


const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ user }) => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data: bookings } = await axiosInstance.get<Booking[]>('/bookings/');
                const userActivities = bookings
                    .map(booking => booking.activity)
                    .filter(Boolean) as Activity[];
                setActivities(userActivities);
            } catch {
                toast.error('Erreur lors du chargement de vos données.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const today = useMemo(() => new Date(), []);
    const upcoming = useMemo(() => activities.filter(a => new Date(a.start_time) >= today), [activities, today]);
    const past = useMemo(() => activities.filter(a => new Date(a.start_time) < today), [activities, today]);

    // Graphique : Activités par mois
    const activityByMonth = useMemo(() => {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const counts = Array(12).fill(0);
        activities.forEach(a => {
            const month = new Date(a.start_time).getMonth();
            counts[month]++;
        });
        return months.map((name, index) => ({ name, count: counts[index] }));
    }, [activities]);

    // Graphique : Répartition par catégorie
    const categoryData = useMemo(() => {
        const counts: Record<string, number> = {};
        activities.forEach(a => {
            counts[a.category] = (counts[a.category] || 0) + 1;
        });
        return Object.entries(counts).map(([name, value]) => ({ name, value }));
    }, [activities]);

    const COLORS = ['#dc5f18', '#0a1128', '#ffc658', '#82ca9d', '#8884d8'];

    // Objectifs
    const objectivePercent = useMemo(() => {
        const objectives = user?.preferences?.objectives || [];
        if (objectives.length === 0) return 0;
        const done = activities.filter(a => objectives.includes(a.category)).length;
        return Math.min(100, Math.round((done / objectives.length) * 100));
    }, [activities, user]);

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
                    title="À venir"
                    value={upcoming.length}
                    icon={TrendingUp}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="Complétées"
                    value={past.length}
                    icon={Award}
                    color="bg-green-500"
                />
                <StatsCard
                    title="Objectifs atteints"
                    value={objectivePercent}
                    suffix="%"
                    icon={Target}
                    color="bg-purple-500"
                />
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Graphique : Activités par mois */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-[#0a1128] mb-4">📊 Évolution mensuelle</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={activityByMonth}>
                            <defs>
                                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#dc5f18" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#dc5f18" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#dc5f18"
                                fillOpacity={1}
                                fill="url(#colorCount)"
                                animationDuration={1500}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Graphique : Répartition par catégorie */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-[#0a1128] mb-4">🎯 Répartition par catégorie</h3>
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

            {/* Activités à venir */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-[#0a1128] mb-4">📅 Prochaines activités</h3>
                {upcoming.length > 0 ? (
                    <div className="space-y-3">
                        {upcoming.slice(0, 5).map(activity => (
                            <div
                                key={activity.id}
                                className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-white rounded-lg hover:shadow-md transition-all cursor-pointer"
                                onClick={() => navigate(`/activities/${activity.id}`)}
                            >
                                <div>
                                    <p className="font-semibold text-[#0a1128]">{activity.name}</p>
                                    <p className="text-sm text-gray-600">
                                        {new Date(activity.start_time).toLocaleDateString('fr-FR', {
                                            weekday: 'long',
                                            day: 'numeric',
                                            month: 'long'
                                        })}
                                    </p>
                                </div>
                                <span className="text-[#dc5f18] font-semibold">{activity.price}€</span>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-center py-8">Aucune activité à venir</p>
                )}
            </div>

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => navigate('/activities')}
                    className="bg-gradient-to-r from-[#dc5f18] to-[#ff7b3d] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                    🔍 Explorer les activités
                </button>
                <button
                    onClick={() => navigate('/coaches')}
                    className="bg-gradient-to-r from-[#0a1128] to-[#14213d] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                    👥 Voir les coaches
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

export default PersonalDashboard;
