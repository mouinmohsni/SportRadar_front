// File: src/components/PlanForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

interface PlanFormProps {
    planKey: 'basic' | 'intermediate' | 'enterprise';
}

const planLabels = {
    basic: 'Abonnement de base',
    intermediate: 'Abonnement intermédiaire',
    enterprise: 'Abonnement sur mesure'
};

const PlanForm: React.FC<PlanFormProps> = ({ planKey }) => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const [adminName, setAdminName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // File: src/components/PlanForm.tsx
    // …
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post('/api/subscriptions/', {
                plan: planKey,
                company_name: companyName,  // snake_case pour Django
                admin_name: adminName,      // snake_case
                email,
                phone,
                message,
            });
            toast.success('Demande envoyée !');
            navigate('/');
        } catch (error: any) {
            console.error("Erreur détaillée:", error.response?.data);  // Affiche l'erreur Django
            toast.error(error.response?.data?.detail || "Erreur lors de l'envoi");
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="min-h-screen bg-[#C7C5C5] py-10 px-4">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <h1 className="text-3xl font-bold text-[#0a1128] mb-6">
                    {planLabels[planKey]}
                </h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* ... mêmes champs que EnterpriseForm ... */}
                    <div>
                        <label className="block text-sm font-medium">Nom de l’entreprise</label>
                        <input
                            value={companyName}
                            onChange={e => setCompanyName(e.target.value)}
                            required
                            className="w-full border p-2 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Votre nom</label>
                        <input
                            value={adminName}
                            onChange={e => setAdminName(e.target.value)}
                            required
                            className="w-full border p-2 rounded-lg"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                className="w-full border p-2 rounded-lg"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium">Téléphone</label>
                            <input
                                value={phone}
                                onChange={e => setPhone(e.target.value)}
                                required
                                className="w-full border p-2 rounded-lg"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium">Message</label>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={4}
                            className="w-full border p-2 rounded-lg"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[#dc5f18] text-white py-3 rounded-lg font-semibold hover:brightness-110 disabled:opacity-50"
                    >
                        {loading ? 'Envoi…' : 'Soumettre'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PlanForm;
