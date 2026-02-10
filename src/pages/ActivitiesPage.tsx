import React, {useState, useEffect, useMemo} from 'react';
import {Link, useNavigate} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import {useAuth} from '../contexts/AuthContext';
import CountUp from 'react-countup';
import {getMediaUrl} from '../utils/media.ts'
import {
    MapPin,
    Calendar as CalendarIcon,
    Clock,
    Users,
    Star,
    User as UserIcon
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    ResponsiveContainer
} from 'recharts';
import SEO from '../components/SEO';

import type {Activity, Booking} from '../types';

const ITEMS_PER_PAGE = 9;

const ActivitiesPage: React.FC = () => {
    const navigate = useNavigate();
    const {isAuthenticated,user} = useAuth();
    const [activities, setActivities] = useState<Activity[]>([]);
    const [registrations, setRegistrations] = useState<Map<number, number>>(new Map());
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    // ✅ Helper pour les images avec fallback


    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [selectedLevel, setSelectedLevel] = useState<string>('');
    const [sportZenFilter, setSportZenFilter] = useState<boolean | null>(null);

    useEffect(() => {
        const fetchActivitiesAndBookings = async () => {
            setLoading(true);
            try {
                const allActivitiesRes = await axiosInstance.get<Activity[]>('/api/activities/');
                console.log("allActivitiesRes.data", allActivitiesRes.data)
                setActivities(allActivitiesRes.data);

                if (isAuthenticated) {
                    const myBookingsRes = await axiosInstance.get<Booking[]>('/api/bookings/');
                    const registrationMap = new Map<number, number>();
                    myBookingsRes.data.forEach(booking => {
                        registrationMap.set(booking.activity.id, booking.id);
                    });
                    setRegistrations(registrationMap);
                }
            } catch (error) {
                console.error("Erreur lors du chargement des données:", error);
                alert('Erreur lors du chargement des données.');
            } finally {
                setLoading(false);
            }
        };

        fetchActivitiesAndBookings();
    }, [isAuthenticated]);

    const filtered = useMemo(() => {
        // ... la logique de filtrage à l'intérieur ne change pas ...
        return activities
            .filter(activity => {
                if (searchTerm) {
                    const lowercasedSearchTerm = searchTerm.toLowerCase();
                    const nameMatches = activity.name.toLowerCase().includes(lowercasedSearchTerm);
                    const descriptionMatches = activity.description ? activity.description.toLowerCase().includes(lowercasedSearchTerm) : false;
                    if (!nameMatches && !descriptionMatches) {
                        return false;
                    }
                }
                if (categoryFilter && activity.category !== categoryFilter) return false;
                if (locationFilter && activity.effective_location !== locationFilter) return false;

                // Cette logique est correcte, le problème n'était pas ici
                if (sportZenFilter !== null && activity.sport_zen !== sportZenFilter) {
                    return false;
                }

                return !(dateFilter && !activity.start_time.startsWith(dateFilter));
            })
            .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
    }, [activities, searchTerm, categoryFilter, locationFilter, dateFilter, sportZenFilter]); // ✅ AJOUTEZ sportZenFilter ICI


    const displayed = showAll
        ? filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)
        : filtered.slice(0, 3);
    const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);
    const levels = useMemo(() => Array.from(new Set(activities.map(a => a.level))), [activities]);

    useEffect(() => {
        if (!selectedLevel && levels.length) {
            setSelectedLevel(levels[0]);
        }
    }, [levels, selectedLevel]);

    const podiumData = useMemo(() => {
        const byName: Record<string, number> = {};
        activities
            .filter(a => a.level === selectedLevel)
            .forEach(a => {
                byName[a.name] = (byName[a.name] || 0) + 1;
            });
        return Object.entries(byName)
            .map(([name, count]) => ({name, count}))
            .sort((a, b) => b.count - a.count)
            .slice(0, 3);
    }, [activities, selectedLevel]);

    const monthlyActivity = useMemo(() => {
        const map = new Map<string, number>();
        activities.forEach(a => {
            const month = a.start_time.slice(0, 7);
            map.set(month, (map.get(month) || 0) + 1);
        });
        return Array.from(map.entries())
            .map(([month, count]) => ({month, count}))
            .sort((a, b) => a.month.localeCompare(b.month));
    }, [activities]);

    const totalActivities = activities.length;

    const handleRegisterClick = async (act: Activity) => {
        if (!isAuthenticated) {
            navigate('/login', {state: {from: '/activities'}});
            return;
        }
        try {
            const isRegistered = registrations.has(act.id);
            if (isRegistered) {
                const bookingId = registrations.get(act.id);
                await axiosInstance.delete(`/api/bookings/${bookingId}/`);
                setRegistrations(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(act.id);
                    return newMap;
                });
                setActivities(prev => prev.map(a => a.id === act.id ? {
                    ...a,
                    participants_count: a.participants_count - 1
                } : a));
            } else {
                const response = await axiosInstance.post<Booking>('/api/bookings/', {
                    activity: act.id
                });
                const newBooking = response.data;
                setRegistrations(prev => {
                    const newMap = new Map(prev);
                    newMap.set(act.id, newBooking.id);
                    return newMap;
                });
                setActivities(prev => prev.map(a => a.id === act.id ? {
                    ...a,
                    participants_count: a.participants_count + 1
                } : a));
            }
        } catch (error) {
            console.error("Erreur lors de la mise à jour de l'inscription:", error);
            alert('Erreur lors de la mise à jour de votre inscription.');
        }
    };

    // ✅ Helper pour afficher le nom du coach
    const getCoachDisplayName = (instructor: Activity['instructor']): string => {
        if (!instructor) return 'Non assigné';
        if (instructor.first_name && instructor.last_name) {
            return `${instructor.first_name} ${instructor.last_name}`;
        }
        if (instructor.first_name) {
            return instructor.first_name;
        }
        if (instructor.last_name) {
            return instructor.last_name;
        }
        return instructor.username;
    };

    if (loading) return <div className="p-6 text-center">Chargement…</div>;

    return (
        <>
            <SEO
                title="Toutes les Activités - Réservez votre séance"
                description="Parcourez, filtrez et trouvez l'activité sportive parfaite pour vous parmi notre sélection. Réservez votre place en quelques clics et commencez votre parcours bien-être."
            />

            <div className="min-h-screen bg-[#C7C5C5] py-10 px-4">
                <div className="max-w-6xl mx-auto">

                    <h1 className="text-4xl font-bold text-[#0a1128] mb-6">Toutes nos Activités</h1>

                    {/* Filtres */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Recherche libre..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                        />
                        <select
                            value={categoryFilter}
                            onChange={e => setCategoryFilter(e.target.value)}
                            className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                        >
                            <option value="">Toutes catégories</option>
                            {[...new Set(activities.map(a => a.category))].map(c => (
                                <option key={c} value={c}>{c}</option>
                            ))}
                        </select>
                        <select
                            value={locationFilter}
                            onChange={e => setLocationFilter(e.target.value)}
                            className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                        >
                            <option value="">Tous lieux</option>
                            {[...new Set(activities.map(a => a.effective_location))].map(l => (
                                <option key={l} value={l}>{l}</option>
                            ))}
                        </select>
                        <input
                            type="date"
                            value={dateFilter}
                            onChange={e => setDateFilter(e.target.value)}
                            className="p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                        />
                        <select
                            value={sportZenFilter === null ? '' : sportZenFilter.toString()}
                            onChange={e => setSportZenFilter(e.target.value === '' ? null : e.target.value === 'true')}
                            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                        >
                            <option value="">Toutes les salles</option>
                            <option value="true">🧘 Sport Zen uniquement</option>
                            <option value="false">Salles standard</option>
                        </select>
                    </div>

                    {/* Compteur de résultats */}
                    <p className="text-gray-600 mb-4">
                        {filtered.length} activité{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
                    </p>

                    {/* Grille des activités */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {displayed.map(act => {
                            const isFull = act.participants_count >= act.max_participants;
                            const isReg = registrations.has(act.id);
                            return (
                                <div key={act.id}
                                     className="bg-white rounded-2xl shadow-lg flex flex-col overflow-hidden hover:shadow-2xl transition-shadow">                                    {/* ✅ Image avec fallback */}
                                    <div className="relative">
                                        <img
                                            src={getMediaUrl(act.image) || '/images/activity-default.jpg'} // Assurez-vous que ce chemin est correct
                                            alt={act.name}
                                            className="w-full h-48 object-cover"
                                            onError={(event) => {
                                                const target = event.currentTarget;
                                                if (target.src.includes('activity-default')) return;
                                                target.src = '/images/activity-default.jpg'; // Chemin de secours
                                                target.onerror = null;
                                            }}
                                        />

                                        {act.sport_zen && (
                                            <div className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                                                🧘 Sport Zen
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <div className="flex justify-between items-center mb-2">
                                                <Link to={`/activities/${act.id}`}
                                                      className="hover:text-[#dc5f18] transition-colors">
                                                    <h2 className="text-xl font-semibold text-[#0a1128]">{act.name}</h2>
                                                </Link>
                                                {act.average_score && (
                                                    <div className="flex items-center space-x-1 text-[#dc5f18]">
                                                        <Star className="w-4 h-4 fill-current"/>
                                                        <span className="font-semibold">{act.average_score}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <ul className="text-sm text-gray-600 space-y-1 mb-4">
                                                <li className="flex items-center gap-2">
                                                    <MapPin className="w-4 h-4"/> {act.effective_location}
                                                </li>
                                                {/* ✅ Affichage du coach */}
                                                {act.instructor && (
                                                    <li className="flex items-center gap-2">
                                                        <UserIcon className="w-4 h-4"/>
                                                        <Link
                                                            to={`/coaches/${act.instructor.id}`}
                                                            className="hover:text-[#dc5f18] transition-colors"
                                                        >
                                                            {getCoachDisplayName(act.instructor)}
                                                        </Link>
                                                    </li>
                                                )}
                                                <li className="flex items-center gap-2">
                                                    <CalendarIcon className="w-4 h-4"/>
                                                    {new Date(act.start_time).toLocaleDateString('fr-FR', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Clock className="w-4 h-4"/>
                                                    {new Date(act.start_time).toLocaleTimeString('fr-FR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })} • {act.duration.slice(0, 5)}
                                                </li>
                                                <li className="flex items-center gap-2">
                                                    <Users className="w-4 h-4"/>
                                                    {act.participants_count}/{act.max_participants}
                                                    {isFull && !isReg && (
                                                        <span className="ml-2 text-red-600 font-semibold">Complet</span>
                                                    )}
                                                </li>
                                                <li><strong>Prix :</strong> {act.price}€</li>
                                            </ul>
                                        </div>
                                        {user?.type === 'personal' ? (
                                            // CAS 1 : L'utilisateur est un client ("personal")
                                            <button
                                                onClick={() => handleRegisterClick(act)}
                                                disabled={isFull && !isReg}
                                                className={`w-full py-2 rounded-lg font-semibold transition-colors ${
                                                    isReg
                                                        ? 'bg-[#ABC2D7] text-[#0a1128] hover:bg-[#9ab0c5]'
                                                        : isFull
                                                            ? 'bg-gray-200 text-gray-600 cursor-not-allowed'
                                                            : 'bg-[#dc5f18] text-white hover:bg-[#b84f14]'
                                                }`}
                                            >
                                                {isReg ? 'Se désinscrire' : isFull ? 'Complet' : "S'inscrire"}
                                            </button>
                                        ) : (
                                            // CAS 2 : L'utilisateur est un coach, un business, ou n'est pas connecté
                                            <button
                                                onClick={() => window.location.href = `/activities/${act.id}`}
                                                className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
                                            >
                                                Voir les détails
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination */}
                    {!showAll && filtered.length > 3 && (
                        <div className="text-center mb-6">
                            <button
                                onClick={() => setShowAll(true)}
                                className="px-6 py-2 bg-[#0a1128] text-white rounded-lg hover:bg-[#1a2138] transition-colors"
                            >
                                Voir la suite
                            </button>
                        </div>
                    )}
                    {showAll && pageCount > 1 && (
                        <div className="flex justify-center items-center gap-4 mb-6">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-[#0a1128] text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Précédent
                            </button>
                            <span className="text-gray-700">Page {currentPage} sur {pageCount}</span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                                disabled={currentPage === pageCount}
                                className="px-4 py-2 bg-[#0a1128] text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Suivant
                            </button>
                        </div>
                    )}

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                            <h3 className="text-2xl font-bold text-[#0a1128] mb-2">
                                <CountUp end={totalActivities} duration={2}/>
                            </h3>
                            <p className="text-gray-600">Activités disponibles</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                            <h3 className="text-2xl font-bold text-[#0a1128] mb-2">
                                <CountUp end={[...new Set(activities.map(a => a.category))].length} duration={2}/>
                            </h3>
                            <p className="text-gray-600">Catégories</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
                            <h3 className="text-2xl font-bold text-[#0a1128] mb-2">
                                <CountUp end={[...new Set(activities.map(a => a.effective_location))].length}
                                         duration={2}/>
                            </h3>
                            <p className="text-gray-600">Lieux</p>
                        </div>
                    </div>

                    {/* Graphique */}
                    {monthlyActivity.length > 0 && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                            <h3 className="text-xl font-bold text-[#0a1128] mb-4">Activités par mois</h3>
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={monthlyActivity}>
                                    <XAxis dataKey="month"/>
                                    <YAxis/>
                                    <RechartsTooltip/>
                                    <Line type="monotone" dataKey="count" stroke="#dc5f18" strokeWidth={2}/>
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    )}

                    {/* Podium */}
                    {podiumData.length > 0 && (
                        <div className="bg-white p-6 rounded-2xl shadow-lg">
                            <h3 className="text-xl font-bold text-[#0a1128] mb-4">
                                Top 3 des activités ({selectedLevel})
                            </h3>
                            <div className="space-y-3">
                                {podiumData.map((item, index) => (
                                    <div key={item.name} className="flex items-center gap-4">
                                        <div
                                            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white ${
                                                index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-600'
                                            }`}>
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-semibold text-[#0a1128]">{item.name}</p>
                                            <p className="text-sm text-gray-600">{item.count} séance{item.count > 1 ? 's' : ''}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};

export default ActivitiesPage;
