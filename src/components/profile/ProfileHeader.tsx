// File: src/components/profile/ProfileHeader.tsx
import React, { useState } from 'react';
// import type { ChangeEvent } from 'react';
import axiosInstance from '../../api/axiosInstance';
import avatarOptions from '../../assets/avatars';
import { getMediaUrl } from '../../utils/media';
import axios from 'axios';
import type { User } from '../../types';

interface ProfileHeaderProps {
    user: User;
    onUpdate: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, onUpdate }) => {
    const [avatarPreview, setAvatarPreview] = useState(
        getMediaUrl(user.avatar) || avatarOptions.default
    );
    const [uploading, setUploading] = useState(false);
    const [status, setStatus] = useState('');
    const [firstName, setFirstName] = useState(user.first_name || '');
    const [lastName, setLastName] = useState(user.last_name || '');
    const [saving, setSaving] = useState(false);

    // Upload d'un fichier avatar personnalisé
    const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const form = new FormData();
        form.append('avatar', file);

        setUploading(true);
        setStatus('');
        setAvatarPreview(URL.createObjectURL(file));

        try {
            await axiosInstance.patch(`/api/users/me/update/`, form, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            onUpdate();
            setStatus('Avatar mis à jour ✔️');
        } catch (error: unknown) {
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

    // Sélection d'un avatar pré-défini
    const handleAvatarSelect = async (key: string) => {
        if (uploading || saving) return;

        setUploading(true);
        setStatus('');
        setAvatarPreview(avatarOptions[key as keyof typeof avatarOptions]);

        try {
            await axiosInstance.patch(`/api/users/me/update/`, { avatar: key });
            onUpdate();
            setStatus('Avatar mis à jour ✔️');
        } catch (error: unknown) {
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

    // Sauvegarde des informations personnelles
    const handleSaveInfo = async () => {
        setSaving(true);
        setStatus('');

        try {
            await axiosInstance.patch(`/api/users/me/update/`, {
                first_name: firstName,
                last_name: lastName
            });
            onUpdate();
            setStatus('Informations mises à jour ✔️');
        } catch (error: unknown) {
            let errorMessage = 'Une erreur inconnue est survenue.';
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.detail || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setStatus(`Erreur : ${errorMessage} ❌`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Avatar Section */}
            <div className="flex flex-col items-center mb-6">
                <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full border-4 border-[#0a1128] object-cover shadow-md"
                />
                <label className="mt-3 inline-block bg-[#0a1128] text-white px-4 py-2 rounded cursor-pointer hover:bg-[#1a2138] transition-colors">
                    {uploading ? 'Upload...' : 'Changer l\'avatar'}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={uploading || saving}
                    />
                </label>

                {/* Avatars pré-définis */}
                <div className="mt-4 grid grid-cols-5 gap-2">
                    {Object.entries(avatarOptions).map(([key, img]) => (
                        <img
                            key={key}
                            src={img}
                            alt={key}
                            className={`w-12 h-12 rounded-full cursor-pointer border-2 hover:border-[#dc5f18] transition-colors ${
                                avatarPreview === img ? 'border-[#dc5f18]' : 'border-transparent'
                            }`}
                            onClick={() => handleAvatarSelect(key)}
                        />
                    ))}
                </div>
            </div>

            {/* Informations Personnelles */}
            <div className="space-y-4">
                <h2 className="text-2xl font-bold text-[#0a1128] mb-4">📝 Informations Personnelles</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Prénom</label>
                        <input
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                            placeholder="Votre prénom"
                            disabled={saving}
                        />
                    </div>

                    <div>
                        <label className="block mb-1 font-medium text-gray-700">Nom</label>
                        <input
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                            placeholder="Votre nom"
                            disabled={saving}
                        />
                    </div>
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Nom d'utilisateur</label>
                    <input
                        type="text"
                        value={user.username}
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        disabled
                    />
                    <p className="text-sm text-gray-500 mt-1">Le nom d'utilisateur ne peut pas être modifié</p>
                </div>

                <div>
                    <label className="block mb-1 font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        value={user.email}
                        className="w-full border border-gray-300 rounded px-3 py-2 bg-gray-100"
                        disabled
                    />
                    <p className="text-sm text-gray-500 mt-1">L'email ne peut pas être modifié</p>
                </div>

                <button
                    onClick={handleSaveInfo}
                    className="bg-[#dc5f18] text-white px-6 py-2 rounded hover:bg-[#b84f14] transition-colors disabled:opacity-50"
                    disabled={saving || uploading}
                >
                    {saving ? 'Enregistrement...' : 'Enregistrer les modifications'}
                </button>

                {status && (
                    <p className={`mt-2 text-sm ${status.includes('✔️') ? 'text-green-600' : 'text-red-600'}`}>
                        {status}
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProfileHeader;
