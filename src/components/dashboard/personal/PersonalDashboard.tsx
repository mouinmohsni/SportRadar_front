// File: src/components/dashboard/personal/PersonalDashboard.tsx
import React, { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Activity as ActivityIcon, Clock, MapPin, User as UserIcon } from 'lucide-react';
import {
    AreaChart,
    Area,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import CountUp from 'react-countup';
import axiosInstance from '../../../api/axiosInstance';
import type { Booking, User } from '../../../types';
import { Link } from "react-router-dom";
import RecommendationsSection from "./RecommendationsSection.tsx";

interface Stats {
    totalBookings: number;
    upcomingBookings: number;
    completedBookings: number;
    totalHours: number;
}

interface PersonalDashboardProps {
    user: User;
}

const PersonalDashboard: React.FC<PersonalDashboardProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [stats, setStats] = useState<Stats>({
        totalBookings: 0,
        upcomingBookings: 0,
        completedBookings: 0,
        totalHours: 0
    });
    const [loading, setLoading] = useState(true);
    const [activityData, setActivityData] = useState<any[]>([]);
    const [monthlyDurationData, setMonthlyDurationData] = useState<any[]>([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);

            // Récupérer les réservations
            const bookingsResponse = await axiosInstance.get<Booking[]>('/bookings/');
            const bookingsData = bookingsResponse.data;
            setBookings(bookingsData);

            // Calculer les statistiques
            const now = new Date();
            const upcoming = bookingsData.filter((b: Booking) =>
                new Date(b.activity.start_time) > now && b.status !== 'cancelled'
            );
            const completed = bookingsData.filter((b: Booking) =>
                b.status === 'completed' || (new Date(b.activity.start_time) < now && b.status === 'confirmed')
            );

            // Calculer les heures totales (duration est en format "HH:MM:SS")
            const totalMinutes = bookingsData.reduce((sum: number, b: Booking) => {
                const duration = b.activity.duration;
                const [hours, minutes] = duration.split(':').map(Number);
                return sum + (hours * 60 + minutes);
            }, 0);
            const totalHours = Math.round(totalMinutes / 60);

            setStats({
                totalBookings: bookingsData.length,
                upcomingBookings: upcoming.length,
                completedBookings: completed.length,
                totalHours
            });

            // Générer les données pour les graphiques
            generateActivityData(bookingsData);
            generateMonthlyDurationData(bookingsData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const generateActivityData = (bookings: Booking[]) => {
        const last7Days = Array.from({ length: 7 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - (6 - i));
            return date;
        });

        const data = last7Days.map(date => {
            const dayBookings = bookings.filter((b: Booking) => {
                const activityDate = new Date(b.activity.start_time);
                return activityDate.toDateString() === date.toDateString();
            });

            return {
                date: date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' }),
                activites: dayBookings.length
            };
        });

        setActivityData(data);
    };

    const generateMonthlyDurationData = (bookings: Booking[]) => {
        const last6Months = Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setMonth(date.getMonth() - (5 - i));
            return date;
        });

        const data = last6Months.map(date => {
            const monthBookings = bookings.filter((b: Booking) => {
                const activityDate = new Date(b.activity.start_time);
                return (
                    activityDate.getMonth() === date.getMonth() &&
                    activityDate.getFullYear() === date.getFullYear()
                );
            });

            // Calculer les heures pour ce mois
            const monthMinutes = monthBookings.reduce((sum, b) => {
                const duration = b.activity.duration;
                const [hours, minutes] = duration.split(':').map(Number);
                return sum + (hours * 60 + minutes);
            }, 0);

            return {
                mois: date.toLocaleDateString('fr-FR', { month: 'short' }),
                heures: Math.round(monthMinutes / 60 * 10) / 10 // Arrondi à 1 décimale
            };
        });

        setMonthlyDurationData(data);
    };

    const getUpcomingBookings = () => {
        const now = new Date();
        return bookings
            .filter(b => new Date(b.activity.start_time) > now && b.status !== 'cancelled')
            .sort((a, b) => new Date(a.activity.start_time).getTime() - new Date(b.activity.start_time).getTime());
    };

    const getPastBookings = () => {
        const now = new Date();
        return bookings
            .filter(b => new Date(b.activity.start_time) <= now || b.status === 'completed')
            .sort((a, b) => new Date(b.activity.start_time).getTime() - new Date(a.activity.start_time).getTime());
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (status: Booking['status']) => {
        const badges = {
            pending: 'bg-yellow-100 text-yellow-700',
            confirmed: 'bg-green-100 text-green-700',
            cancelled: 'bg-red-100 text-red-700'
        };
        const labels = {
            pending: 'En attente',
            confirmed: 'Confirmé',
            cancelled: 'Annulé'
        };
        return (
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[status]}`}>
                {labels[status]}
            </span>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#dc5f18]"></div>
            </div>
        );
    }

    const displayedBookings = activeTab === 'upcoming' ? getUpcomingBookings() : getPastBookings();

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0a1128] to-[#1a2148] rounded-xl p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">Tableau de bord</h1>
                <p className="text-white/80">Bienvenue {user.first_name} ! Voici un aperçu de votre activité sportive</p>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total réservations */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        <CountUp end={stats.totalBookings} duration={2} />
                    </div>
                    <div className="text-sm text-gray-600">Réservations totales</div>
                </div>

                {/* À venir */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                            <ActivityIcon className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        <CountUp end={stats.upcomingBookings} duration={2} />
                    </div>
                    <div className="text-sm text-gray-600">Activités à venir</div>
                </div>

                {/* Complétées */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <ActivityIcon className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        <CountUp end={stats.completedBookings} duration={2} />
                    </div>
                    <div className="text-sm text-gray-600">Activités complétées</div>
                </div>

                {/* Heures totales */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                            <Clock className="w-6 h-6 text-orange-600" />
                        </div>
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">
                        <CountUp end={stats.totalHours} duration={2} />h
                    </div>
                    <div className="text-sm text-gray-600">Heures d'activité</div>
                </div>
            </div>

            {/* Graphiques côte à côte */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Graphique 1 : Activités des 7 derniers jours */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Activités des 7 derniers jours</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <AreaChart data={activityData}>
                            <defs>
                                <linearGradient id="colorActivites" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#dc5f18" stopOpacity={0.3}/>
                                    <stop offset="95%" stopColor="#dc5f18" stopOpacity={0}/>
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="date" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                            />
                            <Area
                                type="monotone"
                                dataKey="activites"
                                stroke="#dc5f18"
                                strokeWidth={2}
                                fill="url(#colorActivites)"
                                name="Activités"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>

                {/* Graphique 2 : Durée par mois (6 derniers mois) */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">⏱️ Durée par mois (6 derniers mois)</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={monthlyDurationData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="mois" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: 'white',
                                    border: '1px solid #e5e7eb',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                }}
                                formatter={(value: any) => [`${value}h`, 'Durée']}
                            />
                            <Bar
                                dataKey="heures"
                                fill="#0a1128"
                                radius={[8, 8, 0, 0]}
                                name="Heures"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            <RecommendationsSection />
            {/* Mes réservations avec onglets */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">Mes réservations</h3>
                    <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                        <button
                            onClick={() => setActiveTab('upcoming')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                activeTab === 'upcoming'
                                    ? 'bg-white text-[#dc5f18] shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            À venir ({stats.upcomingBookings})
                        </button>
                        <button
                            onClick={() => setActiveTab('past')}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                activeTab === 'past'
                                    ? 'bg-white text-[#dc5f18] shadow-sm'
                                    : 'text-gray-600 hover:text-gray-900'
                            }`}
                        >
                            Passées ({stats.completedBookings})
                        </button>
                    </div>
                </div>

                {/* Liste des réservations */}
                {displayedBookings.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p className="font-medium">Aucune réservation {activeTab === 'upcoming' ? 'à venir' : 'passée'}</p>
                        <p className="text-sm mt-1">
                            {activeTab === 'upcoming'
                                ? 'Réservez une activité pour commencer !'
                                : 'Vos activités passées apparaîtront ici'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {displayedBookings.map(booking => (
                            <div
                                key={booking.id}
                                className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#dc5f18] hover:shadow-md transition-all"
                            >
                                {/* Icône */}
                                <div className="w-12 h-12 bg-gradient-to-br from-[#dc5f18] to-[#ff7a3d] rounded-lg flex items-center justify-center flex-shrink-0">
                                    <ActivityIcon className="w-6 h-6 text-white" />
                                </div>

                                {/* Infos */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-bold text-gray-900">{booking.activity.name}</h4>
                                        {getStatusBadge(booking.status)}
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="w-4 h-4" />
                                            <span>{formatDate(booking.activity.start_time)}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-4 h-4" />
                                            <span>{booking.activity.duration}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{booking.activity.company.name} - {booking.activity.company.city}</span>
                                        </div>
                                        {booking.activity.instructor && (
                                            <div className="flex items-center gap-1">
                                                <UserIcon className="w-4 h-4" />
                                                <span>
                                                    {booking.activity.instructor.first_name} {booking.activity.instructor.last_name}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                {activeTab === 'upcoming' && booking.status === 'confirmed' && (
                                    <Link to={`/activities/${booking.activity.id}`} className="hover:text-[#dc5f18] transition-colors">
                                        <p className="px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                                            Annuler
                                        </p>
                                    </Link>
                                )}
                                {activeTab === 'past' && booking.status === 'confirmed' && (
                                    <Link to={`/activities/${booking.activity.id}`} className="hover:text-[#dc5f18] transition-colors">
                                        <p className="px-4 py-2 text-sm font-medium text-[#dc5f18] hover:bg-orange-50 rounded-lg transition-colors">
                                            Noter
                                        </p>
                                    </Link>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PersonalDashboard;
