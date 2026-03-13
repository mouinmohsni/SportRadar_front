import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { getMediaUrl} from '../utils/media';
import type {Activity, Company, User} from '../types';
import SEO from '../components/SEO';


// ============================================
// 🎨 COMPOSANT PRINCIPAL
// ============================================

const CoachDetailPage: React.FC = () => {
    const {id} = useParams<{ id: string }>();
    const [coach, setCoach] = useState<User | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // ✅ Faire 2 appels API en parallèle
        Promise.all([
            axiosInstance.get<User>(`/api/coaches/${id}/`),
            axiosInstance.get<Activity[]>(`/api/activities/`)
        ])
            .then(([coachResponse, activitiesResponse]) => {
                const coachData = coachResponse.data;
                const activitiesData = activitiesResponse.data.filter(activity  => activity?.instructor?.id==id);
                console.log('Coach activities:', activitiesResponse);

                setCoach(coachData);
                setActivities(activitiesData);
                console.log("activitiesDataaaaaaaaaaa",activitiesData)
                console.log("coachDataaaaaaaaaa",coachData)

                // ✅ Si le coach a une company, récupérer ses infos
                if (coachData.company) {
                    axiosInstance.get<Company>(`/companies/${coachData.company}/`)
                        .then(companyResponse => {
                            // Mettre à jour le coach avec les infos complètes de la company
                            setCoach(prev => prev ? {...prev, company: companyResponse.data} : null);
                        })
                        .catch(err => {
                            console.error("Erreur lors de la récupération de la salle de sport:", err);
                        });
                }
            })
            .catch(err => {
                console.error(err);
                setError("Le profil du coach n'a pas pu être chargé.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [id]);


    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl text-gray-600">Chargement...</div>
            </div>
        );
    }

    if (error || !coach) {
        return (
            <div className="text-red-500 text-center p-8 text-xl">
                {error || "Coach non trouvé."}
            </div>
        );
    }

    // Helper pour formater la durée (HH:MM:SS -> "Xh Ymin")
    const formatDuration = (duration: string | null | undefined): string => {
        // ✅ SÉCURITÉ : On vérifie si la durée existe et est une chaîne de caractères.
        if (!duration || typeof duration !== 'string') {
            return 'N/A'; // On retourne une valeur par défaut si la durée est manquante.
        }

        // On continue seulement si la durée est une chaîne valide.
        const parts = duration.split(':');

        // ✅ SÉCURITÉ : On s'assure qu'on a bien au moins les heures et les minutes.
        if (parts.length < 2) {
            return 'Durée invalide';
        }

        const [hours, minutes] = parts;
        const h = parseInt(hours, 10); // Toujours spécifier la base (10) avec parseInt
        const m = parseInt(minutes, 10);

        // On vérifie si les valeurs sont bien des nombres.
        if (isNaN(h) || isNaN(m)) {
            return 'Durée invalide';
        }

        if (h > 0) {
            return `${h}h${m > 0 ? ` ${m}min` : ''}`;
        }
        return `${m}min`;
    };

    // ✅ Helper pour afficher le nom complet du coach
    const getCoachDisplayName = (): string => {
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
    console.log("coach", coach)
    return (
        <>
            <SEO
                title={`Coach ${coach.first_name} ${coach.last_name} | Expert SportRadar`}
                description={`Découvrez le profil de ${coach.first_name} ${coach.last_name}, coach expert sur SportRadar. Retrouvez ses activités, ses spécialités sportives et réservez votre prochaine séance !`}
                keywords={`${coach.first_name} ${coach.last_name}, coach sportif, expert fitness, coaching personnalisé, réserver coach, sportradar`}
            />

            <div className="p-8 max-w-7xl mx-auto">
                {/* ============================================ */}
                {/* EN-TÊTE AVEC AVATAR ET INFORMATIONS DU COACH */}
                {/* ============================================ */}
                <div className="bg-white shadow-lg rounded-lg p-8 mb-8">
                    <div className="flex items-center mb-6">
                        {/* Avatar du coach */}

                        <img
                            src={coach.avatar ? getMediaUrl(coach.avatar) : '/avatar1.png'}
                            alt={getCoachDisplayName() || 'Avatar'}
                            className="w-12 h-12 rounded-full object-cover mr-4" // CORRECTION 3: Taille d'avatar plus appropriée
                            onError={(event) => {
                                const target = event.currentTarget;
                                if (target.src.includes('avatar1.png')) return;
                                target.src = '/avatar1.png';
                                target.onerror = null;
                            }}
                        />
                        <div>
                            {/* ✅ Affichage du nom complet */}
                            <h1 className="text-4xl font-bold text-gray-800 mb-2">
                                {getCoachDisplayName()}
                            </h1>
                            <p className="text-xl text-gray-600 mb-2">@{coach.username}</p>
                            {coach.email && (
                                <p className="text-gray-500">
                                    <span className="font-semibold">📧 Email :</span> {coach.email}
                                </p>
                            )}
                            {coach.company && (
                                <div className="mt-2">
                                    <p className="text-gray-500">
                                        <span className="font-semibold">🏢 Salle de sport :</span> {coach.company.name}
                                    </p>
                                    {coach.company.address && (
                                        <p className="text-gray-500 text-sm">
                                            📍 {coach.company.address}, {coach.company.city}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Statistiques */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-blue-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Activités proposées</p>
                            <p className="text-3xl font-bold text-blue-600">{activities.length}</p>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Statut</p>
                            <p className="text-xl font-semibold text-green-600">
                                {activities.length ? '✅ Actif' : '❌ Inactif'}
                            </p>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-600">Type</p>
                            <p className="text-xl font-semibold text-purple-600">Coach Professionnel</p>
                        </div>
                    </div>
                </div>

                {/* ============================================ */}
                {/* SECTION DES ACTIVITÉS */}
                {/* ============================================ */}
                <div>
                    <h2 className="text-3xl font-bold mb-6 text-gray-800">Activités proposées</h2>

                    {activities.length === 0 ? (
                        <div className="bg-gray-100 p-8 rounded-lg text-center">
                            <p className="text-gray-600 text-lg">
                                Ce coach ne propose aucune activité pour le moment.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activities.map(activity => (
                                <div
                                    key={activity.id}
                                    className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                                >
                                    {/* Image de l'activité */}

                                    <div className="relative">
                                        <img
                                            src={getMediaUrl(activity.image) || '/images/activity-default.jpg'} // Assurez-vous que ce chemin est correct
                                            alt={activity.name}
                                            className="w-full h-48 object-cover"
                                            onError={(event) => {
                                                const target = event.currentTarget;
                                                if (target.src.includes('activity-default')) return;
                                                target.src = '/images/activity-default.jpg'; // Chemin de secours
                                                target.onerror = null;
                                            }}
                                        />

                                        {activity.sport_zen && (
                                            <div className="absolute top-2 right-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                                                🧘 Sport Zen
                                            </div>
                                        )}
                                    </div>


                                    <div className="p-5">
                                        {/* Nom de l'activité */}
                                        <h3 className="font-bold text-xl mb-2 text-gray-800">
                                            {activity.name}
                                        </h3>

                                        {/* Description */}
                                        {activity.description && (
                                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                {activity.description}
                                            </p>
                                        )}

                                        {/* Informations détaillées */}
                                        <div className="space-y-2 text-sm text-gray-600">
                                            {/* Date */}
                                            <p>
                                                <span className="font-semibold">📅 Date :</span>{' '}
                                                {new Date(activity.start_time).toLocaleDateString('fr-FR', {
                                                    weekday: 'long',
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </p>

                                            {/* Heure */}
                                            <p>
                                                <span className="font-semibold">🕐 Heure :</span>{' '}
                                                {new Date(activity.start_time).toLocaleTimeString('fr-FR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>

                                            {/* Durée */}
                                            <p>
                                                <span className="font-semibold">⏱️ Durée :</span>{' '}
                                                {formatDuration(activity.duration)}
                                            </p>

                                            {/* Lieu */}
                                            <p>
                                                <span className="font-semibold">📍 Lieu  :</span>
                                                {activity.effective_location}
                                            </p>

                                            {/* Niveau */}
                                            <p>
                                                <span className="font-semibold">🎯 Niveau :</span>{' '}
                                                {activity.level === 'all' ? 'Tous niveaux' :
                                                    activity.level === 'beginner' ? 'Débutant' :
                                                        activity.level === 'intermediate' ? 'Intermédiaire' :
                                                            'Avancé'}
                                            </p>

                                            {/* Places */}
                                            <p>
                                                <span className="font-semibold">👥 Places :</span>{' '}
                                                {activity.participants_count}/{activity.max_participants}
                                            </p>

                                            {/* Prix */}
                                            <p>
                                                <span className="font-semibold">💰 Prix :</span>{' '}
                                                {activity.price}€
                                            </p>

                                            {/* Note moyenne */}
                                            {activity.average_score && (
                                                <p>
                                                    <span className="font-semibold">⭐ Note :</span>{' '}
                                                    {activity.average_score.toFixed(1)}/5
                                                    {' '}({activity.ratings.length} avis)
                                                </p>
                                            )}
                                        </div>

                                        {/* Bouton pour voir les détails */}
                                        <button
                                            onClick={() => window.location.href = `/activities/${activity.id}`}
                                            className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-semibold"
                                        >
                                            Voir les détails
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default CoachDetailPage;
