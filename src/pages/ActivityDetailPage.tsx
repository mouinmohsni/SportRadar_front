// src/pages/ActivityDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import type { Activity, ActivityRating, Booking } from '../types';
import { MapPin, Calendar, Clock, Users, Tag, BarChart, User as UserIcon, Building, Star } from 'lucide-react';
import { getMediaUrl } from '../utils/media';
import { useAuth } from '../contexts/AuthContext';
import axios from "axios";
import SEO from "../components/SEO.tsx";
interface ReviewPayload {
    activity: number; // ou string, selon le type de activity.id
    comment: string;
    score?: number; // Le '?' rend la propriété 'score' optionnelle
}
const ActivityDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();
    const [isRegistered, setIsRegistered] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newComment, setNewComment] = useState('');
    const [newScore, setNewScore] = useState(0);
    const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);

    useEffect(() => {
        if (!id || isNaN(Number(id))) {
            setError("ID d'activité invalide.");
            setLoading(false);
            return;
        }

        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [activityRes, bookingsRes] = await Promise.all([
                    axiosInstance.get<Activity>(`/api/activities/${id}/`),
                    isAuthenticated ? axiosInstance.get<Booking[]>('/api/bookings/') : Promise.resolve({ data: [] as Booking[] })
                ]);

                setActivity(activityRes.data);
                const isUserRegistered = bookingsRes.data.some(booking => booking.activity.id === Number(id));
                setIsRegistered(isUserRegistered);

            } catch (err) {
                console.error("Erreur lors du chargement des données de la page", err);
                setError("L'activité n'a pas pu être chargée ou n'existe pas.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [id, isAuthenticated]);

    if (loading) {
        return <div className="min-h-screen flex justify-center items-center">Chargement de l'activité...</div>;
    }

    if (error || !activity) {
        return <div className="min-h-screen flex justify-center items-center text-red-500">{error || "Activité non trouvée."}</div>;
    }

    const { date, time } = {
        date: new Date(activity.start_time).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: new Date(activity.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    const imageUrl = getMediaUrl(activity.image);

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment && newScore === 0) {
            alert("Veuillez laisser un commentaire ou une note.");
            return;
        }
        if (!activity) return;

        setIsReviewSubmitting(true);
        const payload: ReviewPayload = {



            activity: activity.id,
            comment: newComment,
        };

        if (newScore > 0) {
            payload.score = newScore;
        }
        try {
            const { data: newRatingData } = await axiosInstance.post<ActivityRating>(
                `/api/activities/${activity.id}/ratings/`,
                payload
            );

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

    const handleRegisterClick = async () => {
        if (!isAuthenticated || !activity) {
            navigate('/login', { state: { from: `/activities/${activity?.id}` } });
            return;
        }

        setIsSubmitting(true);
        try {
            if (isRegistered) {
                const bookings = (await axiosInstance.get<Booking[]>('/api/bookings/')).data;
                const bookingToDelete = bookings.find(b => b.activity.id === activity.id);
                if (bookingToDelete) {
                    await axiosInstance.delete(`/api/bookings/${bookingToDelete.id}/`);
                    setIsRegistered(false);
                    setActivity(prev => prev ? { ...prev, participants_count: prev.participants_count - 1 } : null);
                }
            } else {
                await axiosInstance.post('/api/bookings/', { activity: activity.id });
                setIsRegistered(true);
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

            <SEO
                title= {`${activity.name} | SportRadar - ${activity.category}`}
                description={`${activity.description}`}
            />

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
                                <div className="space-y-4">
                                    <div className="flex items-center"><Calendar className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>{date}</span></div>
                                    <div className="flex items-center"><Clock className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>{time} (Durée: {activity.duration})</span></div>
                                    <div className="flex items-center"><MapPin className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>{activity.effective_location}</span></div>
                                    <div className="flex items-center"><Users className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>{activity.participants_count} / {activity.max_participants} participants</span></div>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center"><Tag className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>Catégorie : {activity.category || 'Non définie'}</span></div>
                                    <div className="flex items-center"><BarChart className="w-5 h-5 mr-3 text-[#dc5f18]" /><span>Niveau : {activity.level}</span></div>

                                    {activity.instructor ? (
                                        <div className="flex items-center">
                                            <UserIcon className="w-5 h-5 mr-3 text-[#dc5f18]" />
                                            <span>Coach :
                                                <Link to={`/coaches/${activity.instructor.id}`} className="text-[#dc5f18] hover:underline ml-1">
                                                    {activity.instructor.first_name} {activity.instructor.last_name}
                                                </Link>
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="flex items-center"><UserIcon className="w-5 h-5 mr-3 text-gray-400" /><span>Coach non assigné</span></div>
                                    )}

                                    {activity.company && (
                                        <div className="flex items-center">
                                            <Building className="w-5 h-5 mr-3 text-[#dc5f18]" />
                                            <span>Organisé par :
                                                <Link to={`/companies/${activity.company.id}`} className="text-[#dc5f18] hover:underline ml-1">
                                                    {activity.company.name}
                                                </Link>
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8 border-t pt-6 flex justify-end">
                                <button
                                    onClick={handleRegisterClick}
                                    disabled={isSubmitting || (isFull && !isRegistered)}
                                    className={`font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed
                                        ${isRegistered
                                        ? 'bg-gray-500 text-white hover:bg-gray-600'
                                        : isFull
                                            ? 'bg-red-300 text-red-800'
                                            : 'bg-[#dc5f18] text-white hover:brightness-110'
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
                                            <textarea id="comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} className="w-full border rounded p-2 focus:ring-2 focus:ring-[#dc5f18] outline-none" rows={3} placeholder="Partagez votre expérience..."></textarea>
                                        </div>
                                        <button type="submit" disabled={isReviewSubmitting} className="bg-[#0a1128] text-white px-6 py-2 rounded hover:bg-opacity-90 disabled:opacity-50 transition-colors">
                                            {isReviewSubmitting ? 'Envoi...' : 'Envoyer mon avis'}
                                        </button>
                                    </form>
                                </div>
                            )}

                            <div className="space-y-6">
                                {activity.ratings.length > 0 ? (
                                    activity.ratings.map(rating => (
                                        <div key={rating.id} className="p-4 border-b hover:bg-gray-50 transition-colors rounded-lg">
                                            <div className="flex items-center mb-3">
                                                <img
                                                    src={getMediaUrl(rating.user?.avatar) || '/src/assets/avatars/default-avatar.png'}
                                                    alt={rating.user?.username}
                                                    className="w-12 h-12 rounded-full mr-4 border-2 border-gray-200"
                                                />
                                                <div>
                                                    <p className="font-bold text-gray-900">
                                                        {rating.user?.first_name} {rating.user?.last_name || rating.user?.username}
                                                    </p>
                                                    <span className="text-xs text-gray-500">{new Date(rating.created_at).toLocaleDateString('fr-FR')}</span>
                                                </div>
                                            </div>
                                            {rating.score && (
                                                <div className="flex mb-2">
                                                    {[1, 2, 3, 4, 5].map(star => <Star key={star} className={`w-4 h-4 ${rating.score >= star ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />)}
                                                </div>
                                            )}
                                            <p className="text-gray-700 leading-relaxed">{rating.comment}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-center text-gray-500 italic">Soyez le premier à laisser un avis !</p>
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
