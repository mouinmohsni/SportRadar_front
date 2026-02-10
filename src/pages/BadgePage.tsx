// src/pages/BadgePage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Shield, MapPin, Star } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import SEO from "../components/SEO.tsx";

interface Place {
    id: number;
    name: string;
    location: string;
    image: string;
    rating: number;
}

const BadgePage: React.FC = () => {
    const [places, setPlaces] = useState<Place[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        axiosInstance
            .get<Place[]>('places/', { params: { badge: 'sportzen' } })
            .then(res => setPlaces(res.data))
            .catch(() => setError('Impossible de charger les lieux.'))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>

            <SEO title={"Badge SportZen - SportRadar"} description={"Découvrez les lieux bienveillants certifiés pour une pratique sportive sereine."}/>

            <div className="min-h-screen bg-[#C7C5C5] flex flex-col items-center">
                <div className="max-w-6xl mx-auto">
                    {/* 1. Hero */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="w-full bg-gradient-to-b from-[#0a1128] to-[#ABC2D7] flex flex-col items-center text-center pt-20 pb-16 px-4"
                    >
                        <Shield className="w-16 h-16 text-[#dc5f18] mb-4" />
                        <h1 className="text-4xl lg:text-5xl font-extrabold text-white mb-2">
                            Badge SportZen
                        </h1>
                        <p className="text-lg text-gray-200 mb-6 max-w-2xl">
                            Valorisez votre lieu en montrant que vous favorisez la bienveillance
                            et la non-compétition.
                        </p>

                    </motion.section>

                    {/* 2. Comment ça marche ? */}
                    <section className="w-full bg-white py-20">
                        <div className="max-w-4xl mx-auto text-center mb-12 px-4">
                            <h2 className="text-3xl font-bold text-[#0a1128]">Comment ça marche ?</h2>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 px-4">
                            {[
                                { step: 1, title: 'Inscription', desc: 'Remplissez le formulaire en ligne.' },
                                { step: 2, title: 'Vérification', desc: 'Nous auditons votre charte interne.' },
                                { step: 3, title: 'Remise', desc: 'Recevez et affichez votre badge.' },
                                { step: 4, title: 'Suivi', desc: 'Renouvelez-le chaque année.' },
                            ].map(({ step, title, desc }) => (
                                <div key={step} className="flex flex-col items-center text-center space-y-4">
                                    <div className="w-12 h-12 flex items-center justify-center bg-[#dc5f18] text-white rounded-full text-xl font-bold">
                                        {step}
                                    </div>
                                    <h3 className="text-xl font-semibold text-[#0a1128]">{title}</h3>
                                    <p className="text-gray-600">{desc}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 3. Lieux labellisés */}
                    <section className="w-full bg-[#C7C5C5] py-20">
                        <div className="max-w-7xl mx-auto px-4">
                            <h2 className="text-3xl font-bold text-[#0a1128] text-center mb-12">
                                Ils portent déjà le Badge SportZen
                            </h2>

                            {loading ? (
                                <p className="text-center">Chargement…</p>
                            ) : error ? (
                                <p className="text-center text-red-600">{error}</p>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {places.map(place => (
                                        <motion.div
                                            key={place.id}
                                            whileHover={{ scale: 1.03 }}
                                            className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer">
                                            {/*  onClick={() => navigate(`/places/${place.id}`)} */}

                                            <img
                                                src={place.image}
                                                alt={place.name}
                                                className="h-48 w-full object-cover"
                                            />
                                            <div className="p-6">
                                                <h3 className="text-xl font-semibold text-[#0a1128]">
                                                    {place.name}
                                                </h3>
                                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                                    <MapPin className="w-4 h-4 mr-1" />
                                                    <span>{place.location}</span>
                                                </div>
                                                <div className="flex">
                                                    {Array.from({ length: Math.round(place.rating) }).map((_, i) => (
                                                        <Star key={i} className="w-5 h-5 text-[#dc5f18]" />
                                                    ))}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </section>

                    {/* 4. Appel à l'action final */}
                    <section className="w-full bg-white py-16 text-center px-4">
                        <p className="text-xl text-[#0a1128] mb-4">
                            Faites partie de la communauté SportZen et valorisez votre engagement !
                        </p>
                        {/* onClick={() => navigate('/corporate-offers')} */}
                        <button
                            disabled
                            className="bg-[#dc5f18]/50 text-white px-8 py-4 rounded-xl text-lg font-semibold cursor-not-allowed transition relative group"
                            title="Cette fonctionnalité sera bientôt disponible"
                        >
                            Badge SportZen en construction
                            <span className="absolute hidden group-hover:block bg-gray-700 text-white text-sm rounded px-2 py-1 -bottom-10 left-1/2 transform -translate-x-1/2 w-max">
                                Cette fonctionnalité sera bientôt disponible
                            </span>
                        </button>
                    </section>
                </div>
            </div>
        </>
    );
};

export default BadgePage;
