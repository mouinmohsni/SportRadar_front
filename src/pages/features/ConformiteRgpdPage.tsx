// File: src/pages/features/ConformiteRgpdPage.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, CheckCircle } from 'lucide-react';

const rgpdDetails = [
    'Stockage chiffré des informations sensibles',
    'Gestion des droits d’accès et preuves de consentement',
    'Journalisation des opérations pour audit'
];

const ConformiteRgpdPage: React.FC = () => {
    const navigate = useNavigate();
    useEffect(() => { window.scrollTo(0, 0); }, []);

    return (
        <div className="min-h-screen bg-[#C7C5C5] py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8">
                <button onClick={() => navigate(-1)} className="flex items-center text-[#0a1128] hover:text-[#c44d00]">
                    <ArrowLeft className="w-5 h-5 mr-2" /> Retour
                </button>
                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#c44d00] rounded-md">
                        <Shield className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#0a1128]">Conformité RGPD</h1>
                </div>
                <p className="text-gray-700">
                    Assurez la protection des données de vos employés grâce à une conformité totale aux exigences RGPD.
                </p>
                <ul className="list-disc list-inside space-y-2">
                    {rgpdDetails.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                            <CheckCircle className="w-5 h-5 text-[#c44d00] mt-1" />
                            <span className="text-gray-700 font-medium">{item}</span>
                        </li>
                    ))}
                </ul>
                <div className="mt-6 space-y-8">
                    <section>
                        <h4 className="text-xl font-semibold text-[#0a1128]">Chiffrement renforcé</h4>
                        <p className="text-gray-700">
                            Toutes les données sensibles sont stockées et transférées via des protocoles de chiffrement AES-256.
                        </p>
                    </section>
                    <section>
                        <h4 className="text-xl font-semibold text-[#0a1128]">Gestion des accès</h4>
                        <p className="text-gray-700">
                            Contrôlez qui accède à quelles informations, avec un historique complet des consentements.
                        </p>
                    </section>
                    <section>
                        <h4 className="text-xl font-semibold text-[#0a1128]">Journalisation d’audit</h4>
                        <p className="text-gray-700">
                            Conservez une trace immuable des opérations pour simplifier vos rapports d’audit.
                        </p>
                    </section>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <img src="/images/features/rgpd-encryption.png" alt="AES-256 Encryption" className="rounded-lg shadow" />
                    <img src="/images/features/rgpd-audit.png" alt="Audit logs" className="rounded-lg shadow" />
                </div>
            </div>
        </div>
    );
};

export default ConformiteRgpdPage;
