// src/pages/ActivityDetailPage.tsx

import React, { useState, useEffect } from 'react';
import {useNavigate, useParams} from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import type {Activity, ActivityRating, Booking} from '../types';
import { Helmet } from 'react-helmet-async';
import { MapPin, Calendar, Clock, Users, Tag, BarChart, User as UserIcon, Building } from 'lucide-react';
import { getMediaUrl } from '../utils/media';
import { useAuth } from '../contexts/AuthContext';
import { Star } from 'lucide-react';
import axios from "axios";

const ActivityDetailPage: React.FC = () => {
    // On récupère l'ID de l'activité depuis les paramètres de l'URL (ex: /activities/123)
    const { id } = useParams<{ id: string }>();
    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate(); // Hook pour la redirection
    const {  isAuthenticated } = useAuth();
    // --- NOUVEL ÉTAT POUR GÉRER L'INSCRIPTION ---
    const [isRegistered, setIsRegistered] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newComment, setNewComment] = useState('');
    const [newScore, setNewScore] = useState(0);
    const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

    useEffect(() => {
        // On s'assure que l'ID est bien un nombre avant de faire l'appel
        if (!id || isNaN(Number(id))) {
            setError("ID d'activité invalide.");
            setLoading(false);
            return;
        }

        const fetchAllData = async () => {
            // On s'assure que le loading est bien à true au début
            setLoading(true);

            try {
                // On lance les deux appels en parallèle pour plus d'efficacité.
                // L'un récupère l'activité, l'autre les réservations de l'utilisateur.
                const [activityRes, bookingsRes] = await Promise.all([
                    axiosInstance.get<Activity>(`/activities/${id}/`),
                    isAuthenticated ? axiosInstance.get<Booking[]>('/bookings/') : Promise.resolve({ data: [] as Booking[] })
                ]);

                // On met à jour l'état de l'activité
                setActivity(activityRes.data);

                // On vérifie si l'utilisateur est inscrit à CETTE activité
                const isUserRegistered = bookingsRes.data.some(booking => booking.activity.id === Number(id));
                setIsRegistered(isUserRegistered);

            } catch (err) {
                console.error("Erreur lors du chargement des données de la page", err);
                setError("L'activité n'a pas pu être chargée ou n'existe pas.");
            } finally {
                // Le 'finally' est crucial : il s'exécute après le try OU le catch.
                // On arrête le chargement SEULEMENT quand TOUT est terminé.
                setLoading(false);
            }
        };






        fetchAllData();
    }, [id,isAuthenticated]); // Le useEffect se redéclenche si l'ID dans l'URL change

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center">Chargement de l'activité...</div>;
    }

    if (error || !activity) {
        return <div className="min-h-screen flex justify-center items-center text-red-500">{error || "Activité non trouvée."}</div>;
    }

    // Formatage de la date et de l'heure pour un affichage propre
    const { date, time } = {
        date: new Date(activity.start_time).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: new Date(activity.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    const imageUrl = getMediaUrl(activity.image);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // On vérifie qu'il y a au moins un commentaire OU une note
        if (!newComment && newScore === 0) {
            alert("Veuillez laisser un commentaire ou une note.");
            return;
        }
        if (!activity) return;

        setIsReviewSubmitting(true);

        // On prépare le payload. On n'inclut le score que s'il est supérieur à 0.
        const payload: {
            activity: number;
            comment: string;
            score?: number;
        } = {
            activity: activity.id,
            comment: newComment,
        };

        if (newScore > 0) {
            payload.score = newScore;
        }
        try {
            const { data: newRatingData } = await axiosInstance.post<ActivityRating>(
                `/activities/${activity.id}/ratings/`,
                payload
            );

            // ... (logique de mise à jour de l'état, qui reste la même)
            setActivity(prev => {
                if (!prev) return null;
                const updatedRatings = [newRatingData, ...prev.ratings];
                const totalScore = updatedRatings.reduce((sum, r) => sum + (r.score || 0), 0);
                const ratedCount = updatedRatings.filter(r => r.score != null).length;
                const newAverage = ratedCount > 0 ? totalScore / ratedCount : null;
                return {
                    ...prev,
                    ratings: updatedRatings,
                    average_score: newAverage
                };
            });
            setNewComment('');
            setNewScore(0);

        } catch (err) {
            console.error("Erreur lors de l'envoi de l'avis", err);
            if (axios.isAxiosError(err) && err.response) {
                alert(`Erreur : ${JSON.stringify(err.response.data)}`);
            } else {
                alert("Une erreur est survenue.");
            }
        } finally {
            setIsReviewSubmitting(false);
        }
    };

    // --- NOUVELLE FONCTION POUR GÉRER LE CLIC SUR LE BOUTON ---
    const handleRegisterClick = async () => {
        if (!isAuthenticated || !activity) {
            // Si l'utilisateur n'est pas connecté, on le redirige vers la page de login
            navigate('/login', { state: { from: `/activities/${activity?.id}` } });
            return;
        }

        setIsSubmitting(true);


        try {
            if (isRegistered) {
                // --- Logique de DÉSINSCRIPTION ---
                // On doit trouver l'ID de la réservation pour la supprimer
                const bookings = (await axiosInstance.get<Booking[]>('/bookings/')).data;
                const bookingToDelete = bookings.find(b => b.activity.id === activity.id);
                if (bookingToDelete) {
                    await axiosInstance.delete(`/bookings/${bookingToDelete.id}/`);
                    setIsRegistered(false);
                    // On met à jour le nombre de participants localement
                    setActivity(prev => prev ? { ...prev, participants_count: prev.participants_count - 1 } : null);
                }
            } else {
                // --- Logique d'INSCRIPTION ---
                await axiosInstance.post('/bookings/', { activity: activity.id });
                setIsRegistered(true);
                // On met à jour le nombre de participants localement
                setActivity(prev => prev ? { ...prev, participants_count: prev.participants_count + 1 } : null);
            }
        } catch (err) {
            console.error("Erreur lors de la mise à jour de l'inscription", err);
            alert("Une erreur est survenue. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const isFull = activity.participants_count >= activity.max_participants;
    const isActivityPast = new Date(activity.start_time) < new Date();

    return (
        <>
            <Helmet>
                <title>{activity.name} - SportRadar</title>
                <meta name="description" content={activity.description || `Détails sur l'activité ${activity.name}.`} />
            </Helmet>

            <div className="min-h-screen bg-gray-100 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        <img
                            src={imageUrl || '/images/activity-default.jpg'}
                            alt={activity.name}
                            className="w-full h-64 object-cover"
                        />
                        <div className="p-8">
                            <h1 className="text-4xl font-bold text-[#0a1128] mb-4">{activity.name}</h1>

                            {activity.description && (
                                <p className="text-lg text-gray-700 mb-6">{activity.description}</p>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-800">
                                {/* Colonne de gauche : Infos pratiques */}
                                <div className="space-y-4">
                                    <div className="flex items-center"><Calendar className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>{date}</span></div>
                                    <div className="flex items-center"><Clock className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>{time} (Durée: {activity.duration})</span></div>
                                    <div className="flex items-center"><MapPin className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>{activity.effective_location}</span></div>
                                    <div className="flex items-center"><Users className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>{activity.participants_count} / {activity.max_participants} participants</span></div>
                                </div>
                                {/* Colonne de droite : Infos contextuelles */}
                                <div className="space-y-4">
                                    <div className="flex items-center"><Tag className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>Catégorie : {activity.category || 'Non définie'}</span></div>
                                    <div className="flex items-center"><BarChart className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>Niveau : {activity.level}</span></div>

                                    {/* Affichage du coach */}
                                    {activity.instructor ? (
                                        <div className="flex items-center"><UserIcon className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>Coach : {activity.instructor.username}</span></div>
                                    ) : (
                                        <div className="flex items-center"><UserIcon className="w-5 h-5 mr-3 text-gray-400" /><span>Coach non assigné</span></div>
                                    )}

                                    {/* Affichage de la compagnie */}
                                    {activity.company && (
                                        <div className="flex items-center"><Building className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>Organisé par : {activity.company.name}</span></div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 border-t pt-6 flex justify-end">
                                {/* --- BOUTON DYNAMIQUE --- */}
                                <button
                                    onClick={handleRegisterClick}
                                    disabled={isSubmitting || (isFull && !isRegistered)}
                                    className={`font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                                        ${isRegistered
                                        ? 'bg-gray-500 text-white hover:bg-gray-600' // Style pour "Se désinscrire"
                                        : isFull
                                            ? 'bg-red-300 text-red-800' // Style pour "Complet"
                                            : 'bg-[#dc5f18] text-white hover:brightness-110' // Style pour "S'inscrire"
                                        }
                                    `}
                                >
                                    {isSubmitting
                                        ? 'Chargement...'
                                        : isRegistered
                                            ? 'Se désinscrire'
                                            : isFull
                                                ? 'Complet'
                                                : `S'inscrire ( ${activity.price} € )`
                                    }
                                </button>
                            </div>
                        </div>

                        <div className="p-8 border-t">
                            <h2 className="text-3xl font-bold text-[#0a1128] mb-6">Avis et Commentaires</h2>

                            {/* Note globale */}
                            <div className="flex items-center mb-8 p-4 bg-gray-50 rounded-lg">
                                <span className="text-4xl font-bold text-[#dc5f18] mr-4">
                                    {activity.average_score?.toFixed(1) || 'N/A'}
                                </span>
                                <div>
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <Star key={star} className={`w-6 h-6 ${activity.average_score && activity.average_score >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-600">Basé sur {activity.ratings.length} avis</p>
                                </div>
                            </div>

                            {/* Formulaire pour laisser un avis */}
                            {isAuthenticated && (
                                <div className="mb-8">
                                    <h3 className="text-xl font-semibold mb-4">Laissez votre avis</h3>
                                    <form onSubmit={handleReviewSubmit}>
                                        <div className="mb-4">
                                            <label className="block mb-2 font-medium">Votre note :</label>
                                            <div className={`flex items-center ${!isActivityPast ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                                {[1, 2, 3, 4, 5].map(star => (
                                                    <Star key={star} className={`w-8 h-8 cursor-pointer ${newScore >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} onClick={() => isActivityPast && setNewScore(star)} />
                                                ))}
                                            </div>
                                            {!isActivityPast && <p className="text-xs text-gray-500 mt-1">Vous ne pourrez noter cette activité qu'une fois qu'elle sera terminée.</p>}
                                        </div>
                                        <div className="mb-4">
                                            <label htmlFor="comment" className="block mb-2 font-medium">Votre commentaire :</label>
                                            <textarea id="comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full border rounded p-2" rows={3} placeholder="Partagez votre expérience..."></textarea>
                                        </div>
                                        <button type="submit" disabled={isReviewSubmitting} className="bg-[#0a1128] text-white px-6 py-2 rounded hover:bg-opacity-90 disabled:opacity-50">
                                            {isReviewSubmitting ? 'Envoi...' : 'Envoyer mon avis'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            {/* Liste des commentaires existants */}
                            <div className="space-y-6">
                                {activity.ratings.length > 0 ? (
                                    activity.ratings.map(rating => (
                                        <div key={rating.id} className="p-4 border-b">
                                            <div className="flex items-center mb-2">
                                                {/*<img src={getMediaUrl(rating.user.avatar) || avatarOptions.default} alt={rating.user.username} className="w-10 h-10 rounded-full mr-3" />*/}
                                                {/*<img src={getMediaUrl(rating.user.avatar) || "avatarOptions.default"} alt={rating.user.username} className="w-10 h-10 rounded-full mr-3" />*/}

                                                {/*<span className="font-bold">{rating.user.username}</span>*/}
                                                <span className="text-xs text-gray-500 ml-auto">{new Date(rating.created_at).toLocaleDateString('fr-FR')}</span>
                                            </div>
                                            {rating.score && (
                                                <div className="flex mb-2">
                                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`w-5 h-5 ${rating.score >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                                                </div>
                                            )}
                                            <p className="text-gray-800">{rating.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500">Soyez le premier à laisser un avis !</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    );
};

export default ActivityDetailPage;
