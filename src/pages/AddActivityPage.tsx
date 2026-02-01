import React, { useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';
import type { User } from "../types";
import { useAuth } from "../contexts/AuthContext.tsx";

interface ActivityForm {
  name: string;
  description: string;
  category: string;
  location_address: string; // Correspond au modèle Django
  start_time_date: string; // Pour la partie date du DateTimeField
  start_time_time: string; // Pour la partie heure du DateTimeField
  duration: string; // Format 'HH:MM:SS' pour DurationField
  max_participants: number;
  price: string; // Sera converti en DecimalField côté backend
  level: string; // Correspond aux choix du modèle Django
  venue: string; // Nouveau champ, correspond aux choix du modèle Django
  sport_zen: boolean;
  image: File | null;
  instructor: number | ''; // ID de l'instructeur
  is_public: boolean; // Nouveau champ, correspond au modèle Django
}



const AddActivityPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activity, setActivity] = useState<ActivityForm>({
    name: '',
    description: '',
    category: 'yoga',
    location_address: '',
    start_time_date: '',
    start_time_time: '',
    duration: '01:00:00', // Format par défaut pour DurationField
    max_participants: 20,
    price: '0.00', // Format par défaut pour DecimalField
    level: 'all', // Correspond à LevelChoices.ALL
    venue: 'indoor', // Correspond à VenueChoices.INDOOR
    sport_zen: false,
    image: null,
    instructor: '',
    is_public: true, // Par défaut, une activité est publique
  });

  const [coaches, setCoaches] = useState<User[]>([]);
  const [loadingCoaches, setLoadingCoaches] = useState<boolean>(true);

  useEffect(() => {
    const fetchCoaches = async () => {
      if (!user || !user.company) {
        console.warn("Utilisateur non authentifié ou sans entreprise associée. Impossible de charger les coachs.");
        setLoadingCoaches(false);
        return;
      }
      try {
        // Endpoint pour récupérer les coachs associés à l'entreprise de l'utilisateur
        const response = await axiosInstance.get<User[]>(`/companies/${user.company}/coaches/`);
        setCoaches(response.data);
        setLoadingCoaches(false);
      } catch (error) {
        console.error('Erreur lors du chargement des coachs:', error);
        toast.error('Erreur lors du chargement des coachs.');
        setLoadingCoaches(false);
      }
    };
    fetchCoaches();
  }, [user]); // Dépendance à user pour recharger si l'utilisateur change

  const handleChange = (
      e: ChangeEvent<HTMLInputElement> |
          ChangeEvent<HTMLSelectElement> |
          ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, type } = e.target;
    let value: string | boolean | File | null | number = e.target.value;

    if (type === 'checkbox') {
      value = (e.target as HTMLInputElement).checked;
    } else if (type === 'file') {
      value = (e.target as HTMLInputElement).files?.[0] || null;
    } else if (name === 'instructor' || name === 'max_participants') {
      // Convertir en nombre si ce n'est pas une chaîne vide pour instructor, ou toujours pour max_participants
      value = e.target.value === '' ? '' : Number(e.target.value);
    }

    setActivity(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const formData = new FormData();

    // Combinaison de la date et de l'heure pour start_time
    const fullStartTime = activity.start_time_date && activity.start_time_time
        ? `${activity.start_time_date}T${activity.start_time_time}:00Z` // Format ISO 8601 pour DateTimeField
        : '';

    for (const key in activity) {
      if (Object.prototype.hasOwnProperty.call(activity, key)) {
        const value = activity[key as keyof ActivityForm];

        // Gérer les champs spécifiques
        if (key === 'start_time_date' || key === 'start_time_time') {
          continue; // Ces champs sont combinés dans fullStartTime
        } else if (key === 'image' && value instanceof File) {
          formData.append(key, value);
        } else if (key === 'sport_zen' || key === 'is_public') {
          formData.append(key, value ? 'true' : 'false');
        } else if (key === 'instructor' && value !== '') {
          formData.append(key, String(value));
        } else if (value !== null && value !== '') {
          formData.append(key, String(value));
        }
      }
    }

    if (fullStartTime) {
      formData.append('start_time', fullStartTime);
    }

    console.log("FormData content:");
    for (const pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]}`);
    }

    try {
      await axiosInstance.post('/activities/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Correction du Content-Type
        },
      });
      toast.success('Activité créée avec succès ✅');
      navigate('/activities');
    } catch (error: any) {
      console.error('Erreur lors de l\'enregistrement de l\'activité:', error.response?.data || error.message);
      toast.error("Erreur lors de l'enregistrement ❌");
    }
  };

  return (
      <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-10">
        <Helmet>
          <title>Créer une nouvelle activité | SportRadar</title>
          <meta name="description" content="Ajoutez une nouvelle activité sportive à la plateforme SportRadar." />
          <meta property="og:title" content="Créer une nouvelle activité | SportRadar" />
          <meta property="og:description" content="Ajoutez une nouvelle activité sportive à la plateforme SportRadar." />
          {/* <meta property="og:image" content="[URL de l'image par défaut]" /> */}
          <meta property="og:type" content="website" />
        </Helmet>

        <h1 className="text-2xl font-bold mb-6 text-sky-700">Créer une activité</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom de l'activité</label>
            <input
                id="name"
                name="name"
                type="text"
                placeholder="Nom de l'activité"
                value={activity.name}
                onChange={handleChange}
                required
                className="mt-1 block w-full input-field"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
                id="description"
                name="description"
                placeholder="Description détaillée de l'activité"
                value={activity.description}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full input-field"
            />
          </div>
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">Catégorie</label>
            <select
                id="category"
                name="category"
                value={activity.category}
                onChange={handleChange}
                className="mt-1 block w-full input-field"
            >
              <option value="yoga">Yoga</option>
              <option value="fitness">Fitness</option>
              <option value="musculation">Musculation</option>
              <option value="cardio">Cardio</option>
              <option value="danse">Danse</option>
              <option value="sports_collectifs">Sports Collectifs</option>
              <option value="arts_martiaux">Arts Martiaux</option>
              <option value="autres">Autres</option>
            </select>
          </div>
          <div>
            <label htmlFor="location_address" className="block text-sm font-medium text-gray-700">Adresse de l'activité</label>
            <input
                id="location_address"
                name="location_address"
                type="text"
                placeholder="Adresse spécifique de l'activité"
                value={activity.location_address}
                onChange={handleChange}
                required
                className="mt-1 block w-full input-field"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_time_date" className="block text-sm font-medium text-gray-700">Date de début</label>
              <input
                  id="start_time_date"
                  name="start_time_date"
                  type="date"
                  value={activity.start_time_date}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full input-field"
              />
            </div>
            <div>
              <label htmlFor="start_time_time" className="block text-sm font-medium text-gray-700">Heure de début</label>
              <input
                  id="start_time_time"
                  name="start_time_time"
                  type="time"
                  value={activity.start_time_time}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full input-field"
              />
            </div>
          </div>
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Durée (HH:MM:SS)</label>
            <input
                id="duration"
                name="duration"
                type="text" // Type text pour permettre le format HH:MM:SS
                placeholder="Durée (ex: 01:30:00 pour 1h30)"
                value={activity.duration}
                onChange={handleChange}
                className="mt-1 block w-full input-field"
            />
          </div>
          <div>
            <label htmlFor="max_participants" className="block text-sm font-medium text-gray-700">Participants maximum</label>
            <input
                id="max_participants"
                name="max_participants"
                type="number"
                placeholder="Nombre maximum de participants"
                value={activity.max_participants}
                onChange={handleChange}
                min="1"
                className="mt-1 block w-full input-field"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">Prix</label>
            <input
                id="price"
                name="price"
                type="text"
                placeholder="Prix (ex: 15.00 ou 0.00 pour gratuit)"
                value={activity.price}
                onChange={handleChange}
                className="mt-1 block w-full input-field"
            />
          </div>
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-gray-700">Niveau requis</label>
            <select
                id="level"
                name="level"
                value={activity.level}
                onChange={handleChange}
                className="mt-1 block w-full input-field"
            >
              <option value="all">Tous niveaux</option>
              <option value="beginner">Débutant</option>
              <option value="intermediate">Intermédiaire</option>
              <option value="advanced">Avancé</option>
            </select>
          </div>
          <div>
            <label htmlFor="venue" className="block text-sm font-medium text-gray-700">Lieu (Intérieur/Extérieur)</label>
            <select
                id="venue"
                name="venue"
                value={activity.venue}
                onChange={handleChange}
                className="mt-1 block w-full input-field"
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
                checked={activity.sport_zen}
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
                checked={activity.is_public}
                onChange={handleChange}
                className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
            />
            <label htmlFor="is_public" className="ml-2 block text-sm text-gray-900">Cocher pour rendre l'activité visible publiquement.</label>
          </div>
          <div>
            <label htmlFor="instructor" className="block text-sm font-medium text-gray-700">Instructeur</label>
            <select
                id="instructor"
                name="instructor"
                value={activity.instructor}
                onChange={handleChange}
                className="mt-1 block w-full input-field"
                required
                disabled={loadingCoaches} // Désactiver pendant le chargement
            >
              <option value="">{loadingCoaches ? 'Chargement des coachs...' : 'Sélectionner un instructeur'}</option>
              {coaches.map(coach => (
                  <option key={coach.id} value={coach.id}>
                    {coach.first_name} {coach.last_name}
                  </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image de l'activité</label>
            <input
                id="image"
                name="image"
                type="file"
                onChange={handleChange}
                className="mt-1 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-sky-50 file:text-sky-700
              hover:file:bg-sky-100"
            />
            {activity.image && <p className="mt-2 text-sm text-gray-500">Fichier sélectionné : {activity.image.name}</p>}
          </div>
          <button
              type="submit"
              className="w-full bg-sky-600 text-white px-6 py-3 rounded-md hover:bg-sky-700 font-bold focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2"
          >
            Créer l’activité
          </button>
        </form>
      </div>
  );
};

export default AddActivityPage;
