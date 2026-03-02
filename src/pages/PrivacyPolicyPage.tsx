// src/pages/PrivacyPolicyPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const PrivacyPolicyPage: React.FC = () => (
    <>
        <Helmet>
            <title>Politique de confidentialité - SportRadar</title>
            <meta name="description" content="Apprenez comment SportRadar protège vos données personnelles." />
            <meta name="robots" content="index, follow" />
        </Helmet>

        <div className="min-h-screen bg-[#C7C5C5] py-16 px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
                <h1 className="text-4xl font-bold text-[#0a1128] text-center">Politique de confidentialité</h1>

                {/* Introduction */}
                <section>
                    <p className="text-gray-700">
                        Votre vie privée nous importe. Cette politique explique quelles données nous collectons,
                        comment nous les utilisons, et vos droits à ce sujet.
                    </p>
                </section>

                {/* 1. Données collectées */}
                <section>
                    <h2 className="text-2xl font-semibold text-[#0a1128] mb-2">1. Données collectées</h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Informations de compte (nom, email)</li>
                        <li>Données de géolocalisation (pour les recommandations)</li>
                        <li>Historique d’utilisation et préférences</li>
                        <li>Données que vous soumettez via nos formulaires</li>
                    </ul>
                </section>

                {/* 2. Utilisation des données */}
                <section>
                    <h2 className="text-2xl font-semibold text-[#0a1128] mb-2">2. Utilisation des données</h2>
                    <p className="text-gray-700">
                        Nous utilisons vos données pour :
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Fournir et améliorer nos services</li>
                        <li>Envoyer des emails de confirmation et newsletters (si vous y avez consenti)</li>
                        <li>Personnaliser les recommandations d’activités</li>
                        <li>Analyser l’usage afin d’optimiser l’application</li>
                    </ul>
                </section>

                {/* 3. Partage et sécurité */}
                <section>
                    <h2 className="text-2xl font-semibold text-[#0a1128] mb-2">3. Partage et sécurité</h2>
                    <p className="text-gray-700">
                        Nous ne vendons jamais vos données. Nous partageons uniquement :
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Avec des prestataires techniques (hébergement, email)</li>
                        <li>Lorsque la loi l’exige</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Nous mettons en œuvre des mesures techniques et organisationnelles pour sécuriser vos données.
                    </p>
                </section>

                {/* 4. Vos droits */}
                <section>
                    <h2 className="text-2xl font-semibold text-[#0a1128] mb-2">4. Vos droits</h2>
                    <p className="text-gray-700">
                        Conformément au RGPD, vous pouvez :
                    </p>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        <li>Accéder à vos données</li>
                        <li>Les corriger ou les supprimer</li>
                        <li>Vous opposer ou limiter leur traitement</li>
                        <li>Retirer votre consentement à tout moment</li>
                    </ul>
                    <p className="text-gray-700 mt-2">
                        Pour exercer ces droits, contactez-nous à&nbsp;
                        <a href="#" className="text-[#c44d00] hover:underline">
                            contact@sportradar.com
                        </a>.
                    </p>
                </section>

                {/* Retour à l’accueil */}
                <div className="text-center">
                    <Link to="/" className="text-[#c44d00] hover:underline font-semibold">
                        ← Retour à l’accueil
                    </Link>
                </div>
            </div>
        </div>
    </>
);

export default PrivacyPolicyPage;
