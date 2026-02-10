// src/pages/ActivityUpdate.tsx

import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import type { Activity, User as CoachUser } from '../types';
import {  Upload } from 'lucide-react';
import { getMediaUrl } from '../utils/media';
import { useAuth } from '../contexts/AuthContext';
import SEO from "../components/SEO.tsx";

const ActivityUpdate: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { user } = useAuth();

    // ✅ 1. Un seul état pour le formulaire, initialisé à null
    const [formData, setFormData] = useState<Partial<Activity>>({});
    const [coaches, setCoaches] = useState<CoachUser[]>([]);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // ✅ 2. useEffect pour charger les données initiales de l'activité ET des coachs
    useEffect(() => {
        if (!id) return;

        const fetchData = async () => {
            setLoading(true);
            try {
                const [activityRes, coachesRes] = await Promise.all([
                    axiosInstance.get<Activity>(`/api/activities/${id}/`),
                    // On récupère les coachs de l'entreprise pour le menu déroulant
                    user?.company ? axiosInstance.get<CoachUser[]>(`/api/coaches/`) : Promise.resolve({ data: [] })
                ]);

                // On vérifie que l'utilisateur a le droit de modifier cette activité
                if (user?.company?.id !== activityRes.data.company?.id) {
                    toast.error("Vous n'avez pas la permission de modifier cette activité.");
                    navigate('/dashboard');
                    return;
                }

                // On initialise le formulaire avec les données de l'API
                setFormData({
                    ...activityRes.data,
                    // Le champ 'instructor' de l'API est un objet, mais notre formulaire a besoin de l'ID
                    instructor_id: activityRes.data.instructor?.id,
                });
                setCoaches(coachesRes.data);

            } catch (err) {
                console.error("Erreur lors du chargement des données", err);
                setError("L'activité n'a pas pu être chargée.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id, user?.company, navigate]);

    // ✅ 3. Une fonction `handleChange` unifiée pour tous les champs
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, type } = e.target;

        // ✅ GESTION SPÉCIFIQUE POUR LES CHECKBOXES
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
        }
        // GESTION SPÉCIFIQUE POUR LES FICHIERS
        else if (type === 'file') {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                setFormData(prev => ({ ...prev, image: file }));
                // Créer un aperçu de l'image sélectionnée
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImagePreview(reader.result as string);
                };
                reader.readAsDataURL(file);
            }
        }
        // GESTION POUR TOUS LES AUTRES CHAMPS (TEXTE, SELECT, ETC.)
        else {
            const { value } = e.target;
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    // ✅ 4. Une fonction `handleSubmit` pour envoyer les données du formulaire
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!formData || !id) return;

        setIsSubmitting(true);

        // On utilise FormData car on envoie un fichier (l'image)
        const submissionData = new FormData();

        // On ajoute tous les champs du formulaire au FormData
        Object.entries(formData).forEach(([key, value]) => {
            // On ne veut pas envoyer l'objet 'instructor' complet, seulement l'ID
            if (key !== 'instructor' && value !== null && value !== undefined) {
                submissionData.append(key, value as string | Blob);
            }
        });

        // Si l'image n'a pas été changée (c'est toujours une string), on la retire du payload
        if (typeof formData.image === 'string') {
            submissionData.delete('image');
        }


        try {
            await axiosInstance.put(`/api/activities/${id}/`, submissionData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            toast.success('Activité modifiée avec succès !');
            navigate('/dashboard'); // Redirige vers le dashboard après succès
        } catch (err: any) {
            console.error("Erreur lors de la mise à jour", err);
            const errorMessage = err.response?.data ? JSON.stringify(err.response.data) : "Une erreur est survenue.";
            toast.error(`Erreur : ${errorMessage}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    // --- Rendu ---
    if (loading) return <div className="min-h-screen flex justify-center items-center">Chargement...</div>;
    if (error) return <div className="min-h-screen flex justify-center items-center text-red-500">{error}</div>;
    if (!formData) return <div className="min-h-screen flex justify-center items-center">Aucune donnée à afficher.</div>;

    return (
        <>
            <SEO title={`Modifier : ${formData.name}`} description="Page de modification d'une activité." />

            <div className="min-h-screen bg-gray-100 py-12 px-4">
                {/* ✅ 5. Le formulaire englobe toute la carte */}
                <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        <div className="relative">
                            <img
                                src={
                                    // CAS 1 : Si un aperçu d'image existe (l'utilisateur vient de sélectionner un fichier), on l'utilise.
                                    imagePreview ||
                                    // CAS 2 : Sinon, on vérifie si formData.image est une chaîne de caractères (l'URL initiale de l'API).
                                    (typeof formData.image === 'string'
                                        ? getMediaUrl(formData.image) // Si oui, on appelle getMediaUrl.
                                        : '/activity-default11.jpeg') // Sinon (si c'est null ou autre), on met l'image par défaut.
                                }
                                alt={formData.name || "Image de l'activité"}
                                className="w-full h-64 object-cover"
                            />


                            <label htmlFor="image" className="absolute bottom-4 right-4 bg-white text-gray-800 px-4 py-2 rounded-lg shadow-md cursor-pointer hover:bg-gray-200 transition-colors flex items-center space-x-2">
                                <Upload className="w-5 h-5" />
                                <span>Changer l'image</span>
                            </label>
                            <input id="image" name="image" type="file" className="hidden" onChange={handleChange} accept="image/*" />
                        </div>

                        <div className="p-8 space-y-6">
                            {/* ✅ 6. Chaque champ est maintenant un input dans un formulaire */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom de l'activité</label>
                                <input id="name" name="name" type="text" value={formData.name || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" required />
                            </div>

                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea id="description" name="description" value={formData.description || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" rows={4} />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">Catégorie</label>
                                    <input id="category" name="category" type="text" value={formData.category || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="level" className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
                                    <select id="level" name="level" value={formData.level || 'all'} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                        <option value="all">Tous niveaux</option>
                                        <option value="beginner">Débutant</option>
                                        <option value="intermediate">Intermédiaire</option>
                                        <option value="advanced">Avancé</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="start_time" className="block text-sm font-medium text-gray-700 mb-1">Date et Heure</label>
                                    <input id="start_time" name="start_time" type="datetime-local" value={formData.start_time?.substring(0, 16) || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1">Durée (HH:MM:SS)</label>
                                    <input id="duration" name="duration" type="text" placeholder="01:00:00" value={formData.duration || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700 mb-1">Participants max.</label>
                                    <input id="max_participants" name="max_participants" type="number" value={formData.max_participants || 0} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Prix (€)</label>
                                    <input id="price" name="price" type="number" step="0.01" value={formData.price || 0} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                                <div>
                                    <label htmlFor="instructor_id" className="block text-sm font-medium text-gray-700 mb-1">Coach assigné</label>
                                    <select id="instructor_id" name="instructor_id" value={formData.instructor_id || ''}  onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md bg-white">
                                        <option value="">Aucun coach</option>
                                        {coaches.map(coach => (
                                            <option key={coach.id} value={coach.id}>{coach.first_name} {coach.last_name} (@{coach.username})</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="venue" className="block text-sm font-medium text-gray-700 mb-1">Lieu (Intérieur/Extérieur)</label>
                                    <select
                                        id="venue"
                                        name="venue"
                                        value={formData.venue}
                                        onChange={handleChange}
                                        className="w-full p-2 border border-gray-300 rounded-md bg-white"
                                    >
                                        <option value="indoor">Intérieur</option>
                                        <option value="outdoor">Extérieur</option>
                                    </select>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="sport_zen"
                                        name="sport_zen"
                                        type="checkbox"
                                        checked={!!formData.sport_zen}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="sport_zen" className="ml-2 block text-sm text-gray-900">Activité Zen (détente, méditation, etc.)</label>
                                </div>
                                <div className="flex items-center">
                                    <input
                                        id="is_public"
                                        name="is_public"
                                        type="checkbox"
                                        checked={formData.is_public}
                                        onChange={handleChange}
                                        className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">Cocher pour rendre l'activité visible publiquement.</label>
                                </div>
                                <div>
                                    <label htmlFor="location_address" className="block text-sm font-medium text-gray-700 mb-1">Adresse (si différente de la salle)</label>
                                    <input id="location_address" name="location_address" type="text" value={formData.location_address || ''} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md" />
                                </div>
                            </div>

                            <div className="mt-8 border-t pt-6 flex justify-end space-x-4">
                                <button type="button" onClick={() => navigate('/dashboard')} className="font-bold py-3 px-6 rounded-lg bg-gray-200 text-gray-800 hover:bg-gray-300 transition-colors">
                                    Annuler
                                </button>
                                <button type="submit" disabled={isSubmitting} className="font-bold py-3 px-6 rounded-lg bg-[#dc5f18] text-white hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                                    {isSubmitting ? 'Enregistrement...' : 'Enregistrer les modifications'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    );
};

export default ActivityUpdate;
