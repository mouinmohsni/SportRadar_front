// src/pages/LegalPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

const LegalPage: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Mentions légales - SportRadar</title>
                <meta name="description" content="Consultez les mentions légales de notre site et notre politique de transparence." />
                <meta name="robots" content="index, follow" />
            </Helmet>

            <div className="min-h-screen bg-[#C7C5C5] py-16 px-4">
                <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
                    <h1 className="text-4xl font-bold text-[#0a1128] text-center mb-4">Mentions légales</h1>

                    {/* Éditeur du site */}
                    <section>
                        <h2 className="text-2xl font-semibold text-[#0a1128] mb-2">Éditeur</h2>
                        <p className="text-gray-700">
                            VitaMobilis <br />
                            Adresse : 15 avenue de Marseille, 69007 Lyon, France<br />
                            SAS - RCS Lyon 823 456 789 <br />
                            SIREN :  841 222 897  <br />
                             Email : contact@vitamobilis.fr <br/>
                             Téléphone. : +33 4 66 85 94 91<br />

                        </p>
                    </section>

                    {/* Hébergeur */}
                    <section>
                        <h2 className="text-2xl font-semibold text-[#0a1128] mb-2">Hébergeur</h2>
                        <p className="text-gray-700">
                            render Inc.<br />
                            525 Brannan St, 300, San Francisco, California 94107, US<br />
                            Site : <a href="https://render.com" className="text-[#c44d00] hover:underline">render.com</a>
                        </p>
                    </section>

                    {/* Propriété intellectuelle */}
                    <section>
                        <h2 className="text-2xl font-semibold text-[#0a1128] mb-2">Propriété intellectuelle</h2>
                        <p className="text-gray-700">
                            Tous les contenus (textes, images, logos, vidéos, etc.) présents sur SportRadar sont la propriété exclusive de SportRadar ou de ses partenaires.
                            Toute reproduction, distribution ou adaptation, en tout ou partie, est strictement interdite sans autorisation écrite préalable.
                        </p>
                    </section>

                    {/* Données personnelles */}
                    <section>
                        <h2 className="text-2xl font-semibold text-[#0a1128] mb-2">Données personnelles</h2>
                        <p className="text-gray-700">
                            Conformément à la loi « Informatique et Libertés » du 6 janvier 1978 modifiée et au RGPD, vous disposez d’un droit d’accès, de rectification et de suppression des données qui vous concernent.
                            Pour l’exercer, contactez-nous à l’adresse : <a href="mailto:contact@sportradar.com" className="text-[#c44d00] hover:underline">contact@sportradar.com</a>.
                        </p>
                    </section>

                    {/* Cookies */}
                    <section>
                        <h2 className="text-2xl font-semibold text-[#0a1128] mb-2">Cookies</h2>
                        <p className="text-gray-700">
                            Ce site utilise des cookies indispensables à son fonctionnement et à la mesure d’audience. Vous pouvez désactiver ces traceurs via les paramètres de votre navigateur.
                        </p>
                    </section>

                    {/* Responsabilité */}
                    <section>
                        <h2 className="text-2xl font-semibold text-[#0a1128] mb-2">Responsabilité</h2>
                        <p className="text-gray-700">
                            VitaMobilis ne saurait être tenue responsable des dommages directs ou indirects pouvant résulter de l’accès ou de l’utilisation du site.
                        </p>
                    </section>

                    {/* Conditions d’utilisation*/}
                    <section>
                        <h2 className="text-2xl font-semibold text-[#0a1128] mb-2">Conditions d’utilisation</h2>
                        <p className="text-gray-700">
                            L’utilisation de ce site implique l’acceptation pleine et entière des présentes conditions.
                        </p>
                    </section>

                    {/* Date de mise à jour*/}
                    <section>
                        <h2 className="text-2xl font-semibold text-[#0a1128] mb-2">Dernière mise à jour</h2>
                        <p className="text-gray-700">
                            16 juillet 2025.
                            ’il s’agit d’un projet étudiant fictif pour lequel aucun réel
                            achat ou aucune réservation ne pourrait être effectué.
                        </p>
                    </section>

                    {/* Date de mise à jour*/}
                    <section>
                        <h2 className="text-2xl font-semibold text-[#0a1128] mb-2">Projet étudiant</h2>
                        <p className="text-gray-700">

                            Il s’agit d’un projet étudiant fictif pour lequel aucun réel service ne pourrait être effectué.
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
};

export default LegalPage;
