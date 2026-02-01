import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import type { Activity, User } from '../types';
import { getMediaUrl } from '../utils/media';

// Importation des icônes pour un design plus riche
import { MapPin, Globe, User as UserIcon, BookOpen } from 'lucide-react';
import SEO from "../components/SEO.tsx";

// ============================================
// 🔧 TYPES LOCAUX
// ============================================

interface Company {
    id: number;
    name: string;
    description: string | null;
    logo: string | null;
    address: string;
    city: string;
    phone_number: string;
    website: string;
    sport_zen: boolean;
}

const CompanyDetailPage: React.FC = () => {
    // 1. Récupération de l'ID de la salle de sport depuis l'URL
    const { id } = useParams<{ id: string }>();
    const [company, setCompany] = useState<Company | null>(null);
    const [coaches, setCoaches] = useState<User[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 2. Effet pour récupérer les données lors du chargement du composant
    useEffect(() => {
        if (!id) {
            setError("ID de salle de sport non fourni.");
            setLoading(false);
            return;
        }

        // ✅ Faire 3 appels API en parallèle
        Promise.all([
            axiosInstance.get<Company>(`/companies/${id}/`),
            axiosInstance.get<User[]>(`/companies/${id}/coaches/`),
            axiosInstance.get<Activity[]>(`/companies/${id}/activities/`)
        ])
            .then(([companyResponse, coachesResponse, activitiesResponse]) => {
                setCompany(companyResponse.data);
                setCoaches(coachesResponse.data);
                setActivities(activitiesResponse.data);
            })
            .catch(err => {
                console.error("Erreur lors du chargement de la salle de sport", err);
                setError("Les informations de la salle de sport n'ont pas pu être chargées.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]); // Le useEffect se redéclenche si l'ID change

    // 3. Gestion des états de chargement et d'erreur
    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="text-xl text-gray-600">Chargement de la salle de sport...</div>
            </div>
        );
    }
    console.log("activities",activities)
    if (error || !company) {
        return (
            <div className="min-h-screen flex justify-center items-center text-red-500 text-xl">
                {error || "Salle de sport non trouvée."}
            </div>
        );
    }

    // ✅ Helper pour afficher le nom complet d'un coach
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

    // 4. Rendu du composant avec les données récupérées
    return (
        <>
            <SEO
            title={company.name}
            description={company.description || `${company.name} - Salle de sport à ${company.city}. Découvrez nos ${activities.length} activités sportives et notre équipe de ${coaches.length} coachs professionnels. Réservez votre séance dès maintenant !`}
            />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-6xl mx-auto py-12 px-4">

                    {/* En-tête de la page avec logo, nom et description */}
                    <header className="flex flex-col md:flex-row items-center bg-white p-8 rounded-xl shadow-md mb-10">
                        {/* ✅ Correction de l'image avec fallback */}
                        <img
                            src={getMediaUrl(company.logo) || '/images/logo.png'}
                            alt={`Logo de ${company.name}`}
                            className="w-32 h-32 rounded-full object-cover mr-0 md:mr-8 mb-6 md:mb-0 border-4 border-gray-200"
                        />

                        <div className="text-center md:text-left">
                            <h1 className="text-4xl font-extrabold text-[#0a1128] mb-2">{company.name}</h1>
                            {company.sport_zen && (
                                <div className="inline-flex items-center bg-gradient-to-r from-green-400 to-blue-500 text-white px-4 py-1 rounded-full text-sm font-semibold mb-3 shadow-md">
                                    <span className="mr-2">🧘</span>
                                    Sport Zen Partner
                                </div>
                            )}
                            {company.description && <p className="text-lg text-gray-600">{company.description}</p>}

                            {/* Informations de contact */}
                            <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-2 mt-4 text-gray-500">
                                {company.address && (
                                    <div className="flex items-center">
                                        <MapPin size={16} className="mr-2" /> {company.address}, {company.city}
                                    </div>
                                )}
                                {company.phone_number && (
                                    <div className="flex items-center">
                                        📞 {company.phone_number}
                                    </div>
                                )}
                                {company.website && (
                                    <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-center text-[#dc5f18] hover:underline">
                                        <Globe size={16} className="mr-2" /> Visiter le site web
                                    </a>
                                )}
                            </div>
                        </div>
                    </header>

                    {/* Section des Coachs */}
                    <section className="mb-10">
                        <h2 className="text-3xl font-bold text-[#0a1128] mb-6 flex items-center">
                            <UserIcon size={28} className="mr-3 text-[#dc5f18]" />
                            Nos Coachs
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {coaches && coaches.length > 0 ? (
                                coaches.map(coach => (
                                    <Link to={`/coaches/${coach.id}`} key={coach.id} className="text-center group">
                                        {/* ✅ Correction de l'image avec fallback */}
                                        <img
                                            src={getMediaUrl(coach.avatar) ||'/src/assets/avatars/default-avatar.png'}
                                            alt={getCoachDisplayName(coach)}
                                            className="w-24 h-24 rounded-full object-cover mx-auto mb-2 border-2 border-transparent group-hover:border-[#dc5f18] transition-all"
                                        />
                                        {/* ✅ Affichage du nom complet */}
                                        <p className="font-semibold text-gray-800 group-hover:text-[#dc5f18]">
                                            {getCoachDisplayName(coach)}
                                        </p>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-500 col-span-full text-center py-4">
                                    Aucun coach n'est actuellement associé à cette salle de sport.
                                </p>
                            )}
                        </div>
                    </section>

                    {/* Section des Activités */}
                    <section>
                        <h2 className="text-3xl font-bold text-[#0a1128] mb-6 flex items-center">
                            <BookOpen size={28} className="mr-3 text-[#dc5f18]" />
                            Nos Activités
                        </h2>
                        <div className="space-y-4">
                            {activities && activities.length > 0 ? (
                                activities.map(activity => (
                                    <Link
                                        to={`/activities/${activity.id}`}
                                        key={activity.id}
                                        className="block bg-white p-4 rounded-lg shadow-sm hover:shadow-lg hover:scale-[1.01] transition-all"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="font-bold text-lg text-[#0a1128]">{activity.name}</h3>
                                                <p className="text-sm text-gray-600">
                                                    {new Date(activity.start_time).toLocaleDateString('fr-FR', {
                                                        weekday: 'long',
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                    {' à '}
                                                    {new Date(activity.start_time).toLocaleTimeString('fr-FR', {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                                {activity.instructor && (
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        Coach : {activity.instructor.first_name && activity.instructor.last_name
                                                        ? `${activity.instructor.first_name} ${activity.instructor.last_name}`
                                                        : activity.instructor.username}
                                                    </p>
                                                )}
                                            </div>
                                            <div className="text-right">
                                                <span className="font-semibold text-lg text-[#dc5f18]">{activity.price} €</span>
                                                <p className="text-sm text-gray-500">
                                                    {activity.participants_count}/{activity.max_participants} places
                                                </p>
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-gray-500 text-center py-4">
                                    Aucune activité n'est actuellement proposée par cette salle de sport.
                                </p>
                            )}
                        </div>
                    </section>

                </div>
            </div>
        </>
    );
};

export default CompanyDetailPage;
