// src/pages/FaqPage.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

interface FaqItem {
    question: string;
    answer: string;
}

const faqs: FaqItem[] = [
    {
        question: "Comment m'inscrire à une activité ?",
        answer: "Rends-toi sur la page Activités, choisis l’activité qui t’intéresse et clique sur « S’inscrire ».",
    },
    {
        question: "Puis-je annuler mon inscription ?",
        answer: "Oui, depuis la même page d’activité, clique sur « Désinscription » avant la date limite indiquée.",
    },
    {
        question: "Comment fonctionnent les recommandations intelligentes ?",
        answer: "Nous combinons tes préférences personnelles, ta localisation et la météo pour te proposer les activités idéales.",
    },
    {
        question: "Qu'est-ce que le Badge SportZen ?",
        answer: "C’est un label décerné aux lieux favorisant bienveillance et non-compétition. Consulte la page Badge SportZen pour en savoir plus.",
    },
    {
        question: "Comment contacter le support ?",
        answer: "Utilise la page Contact pour nous envoyer un message, nous te répondrons dans les 24h.",
    },
];

const FaqPage: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>FAQ - SportRadar</title>
                <meta name="description" content="Trouvez les réponses aux questions fréquentes sur notre plateforme SportRadar." />
                <meta name="robots" content="index, follow" />
            </Helmet>

            <div className="min-h-screen bg-[#C7C5C5] py-16 px-4 flex flex-col items-center">
                {/* Bouton retour */}
                <Link
                    to="/"
                    className="flex items-center text-[#0a1128] hover:text-[#c44d00] mb-8"
                >
                    <Home className="w-5 h-5 mr-2" />
                    Retour à l’accueil
                </Link>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-8 space-y-6"
                >
                    <h1 className="text-3xl font-bold text-[#0a1128] text-center">
                        Foire Aux Questions
                    </h1>

                    <div className="divide-y divide-gray-200">
                        {faqs.map((item, idx) => (
                            <div key={idx} className="py-4">
                                <h2 className="text-xl font-semibold text-[#0a1128] mb-2">
                                    {item.question}
                                </h2>
                                <p className="text-gray-700">{item.answer}</p>
                            </div>
                        ))}
                    </div>

                    {/* Section Abonnements */}
                    <section className="pt-8">
                        <h2 className="text-2xl font-bold text-[#0a1128] mb-2">
                            Nos formules d’abonnement
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            SportRadar propose trois formules :
                            <strong> Basique</strong> pour les particuliers souhaitant un accès simple,
                            <strong> Intermédiaire</strong> pour un suivi approfondi et
                            <strong> Sur mesure</strong> pour les entreprises ou utilisateurs exigeants.
                            Chacune inclut l’accès à toutes les activités, des recommandations personnalisées et un support dédié.
                        </p>
                    </section>

                    {/* Section Dashboard */}
                    <section className="pt-6">
                        <h2 className="text-2xl font-bold text-[#0a1128] mb-2">
                            Votre Dashboard
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Une fois connecté·e, accédez à votre tableau de bord qui regroupe :
                            <ul className="list-disc list-inside mt-2">
                                <li>Vos activités à venir et passées.</li>
                                <li>Vos recommandations intelligentes actualisées.</li>
                                <li>Votre badge SportZen (si entreprise).</li>
                                <li>Votre historique et statistiques de participation.</li>
                            </ul>
                        </p>
                    </section>

                    {/* Section Profil & Objectifs */}
                    <section className="pt-6">
                        <h2 className="text-2xl font-bold text-[#0a1128] mb-2">
                            Mettre à jour votre profil
                        </h2>
                        <p className="text-gray-700 leading-relaxed">
                            Dans <Link to="/profile" className="text-[#c44d00] hover:underline">votre profil</Link>, définissez vos objectifs (remise en forme, endurance, bien-être, etc.).
                            Nos recommandations s’adaptent ensuite automatiquement à vos préférences et votre niveau.
                        </p>
                    </section>
                </motion.div>
            </div>
        </>
    );
};

export default FaqPage;
