import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import SEO from '../components/SEO';
import { MapPin, Building2, CheckCircle } from 'lucide-react';
import type {Company, User} from '../types';
import {getMediaUrl} from "../utils/media.ts";

const ITEMS_PER_PAGE = 12;

const CoachesPage: React.FC = () => {
    const [coaches, setCoaches] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [activeFilter, setActiveFilter] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);



    const getCoachDisplayName = (coach: User): string => {
        if (coach.first_name && coach.last_name) {
            return `${coach.first_name} ${coach.last_name}`;
        }
        if (coach.first_name) {
            return coach.first_name;
        }
        if (coach.last_name) {
            return coach.last_name;
        }
        return coach.username;
    };

    useEffect(() => {
        const fetchCoaches = async () => {
            setLoading(true);
            try {
                // Récupérer tous les utilisateurs et filtrer les coaches
                const response = await axiosInstance.get<User[]>('/api/users/');
                const coachesOnly = response.data.filter(user => user.type === 'coach');

                // Pour chaque coach qui a une company, récupérer ses infos complètes
                const coachesWithCompanies = await Promise.all(
                    coachesOnly.map(async (coach) => {
                        if (coach.company && typeof coach.company === 'number') {
                            try {
                                const companyResponse = await axiosInstance.get<Company>(`/companies/${coach.company}/`);
                                return { ...coach, company: companyResponse.data };
                            } catch (err) {
                                console.error(`Erreur lors de la récupération de la salle ${coach.company}:`, err);
                                return coach; // Retourner le coach sans les infos de la company
                            }
                        }
                        return coach;
                    })
                );

                setCoaches(coachesWithCompanies);

            } catch (error) {
                console.error("Erreur lors du chargement des coaches:", error);
                alert('Erreur lors du chargement des coaches.');
            } finally {
                setLoading(false);
            }
        };


        fetchCoaches();
    }, []);

    const filtered = useMemo(() => {
        return coaches.filter(coach => {
            // Filtre par recherche
            if (searchTerm) {
                const lowercasedSearchTerm = searchTerm.toLowerCase();
                const nameMatches = getCoachDisplayName(coach).toLowerCase().includes(lowercasedSearchTerm);
                const usernameMatches = coach.username.toLowerCase().includes(lowercasedSearchTerm);
                if (!nameMatches && !usernameMatches) {
                    return false;
                }
            }

            // Filtre par ville (via company)
            if (cityFilter && (!coach.company || coach.company.city !== cityFilter)) {
                return false;
            }

            // Filtre par statut actif
            if (activeFilter !== null && coach.is_active !== activeFilter) {
                return false;
            }

            return true;
        });
    }, [coaches, searchTerm, cityFilter, activeFilter]);

    const displayed = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    const cities = useMemo(() => {
        const citiesSet = new Set<string>();
        coaches.forEach(coach => {
            if (coach.company?.city) {
                citiesSet.add(coach.company.city);
            }
        });
        return Array.from(citiesSet);
    }, [coaches]);

    if (loading) return <div className="p-6 text-center">Chargement…</div>;

    return (
        <>
            <SEO
                title="Tous les Coachs Sportifs"
                description={`Découvrez ${coaches.length} coachs sportifs professionnels. Trouvez le coach idéal pour vos objectifs et consultez leurs activités et disponibilités.`}
            />

            <div className="min-h-screen bg-[#C7C5C5] py-10 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-[#0a1128] mb-6">Tous nos Coachs</h1>

                    {/* Filtres */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Rechercher un coach..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                        />

                        <select
                            value={cityFilter}
                            onChange={e => setCityFilter(e.target.value)}
                            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                        >
                            <option value="">Toutes les villes</option>
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>

                        <select
                            value={activeFilter === null ? '' : activeFilter.toString()}
                            onChange={e => setActiveFilter(e.target.value === '' ? null : e.target.value === 'true')}
                            className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                        >
                            <option value="">Tous les coaches</option>
                            <option value="true">✅ Actifs uniquement</option>
                            <option value="false">Inactifs uniquement</option>
                        </select>
                    </div>

                    {/* Compteur de résultats */}
                    <p className="text-gray-600 mb-4">
                        {filtered.length} coach{filtered.length > 1 ? 'es' : ''} trouvé{filtered.length > 1 ? 's' : ''}
                    </p>

                    {/* Grille des coaches */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                        {displayed.map(coach => (
                            <Link
                                to={`/coaches/${coach.id}`}
                                key={coach.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                            >
                                {/* Avatar du coach */}
                                <div className="relative">
                                    <img
                                        src={getMediaUrl(coach.avatar) || '/src/assets/avatars/default-avatar.png'}
                                        alt={getCoachDisplayName(coach)}
                                        className="w-full h-48 object-cover"
                                    />
                                    {/* Badge Actif */}
                                    {coach.is_active && (
                                        <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
                                            <CheckCircle className="w-3 h-3" />
                                            Actif
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h2 className="text-xl font-bold text-[#0a1128] mb-1">
                                        {getCoachDisplayName(coach)}
                                    </h2>
                                    <p className="text-sm text-gray-500 mb-3">@{coach.username}</p>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        {/* Salle de sport */}
                                        {coach.company && (
                                            <div className="flex items-center gap-2">
                                                <Building2 className="w-4 h-4 text-[#dc5f18]" />
                                                <span className="truncate">{coach.company.name}</span>
                                            </div>
                                        )}

                                        {/* Ville */}
                                        {coach.company?.city && (
                                            <div className="flex items-center gap-2">
                                                <MapPin className="w-4 h-4 text-[#dc5f18]" />
                                                <span>{coach.company.city}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bouton d'action */}
                                    <button className="mt-4 w-full bg-[#dc5f18] text-white py-2 rounded-lg font-semibold hover:bg-[#b84f14] transition-colors">
                                        Voir le profil
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Message si aucun coach trouvé */}
                    {filtered.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-600">Aucun coach ne correspond à vos critères.</p>
                        </div>
                    )}

                    {/* Pagination */}
                    {pageCount > 1 && (
                        <div className="flex justify-center items-center gap-4">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-4 py-2 bg-[#0a1128] text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Précédent
                            </button>
                            <span className="text-gray-700">
                                Page {currentPage} sur {pageCount}
                            </span>
                            <button
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, pageCount))}
                                disabled={currentPage === pageCount}
                                className="px-4 py-2 bg-[#0a1128] text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed"
                            >
                                Suivant
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CoachesPage;
