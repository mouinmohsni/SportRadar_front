import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, ArrowLeft, CheckCircle } from 'lucide-react';
import axiosInstance from '../../api/axiosInstance';
import { toast } from 'react-toastify';
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip as RechartsTooltip,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const analyticsDetails = [
    'Visualisation des tendances sur plusieurs périodes',
    'Segmentation par activité et par localisation',
    'Export au format CSV ou PDF'
];

const COLORS = ['#0a1128', '#dc5f18', '#ABC2D7', '#82ca9d', '#ffc658'];

const AnalyticsAvancesPage: React.FC = () => {
    const navigate = useNavigate();
    const [totalActivities, setTotalActivities] = useState<number>(0);
    const [participantsTotal, setParticipantsTotal] = useState<number>(0);
    const [activitiesByCity, setActivitiesByCity] = useState<{ city: string; count: number }[]>([]);
    const [registrationsByCity, setRegistrationsByCity] = useState<{ city: string; count: number }[]>([]);
    const [activitiesByCategory, setActivitiesByCategory] = useState<{ category: string; count: number }[]>([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        (async () => {
            try {
                const res = await axiosInstance.get('/api/activities/');
                const all = res.data;
                setTotalActivities(all.length);

                let totalPart = 0;
                const cityCount: Record<string, number> = {};
                const regCount: Record<string, number> = {};
                const catCount: Record<string, number> = {};

                all.forEach((a: any) => {
                    cityCount[a.location] = (cityCount[a.location] || 0) + 1;
                    catCount[a.category] = (catCount[a.category] || 0) + 1;
                });
                setActivitiesByCity(
                    Object.entries(cityCount).map(([city, count]) => ({ city, count }))
                );
                setActivitiesByCategory(
                    Object.entries(catCount).map(([category, count]) => ({ category, count }))
                );

                all.forEach((a: any) => {
                    const p = a.participants ?? 0;
                    regCount[a.location] = (regCount[a.location] || 0) + p;
                    totalPart += p;
                });
                setParticipantsTotal(totalPart);
                setRegistrationsByCity(
                    Object.entries(regCount).map(([city, count]) => ({ city, count }))
                );
            } catch {
                toast.error('Erreur chargement statistiques globales');
            }
        })();
    }, []);

    return (
        <div className="min-h-screen bg-[#C7C5C5] py-10 px-4">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8 space-y-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center text-[#0a1128] hover:text-[#dc5f18] transition"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />Retour
                </button>

                <div className="flex items-center space-x-4">
                    <div className="p-3 bg-[#dc5f18] rounded-md">
                        <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#0a1128]">Analytics avancés</h1>
                </div>

                <p className="text-gray-700">
                    Bénéficiez d’outils d’analyse avancée pour mesurer l’engagement,
                    optimiser les performances et prendre des décisions éclairées. (En construction)
                </p>

                <ul className="list-disc list-inside space-y-2">
                    {analyticsDetails.map((item, i) => (
                        <li key={i} className="flex items-start space-x-2">
                            <CheckCircle className="w-5 h-5 text-[#dc5f18] mt-1" />
                            <span className="text-gray-700 font-medium">{item}</span>
                        </li>
                    ))}
                </ul>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
                    <div className="p-4 bg-gray-100 rounded-lg text-center">
                        <p className="text-xl font-semibold">Total activités</p>
                        <p className="text-2xl">{totalActivities}</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg text-center">
                        <p className="text-xl font-semibold">Participants totaux</p>
                        <p className="text-2xl">{participantsTotal}</p>
                    </div>
                    <div className="p-4 bg-gray-100 rounded-lg text-center">
                        <p className="text-xl font-semibold">Catégories actives</p>
                        <p className="text-2xl">{activitiesByCategory.length}</p>
                    </div>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-[#0a1128] mb-4">Activités par ville</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={activitiesByCity} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <XAxis dataKey="city" />
                            <YAxis />
                            <RechartsTooltip />
                            <Bar dataKey="count" fill="#dc5f18" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-[#0a1128] mb-4">Participations par ville</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={registrationsByCity}
                                dataKey="count"
                                nameKey="city"
                                cx="50%"
                                cy="50%"
                                innerRadius={40}
                                outerRadius={80}
                                label
                            >
                                {registrationsByCity.map((_, i) => (
                                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                ))}
                            </Pie>
                            <RechartsTooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-[#0a1128] mb-4">Activités par catégorie</h2>
                    <ResponsiveContainer width="100%" height={200}>
                        <BarChart data={activitiesByCategory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                            <XAxis dataKey="category" />
                            <YAxis />
                            <RechartsTooltip />
                            <Bar dataKey="count" fill="#0a1128" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsAvancesPage;
