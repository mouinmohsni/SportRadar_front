// File: src/pages/features/PlanificationFlexiblePage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar as CalendarIcon, ArrowLeft, CheckCircle } from 'lucide-react';

const planificationDetails = [
    'Glisser-déposer pour réorganiser le planning',
    'Notifications automatiques aux participants',
    'Intégration avec Google Calendar et Outlook'
];

const PlanificationFlexiblePage: React.FC = () => {
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
                        <CalendarIcon className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#0a1128]">Planification flexible</h1>
                </div>

                {/* Introduction courte */}
                <p className="text-gray-700">
                    Créez et ajustez facilement vos plannings grâce à des outils intuitifs
                    et automatisés qui s'adaptent à vos besoins. (En construction)
                </p>

                {/* Liste des points clés */}
                <ul className="list-disc list-inside space-y-2">
                    {planificationDetails.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="w-5 h-5 text-[#c44d00] flex-shrink-0 mt-1" />
                            <span className="text-gray-700 font-medium">{item}</span>
                        </li>
                    ))}
                </ul>

                {/* Sections détaillées */}
                <div className="mt-6 space-y-8">
                    <section>
                        <h4 className="text-xl font-semibold text-[#0a1128]">Glisser-déposer intuitif</h4>
                        <p className="text-gray-700">
                            Réorganisez vos plannings en un clic grâce au drag & drop,
                            et visualisez instantanément les modifications.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-xl font-semibold text-[#0a1128]">Notifications automatiques</h4>
                        <p className="text-gray-700">
                            Les participants reçoivent automatiquement des rappels par e-mail
                            ou SMS dès qu'un créneau leur est attribué ou modifié.
                        </p>
                    </section>

                    <section>
                        <h4 className="text-xl font-semibold text-[#0a1128]">Intégration calendrier</h4>
                        <p className="text-gray-700">
                            Synchronisez vos plannings avec Google Calendar ou Outlook pour
                            garantir une cohérence totale des agendas.
                        </p>
                    </section>
                </div>


            </div>
        </div>
    );
};

export default PlanificationFlexiblePage;
