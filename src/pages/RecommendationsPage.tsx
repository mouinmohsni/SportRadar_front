// src/pages/RecommendationsPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Thermometer, Sun, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';
import Chatbot from '../components/Chatbot';
import { Helmet } from 'react-helmet-async';

interface Weather {
    temp: number;
    condition: string;
}

const RecommendationsPage: React.FC = () => {
    const navigate = useNavigate();
    const [weather, setWeather] = useState<Weather | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Toujours scroller en haut au montage
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            async ({ coords }) => {
                try {
                    const wRes = await axiosInstance.get<Weather>('/api/weather/', {
                        params: { lat: coords.latitude, lon: coords.longitude }
                    });
                    setWeather(wRes.data);
                } catch (err: any) {
                    console.error(err);
                    setError('Impossible de charger la météo.');
                } finally {
                    setLoading(false);
                }
            },
            () => {
                setError('Localisation refusée.');
                setLoading(false);
            }
        );
    }, []);

    const advice = () => {
        if (!weather) return '';
        if (['Rain', 'Snow', 'Thunderstorm'].includes(weather.condition)) {
            return "Activité à l'intérieur conseillée";
        }
        if (weather.temp < 5) {
            return "Il fait trop froid, privilégiez l'intérieur";
        }
        return "Vous pouvez profiter d’une activité en extérieur";
    };

    if (loading) {
        return <p className="text-center py-20">Chargement…</p>;
    }
    if (error) {
        return <p className="text-center py-20 text-red-600">{error}</p>;
    }

    return (
        <>
            <Helmet>
                <title>Recommandations - SportRadar</title>
                <meta name="description" content="Recevez des recommandations d'activités sportives personnalisées selon votre profil." />
                <meta name="robots" content="index, follow" />
            </Helmet>

            <div className="min-h-screen bg-[#C7C5C5] flex flex-col items-center pt-8 relative">
                <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8 flex flex-col items-center">
                    {/* Bandeau météo */}
                    {weather && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="w-full bg-[#ABC2D7] p-6 rounded-2xl shadow-md mb-12 flex flex-col sm:flex-row justify-between items-center"
                        >
                            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                <Thermometer className="w-6 h-6 text-[#0a1128]" />
                                <span className="font-semibold text-xl">{weather.temp}°C</span>
                                {weather.condition === 'Clear' ? (
                                    <Sun className="w-6 h-6 text-[#0a1128]" />
                                ) : (
                                    <CloudRain className="w-6 h-6 text-[#0a1128]" />
                                )}
                            </div>
                            <p className="text-[#0a1128] font-medium text-center sm:text-left">
                                {advice()}
                            </p>
                        </motion.div>
                    )}

                    {/* Message et bouton */}
                    <div className="text-center space-y-6 mb-8">
                        <p className="text-lg text-[#0a1128]">
                            Pour une recommandation personnalisée, saisis tes préférences en un clic.
                        </p>
                        <button
                            onClick={() => navigate('/profile')}
                            className="bg-[#dc5f18] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#bf4f15] transition"
                        >
                            Mes préférences
                        </button>
                    </div>
                </div>

                {/* Chatbot discret en bas à droite */}
                <div className="fixed bottom-6 right-6 z-50">
                    <Chatbot />
                </div>
            </div>
        </>
    );
};

export default RecommendationsPage;
