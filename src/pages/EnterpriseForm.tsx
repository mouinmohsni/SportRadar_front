// File: src/pages/EnterpriseForm.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';

const EnterpriseForm: React.FC = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const [adminName, setAdminName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axiosInstance.post('/api/companies/signup/', {
                plan: 'Enterprise',
                companyName,
                adminName,
                email,
                phone,
                message,
            });
            toast.success('Votre demande Enterprise a été envoyée !');
            navigate('/');
        } catch {
            toast.error('Erreur lors de l’envoi, réessayez.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#C7C5C5] py-10 px-4">
            <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-[#0a1128] hover:text-[#dc5f18] mb-4"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" /> Retour
                </button>

                <h1 className="text-3xl font-bold text-[#0a1128] mb-6">
                    Contact Entreprise
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                        <label className="block text-sm font-medium">Vos besoins / message</label>
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
                        {loading ? 'Envoi…' : 'Nous contacter'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EnterpriseForm;
