import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import SEO from '../components/SEO';
import { MapPin, Globe } from 'lucide-react';
import type { Company } from '../types';
import {getMediaUrl} from "../utils/media.ts";

const ITEMS_PER_PAGE = 12;

const CompaniesPage: React.FC = () => {
    const [companies, setCompanies] = useState<Company[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [sportZenFilter, setSportZenFilter] = useState<boolean | null>(null);
    const [currentPage, setCurrentPage] = useState(1);



    useEffect(() => {
        const fetchCompanies = async () => {
            setLoading(true);
            try {
                const response = await axiosInstance.get<Company[]>('/api/companies/');
                setCompanies(response.data);

            } catch (error) {
                console.error("Erreur lors du chargement des salles de sport:", error);
                alert('Erreur lors du chargement des salles de sport.');
            } finally {
                setLoading(false);
            }
        };

        fetchCompanies();
    }, []);

    const filtered = useMemo(() => {
        return companies.filter(company => {
            // Filtre par recherche
            if (searchTerm) {
                const lowercasedSearchTerm = searchTerm.toLowerCase();
                const nameMatches = company.name.toLowerCase().includes(lowercasedSearchTerm);
                const descriptionMatches = company.description
                    ? company.description.toLowerCase().includes(lowercasedSearchTerm)
                    : false;
                if (!nameMatches && !descriptionMatches) {
                    return false;
                }
            }

            // Filtre par ville
            if (cityFilter && company.city !== cityFilter) {
                return false;
            }

            // Filtre Sport Zen
            if (sportZenFilter !== null && company.sport_zen !== sportZenFilter) {
                return false;
            }

            return true;
        });
    }, [companies, searchTerm, cityFilter, sportZenFilter]);

    const displayed = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);
    const pageCount = Math.ceil(filtered.length / ITEMS_PER_PAGE);

    const cities = useMemo(() => Array.from(new Set(companies.map(c => c.city))), [companies]);

    if (loading) return <div className="p-6 text-center">Chargement…</div>;

    return (
        <>
            <SEO
                title="Nos Salles de Sport et Clubs de Fitness | SportRadar"
                description="Découvrez les meilleures salles de sport, studios de yoga et clubs de fitness partenaires de SportRadar. Comparez les équipements et trouvez le lieu idéal pour vos entraînements !"
                keywords="salle de sport, club fitness, studio yoga, centre sportif, salle de musculation, réserver salle de sport, club de boxe, sportradar"
            />

            <div className="min-h-screen bg-[#C7C5C5] py-10 px-4">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-4xl font-bold text-[#0a1128] mb-6">Toutes nos Salles de Sport</h1>

                    {/* Filtres */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <input
                            type="text"
                            placeholder="Rechercher une salle..."
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
                    <h2 className="text-gray-600 mb-4">
                        {filtered.length} salle{filtered.length > 1 ? 's' : ''} trouvée{filtered.length > 1 ? 's' : ''}
                    </h2>

                    {/* Grille des salles de sport */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-6">
                        {displayed.map(company => (
                            <Link
                                to={`/companies/${company.id}`}
                                key={company.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                            >
                                {/* Logo de la salle */}
                                <div className="relative">
                                    <img
                                        src={getMediaUrl(company.logo) || '/images/logo.png'}
                                        alt={company.name}
                                        className="w-full h-48 object-cover"
                                    />
                                    <img
                                        src={company.logo ? getMediaUrl(company.logo) : '/avatar4.png'}
                                        alt={company.logo|| 'logo'}
                                        className="w-12 h-12 rounded-full object-cover mr-4" // CORRECTION 3: Taille d'avatar plus appropriée
                                        onError={(event) => {
                                            const target = event.currentTarget;
                                            if (target.src.includes('avatar4.png')) return;
                                            target.src = '/avatar4.png';
                                            target.onerror = null;
                                        }}
                                    />
                                    {/* Badge Sport Zen */}
                                    {company.sport_zen && (
                                        <div className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                                            🧘 Sport Zen
                                        </div>
                                    )}
                                </div>

                                <div className="p-4">
                                    <h2 className="text-xl font-bold text-[#0a1128] mb-2">{company.name}</h2>

                                    {company.description && (
                                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{company.description}</p>
                                    )}

                                    <div className="space-y-2 text-sm text-gray-600">
                                        {/* Ville */}
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-[#dc5f18]" />
                                            <span>{company.address}</span>
                                        </div>

                                        {/* Site web */}
                                        {company.website && (
                                            <div className="flex items-center gap-2">
                                                <Globe className="w-4 h-4 text-[#dc5f18]" />
                                                <span className="truncate">{company.website}</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Bouton d'action */}
                                    <button className="mt-4 w-full bg-[#dc5f18] text-[#0A1128] py-2 rounded-lg font-semibold hover:bg-[#b84f14] transition-colors">
                                        Voir la salle
                                    </button>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Message si aucune salle trouvée */}
                    {filtered.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-xl text-gray-600">Aucune salle de sport ne correspond à vos critères.</p>
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

export default CompaniesPage;
