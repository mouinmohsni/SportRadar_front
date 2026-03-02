// File: src/pages/features/GestionEquipePage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowLeft, CheckCircle } from 'lucide-react';

const details = [
    'Tableau de bord récapitulatif des sessions planifiées',
    'Assignation des tâches et des créneaux par collaborateur',
    'Suivi en temps réel des présences et des performances',
    'Rapports automatisés envoyés par e-mail'
];

const GestionEquipePage: React.FC = () => {
    const navigate = useNavigate();

    // Scroll to top when page loads
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="min-h-screen bg-[#C7C5C5] py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8">
                {/* Bouton Retour */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-[#0a1128] hover:text-[#c44d00] transition"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    <span>Retour</span>
                </button>

                {/* En-tête */}
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#c44d00] rounded-md">
                        <Users className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#0a1128]">Gestion d'équipe</h1>
                </div>

                {/* Introduction */}
                <p className="text-gray-700">
                    Optimisez la coordination de vos collaborateurs grâce à notre suite d’outils dédiée à la planification,
                    la gestion des présences et l’analyse des performances.
                </p>

                {/* Points clés */}
                <ul className="list-disc list-inside space-y-2">
                    {details.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="w-5 h-5 text-[#c44d00] flex-shrink-0 mt-1" />
                            <span className="text-gray-700 font-medium">{item}</span>
                        </li>
                    ))}
                </ul>

                {/* Sections détaillées */}
                <div className="mt-6 space-y-8">
                    <section>
                        <h4 className="text-xl font-semibold text-[#0a1128]">Tableau de bord récapitulatif</h4>
                        <p className="text-gray-700">
                            Accédez à une vue d’ensemble de toutes les sessions planifiées et passées, avec des filtres dynamiques
                            par date, équipe et type d’activité.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-xl font-semibold text-[#0a1128]">Assignation par collaborateur</h4>
                        <p className="text-gray-700">
                            Gérez rapidement les disponibilités et assignez des créneaux via glisser-déposer, avec notifications
                            automatiques envoyées aux participants.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-xl font-semibold text-[#0a1128]">Suivi en temps réel</h4>
                        <p className="text-gray-700">
                            Surveillez en direct les présences et performances de chaque collaborateur, et identifiez immédiatement
                            les points de progression.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-xl font-semibold text-[#0a1128]">Rapports automatisés</h4>
                        <p className="text-gray-700">
                            Planifiez l’envoi automatique de rapports détaillés par e-mail, au format PDF ou HTML,
                            sans effort manuel.
                        </p>
                    </section>
                </div>

                {/* Illustrations */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <img
                        src="/images/features/gestion-equipe-1.png"
                        alt="Tableau de bord"
                        className="w-full h-auto rounded-lg shadow"
                    />
                    <img
                        src="/images/features/gestion-equipe-2.png"
                        alt="Assignation collaborateurs"
                        className="w-full h-auto rounded-lg shadow"
                    />
                </div>
            </div>
        </div>
    );
};

export default GestionEquipePage;
