// src/pages/CorporateOffersPage.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Shield,
    CheckCircle,
    Calendar as CalendarIcon,
    Users as UsersIcon,
} from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet-async';

const benefits = [
    "Amélioration du bien-être de vos équipes",
    "Renforcement de la cohésion",
    "Réduction du stress et de l’absentéisme",
    "Image employeur valorisée",
];

const plans = [
    {
        key: 'basic',
        name: 'Abonnement de base',
        price: '40€',
        period: 'mois',
        popular: false,
        features: ['Engagement pour 3 mois', 'Toutes les activités', 'Récommandations personnalisées', 'Support email', 'Rapports mensuels']
    },
    {
        key: 'intermediaire',
        name: 'Abonnement intermédiare',
        price: '25€',
        period: 'mois',
        popular: true,
        features: [
            'Engagement pour 12 mois',
            'Toutes les activités ',
            'Récommandations personnalisées',
            'Support email',
            'Rapports mensuels'


        ]
    },
    {
        key: 'enterprise',
        name: 'Abonnement sur mesure',
        price: '60€',
        period: 'mois',
        popular: false,
        features: [
            'Sans engagement',
            'A partir de 15 personnes',
            'Toutes les activités',
            'Activités proposées',
            'Coatch à domicile (bureau)',
            'Rapports personnalisés',
            'Récommandations personnalisées',
            'Intégration SIRH'
        ]
    }
];

const CorporateOffersPage: React.FC = () => {
    const navigate = useNavigate();

    // états du formulaire
    const [selectedPlan, setSelectedPlan] = useState<string>('basic');

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
            await axiosInstance.post(
                // <- on passe sur l’endpoint subscriptions (défini dans subscriptions/urls.py)
                'subscriptions/',
                {
                    plan: selectedPlan,
                    company_name: companyName,
                    admin_name: adminName,
                    email,
                    phone,
                    message,
                }
            );
            toast.success('Votre demande a bien été envoyée !');
            navigate('/');
        } catch (err: any) {
            console.error('Erreur subscription:', err.response?.status, err.response?.data);
            toast.error(
                err.response
                    ? `Erreur ${err.response.status}: ${JSON.stringify(err.response.data)}`
                    : 'Erreur lors de l’envoi, réessayez.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Offres Entreprises - SportRadar</title>
                <meta name="description" content="Proposez à vos équipes un programme de bien-être sportif adapté à leurs besoins." />
                <meta name="robots" content="index, follow" />
            </Helmet>

            <div className="min-h-screen bg-[#C7C5C5] py-16 px-4">
                <div className="max-w-6xl mx-auto space-y-16">

                    {/* Hero */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center bg-gradient-to-r from-[#0a1128] to-[#14213d] text-white rounded-2xl p-8"
                    >
                        <Shield className="mx-auto w-16 h-16 text-[#c44d00] mb-4" />
                        <h1 className="text-4xl lg:text-5xl font-extrabold mb-2">Offres entreprises</h1>
                        <p className="text-lg">
                            Solutions bien-être sur mesure pour les professionnels : boostez l’engagement et la cohésion de vos équipes.
                        </p>
                    </motion.section>

                    {/* Benefits */}
                    <section className="bg-white shadow-lg rounded-2xl p-8">
                        <div className="lg:flex lg:gap-8">
                            <div className="lg:w-1/2">
                                <h2 className="text-2xl font-bold text-[#0a1128] mb-4">Des bénéfices concrets</h2>
                                <ul className="space-y-3">
                                    {benefits.map((b, i) => (
                                        <li key={i} className="flex items-center space-x-3">
                                            <CheckCircle className="w-6 h-6 text-[#c44d00]" />
                                            <span className="text-gray-600">{b}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="lg:w-1/2 grid grid-cols-2 gap-6 mt-8 lg:mt-0">
                                <div className="p-4 bg-gray-50 rounded-lg text-center">
                                    <CalendarIcon className="w-10 h-10 text-[#0a1128] mx-auto mb-2" />
                                    <div className="font-bold text-[#c44d00] text-2xl">+23%</div>
                                    <div className="text-gray-600 text-sm">Productivité</div>
                                </div>
                                <div className="p-4 bg-gray-50 rounded-lg text-center">
                                    <UsersIcon className="w-10 h-10 text-[#0a1128] mx-auto mb-2" />
                                    <div className="font-bold text-[#c44d00] text-2xl">92%</div>
                                    <div className="text-gray-600 text-sm">Engagement</div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Pricing */}
                    <section id="pricing" className="bg-white shadow-lg rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-[#0a1128] mb-6 text-center">
                            Choisissez votre formule
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {plans.map(pl => (
                                <div
                                    key={pl.key}
                                    className={`p-6 rounded-lg border ${pl.popular ? 'border-[#c44d00]' : 'border-gray-200'} transition`}
                                >
                                    {pl.popular && (
                                        <span className="inline-block mb-4 bg-[#c44d00] text-white px-3 py-1 rounded-full text-sm">
                                            Populaire
                                        </span>
                                    )}
                                    <h3 className="text-xl font-semibold text-[#0a1128] mb-2">{pl.name}</h3>
                                    <div className="text-3xl font-bold text-[#c44d00] mb-4">
                                        {pl.price}
                                        {pl.period && <span className="text-gray-600 text-lg">/{pl.period}</span>}
                                    </div>
                                    <ul className="space-y-2 mb-6 text-gray-600 text-sm">
                                        {pl.features.map((f, idx) => (
                                            <li key={idx} className="flex items-center space-x-2">
                                                <CheckCircle className="w-4 h-4 text-[#c44d00]" />
                                                <span>{f}</span>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        onClick={() => setSelectedPlan(pl.key)}
                                        className={`w-full py-2 rounded-lg font-semibold transition ${selectedPlan === pl.key
                                            ? 'bg-[#c44d00] text-[#0A1128]'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {selectedPlan === pl.key ? 'Sélectionné' : 'Choisir'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Formulaire */}
                    <section className="bg-white shadow-lg rounded-2xl p-8">
                        <h2 className="text-2xl font-bold text-[#0a1128] mb-4 text-center">Nous contacter</h2>
                        <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
                            {/* choix du plan */}
                            <fieldset className="space-y-2">
                                <legend className="font-medium text-[#0a1128]">Type d’abonnement</legend>
                                <div className="flex space-x-4">
                                    {plans.map(pl => (
                                        <label key={pl.key} className="flex items-center space-x-2">
                                            <input
                                                type="radio"
                                                name="plan"
                                                value={pl.key}
                                                checked={selectedPlan === pl.key}
                                                onChange={() => setSelectedPlan(pl.key)}
                                            />
                                            <span>{pl.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            {/* champs du form */}
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
                                <label className="block text-sm font-medium">Message (optionnel)</label>
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
                                className="w-full bg-[#c44d00] text-[#0A1128] py-3 rounded-lg font-semibold hover:brightness-110 disabled:opacity-50"
                            >
                                {loading ? 'Envoi…' : 'Nous contacter'}
                            </button>
                        </form>
                    </section>

                </div>
            </div>
        </>
    );
};

export default CorporateOffersPage;
