// File: src/components/profile/PasswordChangeForm.tsx
import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordChangeFormProps {
    userId: number;
}

const PasswordChangeForm: React.FC<PasswordChangeFormProps> = ({ userId }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [status, setStatus] = useState('');
    const [saving, setSaving] = useState(false);
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    console.log(userId)
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('');

        // Validation
        if (!oldPassword || !newPassword || !confirmPassword) {
            setStatus('❌ Tous les champs sont requis');
            return;
        }

        if (newPassword !== confirmPassword) {
            setStatus('❌ Les nouveaux mots de passe ne correspondent pas');
            return;
        }

        if (newPassword.length < 8) {
            setStatus('❌ Le nouveau mot de passe doit contenir au moins 8 caractères');
            return;
        }

        setSaving(true);

        try {
            await axiosInstance.post('/auth/change-password/', {
                old_password: oldPassword,
                new_password: newPassword
            });
            setStatus('✔️ Mot de passe modifié avec succès !');
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error: unknown) {
            let errorMessage = 'Une erreur inconnue est survenue.';
            if (axios.isAxiosError(error)) {
                errorMessage = error.response?.data?.old_password?.[0]
                    || error.response?.data?.new_password?.[0]
                    || error.response?.data?.detail
                    || error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }
            setStatus(`❌ ${errorMessage}`);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#0a1128] mb-4">🔒 Changer le Mot de Passe</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Ancien mot de passe */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Ancien mot de passe</label>
                    <div className="relative">
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                            placeholder="Votre ancien mot de passe"
                            disabled={saving}
                        />
                        <button
                            type="button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Nouveau mot de passe */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Nouveau mot de passe</label>
                    <div className="relative">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                            placeholder="Minimum 8 caractères"
                            disabled={saving}
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                {/* Confirmer le nouveau mot de passe */}
                <div>
                    <label className="block mb-1 font-medium text-gray-700">Confirmer le nouveau mot de passe</label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full border border-gray-300 rounded px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-[#dc5f18]"
                            placeholder="Retapez le nouveau mot de passe"
                            disabled={saving}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                        >
                            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="bg-[#dc5f18] text-white px-6 py-2 rounded hover:bg-[#b84f14] transition-colors disabled:opacity-50"
                    disabled={saving}
                >
                    {saving ? 'Modification...' : 'Modifier le mot de passe'}
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

export default PasswordChangeForm;
