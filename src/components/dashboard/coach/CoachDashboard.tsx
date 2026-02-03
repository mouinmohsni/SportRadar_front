// File: src/components/dashboard/coach/CoachDashboard.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosInstance';
import { toast } from 'react-toastify';
import { Calendar, Users, TrendingUp, Award } from 'lucide-react';
import StatsCard from '../common/StatsCard';
import {
    BarChart, Bar, LineChart, Line,
    XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import type { Activity, User, Booking } from '../../../types';

interface CoachDashboardProps {
    user: User;
}

// Type étendu avec participants_count calculé
interface ActivityWithParticipants extends Activity {
    participants_count: number;
}

const CoachDashboard: React.FC<CoachDashboardProps> = ({ user }) => {
    const navigate = useNavigate();
    const [activities, setActivities] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // 1. Récupérer les activités du coach
                const activitiesResponse = await axiosInstance.get<Activity[]>(`/api/users/${user.id}/activities/`);
                const activitiesData = activitiesResponse.data;
                console.log('Coach activities:', activitiesResponse);

                // 2. Récupérer tous les bookings
                const bookingsResponse = await axiosInstance.get<Booking[]>('/api/bookings/');
                const bookingsData = bookingsResponse.data;
                console.log('All bookings:', bookingsData);

                // 3. Calculer participants_count pour chaque activité
                const activitiesWithParticipants: ActivityWithParticipants[] = activitiesData.map(activity => {
                    // Compter les bookings confirmés pour cette activité
                    const confirmedBookings = bookingsData.filter(
                        booking => booking.activity.id === activity.id && booking.status === 'confirmed'
                    );

                    return {
                        ...activity,
                        participants_count: confirmedBookings.length
                    };
                });

                console.log('Activities with participants:', activitiesWithParticipants);
                setActivities(activitiesData);
            } catch (error) {
                console.error('Error fetching coach data:', error);
                toast.error('Erreur lors du chargement de vos activités.');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [user.id]);

    const today = useMemo(() => new Date(), []);
    const upcoming = useMemo(() => activities.filter(a => new Date(a.start_time) >= today), [activities, today]);

    const totalParticipants = useMemo(() => {
        return activities.reduce((sum, a) => sum + a.participants_count, 0);
    }, [activities]);

    // Graphique : Participants par activité
    const participantsByActivity = useMemo(() => {
        return activities.slice(0, 5).map(a => ({
            name: a.name.length > 15 ? a.name.substring(0, 15) + '...' : a.name,
            participants: a.participants_count,
            max: a.max_participants
        }));
    }, [activities]);

    // Graphique : Évolution des participants
    const participantsEvolution = useMemo(() => {
        const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
        const counts = Array(12).fill(0);
        activities.forEach(a => {
            const month = new Date(a.start_time).getMonth();
            counts[month] += a.participants_count;
        });
        return months.map((name, index) => ({ name, count: counts[index] }));
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
                    title="À venir"
                    value={upcoming.length}
                    icon={TrendingUp}
                    color="bg-blue-500"
                />
                <StatsCard
                    title="Participants totaux"
                    value={totalParticipants}
                    icon={Users}
                    color="bg-green-500"
                />
                <StatsCard
                    title="Taux de remplissage"
                    value={activities.length > 0 ? Math.round((totalParticipants / activities.reduce((sum, a) => sum + a.max_participants, 0)) * 100) : 0}
                    suffix="%"
                    icon={Award}
                    color="bg-purple-500"
                />
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Graphique : Participants par activité */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-[#0a1128] mb-4">👥 Participants par activité</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={participantsByActivity}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Bar dataKey="participants" fill="#dc5f18" animationDuration={1500} />
                            <Bar dataKey="max" fill="#e5e7eb" animationDuration={1500} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Graphique : Évolution mensuelle */}
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-lg font-semibold text-[#0a1128] mb-4">📊 Évolution mensuelle</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={participantsEvolution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                            <XAxis dataKey="name" stroke="#6b7280" />
                            <YAxis stroke="#6b7280" />
                            <Tooltip />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#0a1128"
                                strokeWidth={3}
                                dot={{ fill: '#dc5f18', r: 5 }}
                                animationDuration={1500}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Mes prochaines activités */}
            <div className="bg-white rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold text-[#0a1128] mb-4">📅 Mes prochaines activités</h3>
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
                                            month: 'long',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#dc5f18] font-semibold">
                                        {activity.participants_count}/{activity.max_participants}
                                    </p>
                                    <p className="text-xs text-gray-500">participants</p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500 italic text-center py-8">Aucune activité à venir</p>
                )}
            </div>

            {/* Salle de sport */}
            {user.company && (
                <div className="bg-gradient-to-r from-[#0a1128] to-[#14213d] rounded-xl p-6 shadow-lg text-white">
                    <h3 className="text-lg font-semibold mb-2">🏋️ Ma salle de sport</h3>
                    <p className="text-2xl font-bold text-[#dc5f18]">{user.company.name}</p>
                    <p className="text-gray-300">{user.company.city}</p>
                    <button
                        onClick={() => navigate(`/companies/${user.company?.id}`)}
                        className="mt-4 bg-[#dc5f18] hover:bg-[#ff7b3d] text-white font-semibold py-2 px-6 rounded-lg transition-all"
                    >
                        Voir la salle
                    </button>
                </div>
            )}

            {/* Actions rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <button
                    onClick={() => navigate('/activities')}
                    className="bg-gradient-to-r from-[#dc5f18] to-[#ff7b3d] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                    🔍 Voir toutes les activités
                </button>
                <button
                    onClick={() => navigate('/coaches')}
                    className="bg-gradient-to-r from-[#0a1128] to-[#14213d] text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all"
                >
                    👥 Voir les autres coaches
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

export default CoachDashboard;
