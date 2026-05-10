// src/pages/ActivityDetailPage.tsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import type { Activity, ActivityRating, Booking } from '../types';
import { MapPin, Calendar, Clock, Users, Tag, BarChart, User as UserIcon, Building, Star } from 'lucide-react';
import { getMediaUrl } from '../utils/media'; // Assurez-vous que cette fonction existe et fonctionne
import { useAuth } from '../contexts/AuthContext';
import axios from "axios";
import SEO from "../components/SEO.tsx";
import {toast} from "react-toastify";

interface ReviewPayload {
    activity: number;
    comment: string;
    score?: number;
}

const ActivityDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [activity, setActivity] = useState<Activity | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [nb_persone, setNb_persone]=useState(1);
    const [user_nb_persone, setUser_nb_persone] = useState(0);



    const navigate = useNavigate();
    const { isAuthenticated,user } = useAuth();
    const [isRegistered, setIsRegistered] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [newComment, setNewComment] = useState('');
    const [newScore, setNewScore] = useState(0);
    const [isReviewSubmitting, setIsReviewSubmitting] = useState(false);


    useEffect(() => {
        // ... (le useEffect ne change pas)
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
                console.log("isUserRegistered=======",isUserRegistered)
                const This_book =bookingsRes.data.filter(book=>book.activity.id==Number(id));
                console.log("this book ", This_book[0]?.nb_persone) // ici ca va donner la reservation de cette acivier avec ce user
                if (This_book[0]?.nb_persone > 1){
                    setNb_persone(This_book[0].nb_persone)
                }else{
                    setNb_persone(1)
                }






            } catch (err) {
                console.error("Erreur lors du chargement des données de la page", err);
                setError("L'activité n'a pas pu être chargée ou n'existe pas.");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
        if (activity && activity?.participants_count !== undefined) {
            setNb_persone(activity.participants_count || 1);
            setUser_nb_persone(activity.participants_count || 0);
        }
    }, [id, isAuthenticated]);

    // ... (les fonctions de chargement et d'erreur ne changent pas)
    if (loading) {
        return <div className="min-h-screen flex justify-center items-center">Chargement de l'activité...</div>;
    }

    if (error || !activity) {
        return <div className="min-h-screen flex justify-center items-center text-red-500">{error || "Activité non trouvée."}</div>;
    }




    // ... (les fonctions handleReviewSubmit et handleRegisterClick ne changent pas)
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

    const hendleDeleteBook = async  ()=>{
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
             setActivity(prev => prev ? { ...prev, participants_count: prev.participants_count - nb_persone } : null);
             }
         }
    } catch (err) {
        console.error("Erreur lors de la mise à jour de l'inscription", err);
        alert("Une erreur est survenue. Veuillez réessayer.");
    } finally {
        setIsSubmitting(false);
    }

    }

    const handleRegisterClick = async () => {
        if (!isAuthenticated || !activity) {
            navigate('/login', { state: { from: `/activities/${activity?.id}` } });
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Envoyer la requête au Backend (S'inscrire ou Modifier)
            const response = await axiosInstance.post('/api/bookings/', {
                activity: activity.id,
                nb_persone: nb_persone
            });
            console.log("response",response)

            // 2. Mise à jour des états locaux
            setIsRegistered(true);
            setUser_nb_persone(nb_persone); // On mémorise le nouveau nombre de places de l'utilisateur

            // 🚀 LA CORRECTION DU COMPTEUR :
            // Au lieu de faire un calcul risqué (+ nb_persone), on recharge l'activité.
            // Cela garantit que le participants_count affiché est EXACTEMENT celui de la base de données.
            const updatedActivity = await axiosInstance.get(`/api/activities/${activity.id}/`);
            setActivity(updatedActivity.data);

            toast.success(isRegistered ? "Réservation mise à jour !" : "Inscription réussie !");

        } catch (err) {
            console.error("Erreur lors de la réservation", err);
            const errorMsg = "Une erreur est survenue. Veuillez réessayer.";
            toast.error(errorMsg);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditActivity = (e: React.MouseEvent, activityId: number) => {
        e.stopPropagation(); // Empêche la navigation vers le détail de l'activité
        // Navigue vers une future page de modification (à créer)
        navigate(`/activities/${activityId}/edit`);
    };

    const handleDeleteActivity = async (e: React.MouseEvent, activityId: number) => {
        e.stopPropagation(); // Empêche la navigation vers le détail de l'activité
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette activité ?')) return;

        try {
            await axiosInstance.delete(`/api/activities/${activityId}/`);
            toast.success('Activité supprimée avec succès ✅');
            navigate('/activities');
        } catch (error) {
            console.error('Erreur lors de la suppression:', error);
            toast.error('Erreur lors de la suppression de l\'activité ❌');
        }
    };


    const { date, time } = {
        date: new Date(activity.start_time).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        time: new Date(activity.start_time).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
    };
    const isFull = activity.participants_count >= activity.max_participants;
    const isActivityPast = new Date(activity.start_time) < new Date();
    console.log(nb_persone)

    return (
        <>
            <SEO
                title={`${activity.name} | Réservez sur SportRadar`}
                description={`Réservez votre séance de ${activity.category} à ${activity.location_address} avec ${activity.instructor?.first_name}. Rejoignez ${activity.max_participants} participants pour une expérience unique !`}
                keywords={`${activity.category}, réservation ${activity.category}, sport ${activity.location_address}, ${activity.instructor?.first_name}, coaching sport, sportradar`}
            />

            <div className="min-h-screen bg-gray-100 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        {/* CORRECTION 1: Une seule balise <img> pour l'image principale avec la logique de secours */}
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

                        <div className="p-8">
                            {/* ... (Le reste du contenu de la description ne change pas) */}
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
                                <div className="mt-4 flex items-center justify-center gap-2 text-gray-600">

                                </div>
                                {!isAuthenticated && (
                                    <div className="flex items-center space-x-4">
        <span className="text-xs text-gray-500">
            Vous devez être connecté pour réserver une activité.
        </span>
                                        <Link
                                            to="/login"
                                            className="bg-[#D85500] text-[#0A1128] font-bold px-4 py-2 rounded hover:bg-[#c44d00] transition-colors"
                                            onClick={() => window.scrollTo(0, 0)}
                                        >
                                            S’inscrire
                                        </Link>
                                    </div>


                                )}



                                {(() => {
                                    // Cas 1 : L'utilisateur est un client ('personal')
                                    if (user?.type === 'personal') {
                                        return (
                                            <div className="mt-8 pt-6 border-t border-gray-100">
                                                <div className="flex flex-col items-center sm:flex-row items-end justify-end gap-4">
                                                    {/* Bloc Input */}
                                                    <div className="w-full sm:w-48">
                                                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                                            {isRegistered ? "Modifier vos places" : "Nombre de participants"}
                                                        </label>
                                                        <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl overflow-hidden px-2">
                                                            {/* Bouton Moins (-) */}
                                                            <button
                                                                onClick={() => setNb_persone(Math.max(1, nb_persone - 1))}
                                                                className="p-2 text-[#c44d00] hover:bg-gray-100 transition-colors font-bold text-xl"
                                                            >
                                                                −
                                                            </button>

                                                            <input
                                                                type="number"
                                                                value={nb_persone}
                                                                onChange={e => {
                                                                    if (!activity) return;
                                                                    const val = parseInt(e.target.value, 10);
                                                                    const maxAllowed = (activity.max_participants - activity.participants_count) + (isRegistered ? nb_persone : 0);

                                                                    if (isNaN(val) || val < 1) setNb_persone(1);
                                                                    else if (val > maxAllowed) setNb_persone(maxAllowed);
                                                                    else setNb_persone(val);
                                                                }}
                                                                className="w-full py-3 bg-transparent text-center outline-none font-bold text-lg"
                                                            />

                                                            {/* Bouton Plus (+) */}
                                                            <button
                                                                onClick={() => {
                                                                    const maxAllowed = (activity.max_participants - activity.participants_count) + (isRegistered ? nb_persone : 0);
                                                                    if (nb_persone < maxAllowed) setNb_persone(nb_persone + 1);
                                                                }}
                                                                className="p-2 text-[#c44d00] hover:bg-gray-100 transition-colors font-bold text-xl"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                        <p className="text-xs font-medium text-gray-500 mt-1.5 ml-1">
                                                            {isRegistered
                                                                ? `Vous avez réservé ${user_nb_persone} place(s)`
                                                                : `${activity?.max_participants - activity?.participants_count} places libres`}
                                                        </p>
                                                    </div>

                                                    {/* Bouton d'Action Principal */}

                                                    <button
                                                        onClick={handleRegisterClick}
                                                        disabled={isSubmitting || (isFull && !isRegistered && nb_persone > 0)}
                                                        className={`h-[52px] px-8 rounded-xl font-bold text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center min-w-[220px]
                    ${isRegistered
                                                            ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-100' // Couleur différente pour "Mettre à jour"
                                                            : isFull
                                                                ? 'bg-red-400 cursor-not-allowed'
                                                                : 'bg-[#c44d00] hover:bg-[#a34000] shadow-orange-100'
                                                        }
                `}
                                                    >
                                                        {isSubmitting ? (
                                                            <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Action...
                    </span>
                                                        ) : isRegistered ? (
                                                            `Mettre à jour (${+activity.price * nb_persone} €)`
                                                        ) : (
                                                            `Réserver (${+activity.price * nb_persone} €)`
                                                        )}
                                                    </button>

                                                    {/* Bouton Désinscription Totale (uniquement si déjà inscrit) */}
                                                    {isRegistered && (
                                                        <button
                                                            onClick={() => {
                                                                if(window.confirm("Voulez-vous annuler toute votre réservation ?")) {
                                                                    setNb_persone(0); // Envoie 0 au backend pour tout supprimer
                                                                    hendleDeleteBook();
                                                                }
                                                            }}
                                                            className="h-[52px] px-4 text-red-600 hover:bg-red-50 rounded-xl font-medium transition-colors"
                                                        >
                                                            Annuler tout
                                                        </button>
                                                    )}

                                                </div>
                                            </div>
                                        );
                                    }


                                    // Cas 2 : L'utilisateur est un propriétaire d'entreprise ('business') ET
                                    // l'activité appartient à son entreprise.
                                    if (user?.type === 'business' && user.company?.id === activity.company?.id) {
                                        return (
                                            <div className="flex items-center justify-end space-x-4">

                                                {/* --- BOUTON MODIFIER --- */}
                                                <button
                                                    type="button" // ✅ Important pour éviter la soumission accidentelle d'un formulaire
                                                    onClick={(e) => handleEditActivity(e, activity.id)}
                                                    className="
            font-bold py-3 px-6 rounded-lg
            bg-[#dc5f18] text-white
            hover:bg-opacity-90 transition-all transform hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#dc5f18]
        "
                                                >
                                                    Modifier l'activité
                                                </button>

                                                {/* --- BOUTON SUPPRIMER (avec une couleur plus distinctive et dangereuse) --- */}
                                                <button
                                                    type="button" // ✅ Important
                                                    onClick={(e) => handleDeleteActivity(e, activity.id)}
                                                    className="
            font-bold py-3 px-6 rounded-lg
            bg-red-600 text-white  // 🎨 Couleur rouge pour indiquer une action destructive
            hover:bg-red-700 transition-all transform hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500
        "
                                                >
                                                    Supprimer l'activité
                                                </button>

                                            </div>
                                        );
                                    }

                                    // Cas 3 (par défaut) : Pour tous les autres utilisateurs (coachs, visiteurs non connectés, etc.)
                                    // On n'affiche aucun bouton d'action.
                                    return null;

                                })()}
                            </div>
                            <p className="text-sm text-[#D85500] font-semibold mb-4 text-center italic">
                                ℹ️ Le paiement s'effectue directement sur place auprès de l'organisateur.
                            </p>
                        </div>

                        <div className="p-8 border-t">
                            {/* ... (La section des avis ne change pas jusqu'à la liste des commentaires) */}
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

                            {isAuthenticated && user?.type === 'personal' &&  (
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
                                                {/* CORRECTION 2: Logique de secours pour l'avatar de l'utilisateur */}
                                                <img
                                                    src={rating.user?.avatar ? getMediaUrl(rating.user.avatar) : '/avatar1.png'}
                                                    alt={rating.user?.username || 'Avatar'}
                                                    className="w-12 h-12 rounded-full object-cover mr-4" // CORRECTION 3: Taille d'avatar plus appropriée
                                                    onError={(event) => {
                                                        const target = event.currentTarget;
                                                        if (target.src.includes('avatar1.png')) return;
                                                        target.src = '/avatar1.png';
                                                        target.onerror = null;
                                                    }}
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
