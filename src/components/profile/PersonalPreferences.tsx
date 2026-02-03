// File: src/components/profile/PersonalPreferences.tsx
import React, { useState } from 'react';
import type { ChangeEvent } from 'react';
import axiosInstance from '../../api/axiosInstance';
import type { UserPreferences, User } from '../../types';
import axios from 'axios';

interface PersonalPreferencesProps {
    user: User;
    onUpdate: () => void;
}

const locationOptions = ['Paris', 'Lyon', 'Marseille', 'Bordeaux', 'Nice', 'Toulouse', 'Nantes', 'Strasbourg'];
const allObjectives = [
    'Perte de poids',
    'Renforcement musculaire',
    'Réduction du stress',
    'Amélioration de la flexibilité',
    'Endurance cardio',
    'Bien-être général',
    'Socialisation'
];

const PersonalPreferences: React.FC<PersonalPreferencesProps> = ({ user, onUpdate }) => {
    // Initialisation robuste : on s'assure que objectives est TOUJOURS un tableau
    const [preferences, setPreferences] = useState<UserPreferences>(() => {
        const defaultPrefs = { location: '', level: '', objectives: [] };
        if (!user.preferences) return defaultPrefs;

        return {
            ...defaultPrefs,
            ...user.preferences,
            objectives: Array.isArray(user.preferences.objectives) ? user.preferences.objectives : []
        };
    });

    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState('');

    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setPreferences(prev => ({ ...prev, [name]: value }));
    };

    const handleObjectiveChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = e.target;

        setPreferences(prev => {
            // Sécurité : on s'assure que prev.objectives est bien un tableau avant de le manipuler
            const currentObjectives = Array.isArray(prev?.objectives) ? prev.objectives : [];

            const newObjectives = checked
                ? [...currentObjectives, value]
                : currentObjectives.filter(o => o !== value);

            return {
                ...prev,
                objectives: newObjectives
            };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setStatus('');

        try {
            await axiosInstance.patch(`/api/users/me/update/`, {
                preferences: preferences
            });
            onUpdate();
            setStatus('✔️ Préférences mises à jour avec succès !');
        } catch (error: unknown) {
            let errorMessage = 'Une erreur inconnue est survenue.';
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.detail || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setStatus(`❌ Erreur : ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#0a1128] mb-4">🎯 Préférences Sportives</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Localisation */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Localisation préférée</label>
                    <select
                        name="location"
                        value={preferences?.location || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                        disabled={saving}
                    >
                        <option value="">-- Sélectionner une ville --</option>
                        {locationOptions.map(v => (
                            <option key={v} value={v}>{v}</option>
                        ))}
                    </select>
                </div>

                {/* Niveau */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Niveau sportif</label>
                    <select
                        name="level"
                        value={preferences?.level || ''}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                        disabled={saving}
                    >
                        <option value="">-- Sélectionner --</option>
                        <option value="débutant">Débutant</option>
                        <option value="intermédiaire">Intermédiaire</option>
                        <option value="avancé">Avancé</option>
                    </select>
                </div>

                {/* Objectifs */}
                <div>
                    <label className="block mb-2 font-medium text-gray-700">Objectifs sportifs</label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {allObjectives.map(obj => (
                            <label key={obj} className="inline-flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input
                                    type="checkbox"
                                    value={obj}
                                    // Utilisation de l'optional chaining et repli sur tableau vide pour éviter le crash
                                    checked={preferences?.objectives?.includes(obj) || false}
                                    onChange={handleObjectiveChange}
                                    className="mr-2 w-4 h-4 text-[#dc5f18] focus:ring-[#dc5f18]"
                                    disabled={saving}
                                />
                                <span className="text-gray-700">{obj}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-[#dc5f18] text-white px-6 py-2 rounded hover:bg-[#b84f14] transition-colors disabled:opacity-50"
                    disabled={saving}
                >
                    {saving ? 'Enregistrement...' : 'Enregistrer les préférences'}
                </button>

                {status && (
                    <p className={`mt-2 text-sm ${status.includes('✔️') ? 'text-green-600' : 'text-red-600'}`}>
                        {status}
                    </p>
                )}
            </form>
        </div>
    );
};

export default PersonalPreferences;
