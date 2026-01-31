
import React, { useEffect, useState, } from 'react';
import type { ChangeEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { useNavigate } from 'react-router-dom';
import avatarOptions from '../assets/avatars';
import { Helmet } from 'react-helmet-async';
import type {  UserPreferences } from "../types";
import axios from "axios";
import { getMediaUrl } from '../utils/media';

// --- Listes de constantes, ne changent pas ---
const locationOptions = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nice'];
const allObjectives = [
  'Perte de poids', 'Renforcement musculaire', 'Réduction du stress',
  'Amélioration de la flexibilité', 'Endurance cardio', 'Bien-être général', 'Socialisation'
];

const ProfilePage: React.FC = () => {
  const { user,  updateUser, fetchMe } = useAuth();
  const navigate = useNavigate();

  // --- CORRECTION PROBLÈME N°1 : Initialisation de l'état ---
  // On initialise l'état des préférences DIRECTEMENT à partir de 'user'.
  // Si 'user' ou 'user.preferences' n'existent pas, on fournit une valeur par défaut.
  // Cela évite d'avoir besoin d'un useEffect pour initialiser, ce qui causait la boucle infinie.
  const [preferences, setPreferences] = useState<UserPreferences>(
      user?.preferences || { location: '', level: '', objectives: [] }
  );

  const [status, setStatus] = useState('');
  const [avatarPreview, setAvatarPreview] = useState(avatarOptions.default);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Ce useEffect se déclenche SEULEMENT si l'objet 'user' du contexte change VRAIMENT.
  // Il est maintenant sûr et ne causera pas de boucle.
  useEffect(() => {
    if (user) {
      // Synchronise les préférences si elles existent dans le contexte
      setPreferences(user.preferences || { location: '', level: '', objectives: [] });
      // Synchronise l'aperçu de l'avatar
      const avatarUrl = getMediaUrl(user.avatar);
      console.log("avatarUrl",user)
      setAvatarPreview(avatarUrl || avatarOptions.default);
    }
  }, [user]); // La seule dépendance est 'user'.
 console.log(avatarPreview)
  // --- Fonctions de gestion du formulaire (inchangées) ---
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPreferences(prev => ({ ...prev, [name]: value }));
  };

  const handleObjectiveChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      objectives: checked ? [...prev.objectives, value] : prev.objectives.filter(o => o !== value)
    }));
  };

  // --- CORRECTION PROBLÈME N°2 : Logique d'upload de fichier ---
  // Cette fonction est UNIQUEMENT pour l'upload d'un NOUVEAU fichier.
  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user?.id) {
      setStatus('Erreur : Utilisateur non identifié.');
      return;
    }
    const file = e.target.files?.[0];
    if (!file) return;

    const form = new FormData();
    form.append('avatar', file); // L'API attend un champ 'avatar' de type fichier

    setUploading(true);
    setStatus('');
    setAvatarPreview(URL.createObjectURL(file));

    try {
      // On fait un appel PATCH avec FormData, ce qui est correct pour les fichiers.
      await axiosInstance.patch(`/users/${user.id}/`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchMe(); // On rafraîchit les données de l'utilisateur
      setStatus('Avatar mis à jour ✔️');
    } catch (error: unknown) {
      // ... (gestion d'erreur inchangée)
      let errorMessage = 'Une erreur inconnue est survenue.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.avatar?.[0] || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setStatus(`Échec de l'upload : ${errorMessage} ❌`);
    } finally {
      setUploading(false);
    }
  };

  // --- CORRECTION PROBLÈME N°2 : Logique de sélection d'avatar pré-défini ---
  // Cette fonction est UNIQUEMENT pour choisir un avatar de la liste.
  const handleAvatarSelect = async (key: string) => {
    if (uploading || saving || !user) return;

    setUploading(true);
    setStatus('');
    setAvatarPreview(avatarOptions[key as keyof typeof avatarOptions]);

    try {
      // On utilise la fonction 'updateUser' du contexte, qui envoie du JSON.
      // C'est correct car on envoie juste la clé de l'avatar, pas un fichier.
      await updateUser({ avatar: key });
      setStatus('Avatar mis à jour ✔️');
    } catch (error: unknown) {
      // ... (gestion d'erreur inchangée)
      let errorMessage = 'Une erreur inconnue est survenue.';
      if (axios.isAxiosError(error)) {
        errorMessage = error.response?.data?.detail || error.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }
      setStatus(`Erreur : ${errorMessage}`);
    } finally {
      setUploading(false);
    }
  };

  // --- Logique de soumission du profil (inchangée) ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser({ preferences: preferences });
      alert('Profil mis à jour avec succès !');
      navigate('/activities');
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil", error);
      alert('Erreur lors de la mise à jour.');
    } finally {
      setSaving(false);
    }
  };

  // --- Affichage (inchangé) ---
  if (!user) {
    return <p className="p-6">Chargement du profil…</p>;
  }

  console.log("avatarPreview",avatarPreview)


  return (
    <>
      <Helmet>
        <title>Profil - SportRadar</title>
        <meta name="description" content="Gérez vos informations personnelles et vos préférences SportRadar." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-[#C7C5C5] py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center mb-8">
            <img
              src={avatarPreview}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
            />
            <label className="mt-3 inline-block bg-[#0a1128] text-white px-4 py-2 rounded cursor-pointer">
              {uploading ? 'Upload...' : 'Changer l’avatar'}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                className="hidden"
                disabled={uploading || saving}
              />
            </label>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {Object.entries(avatarOptions).map(([key, img]) => (
                <img
                  key={key}
                  src={img}
                  alt={key}
                  className={`w-12 h-12 rounded-full cursor-pointer border-2 ${avatarPreview === img ? 'border-[#dc5f18]' : 'border-transparent'
                    }`}
                  onClick={() => handleAvatarSelect(key)}
                />
              ))}
            </div>
          </div>

          <h1 className="text-3xl font-bold mb-4 text-[#0a1128]">Mon profil</h1>
          <p><strong>Nom :</strong> {user.username}</p>
          <p><strong>Email :</strong> {user.email}</p>
          <p><strong>Type :</strong> {user.type}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-6">
            <div>
              <label className="block mb-1 font-medium">Localisation</label>
              <select
                name="location"
                value={preferences.location}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                disabled={saving}
              >
                <option value="">-- Sélectionner une ville --</option>
                {locationOptions.map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Niveau</label>
              <select
                name="level"
                value={preferences.level}
                onChange={handleChange}
                className="w-full border rounded px-3 py-2"
                disabled={saving}
              >
                <option value="">-- Sélectionner --</option>
                <option value="débutant">Débutant</option>
                <option value="intermédiaire">Intermédiaire</option>
                <option value="avancé">Avancé</option>
              </select>
            </div>

            <div>
              <label className="block mb-1 font-medium">Objectifs</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allObjectives.map(obj => (
                  <label key={obj} className="inline-flex items-center">
                    <input
                      type="checkbox"
                      value={obj}
                      checked={preferences.objectives.includes(obj)}
                      onChange={handleObjectiveChange}
                      className="mr-2"
                      disabled={saving}
                    />
                    {obj}
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="bg-[#dc5f18] text-white px-6 py-2 rounded hover:brightness-110 disabled:opacity-50"
              disabled={saving}
            >
              {saving ? 'Mise à jour...' : 'Mettre à jour'}
            </button>

            {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
          </form>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
