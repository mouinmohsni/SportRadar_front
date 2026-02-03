// File: src/components/profile/BusinessInfo.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import type { User, Company, Activity } from '../../types';
import { Link } from 'react-router-dom';
import { Building2, Users, Calendar, MapPin } from 'lucide-react';

interface BusinessInfoProps {
    user: User;
}

const BusinessInfo: React.FC<BusinessInfoProps> = ({ user }) => {
    const [company, setCompany] = useState<Company | null>(null);
    const [coaches, setCoaches] = useState<User[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBusinessData = async () => {
            try {
                // Récupérer les infos de la company
                if (user.company && typeof user.company === 'number') {
                    const companyResponse = await axiosInstance.get<Company>(`/api/companies/${user.company}/`);
                    setCompany(companyResponse.data);

                    // Récupérer les coaches de l'entreprise
                    const coachesResponse = await axiosInstance.get<User[]>(`/api/companies/${user.company}/coaches/`);
                    setCoaches(coachesResponse.data);

                    // Récupérer les activités de l'entreprise
                    const activitiesResponse = await axiosInstance.get<Activity[]>(`/api/companies/${user.company}/activities/`);
                    setActivities(activitiesResponse.data);
                } else if (user.company && typeof user.company === 'object') {
                    setCompany(user.company);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données de l\'entreprise:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchBusinessData();
    }, [user]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-500">Chargement...</p>
            </div>
        );
    }

    if (!company) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800">
                        ⚠️ Aucune entreprise associée à votre compte.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#0a1128] mb-4">🏢 Mon Entreprise</h2>

            {/* Infos de l'entreprise */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                    <Building2 className="text-[#dc5f18] mt-1" size={24} />
                    <div className="flex-1">
                        <Link
                            to={`/companies/${company.id}`}
                            className="text-[#dc5f18] hover:underline font-bold text-xl"
                        >
                            {company.name}
                        </Link>
                        {company.city && (
                            <p className="text-gray-600 flex items-center gap-1 mt-1">
                                <MapPin size={16} />
                                {company.city}
                            </p>
                        )}
                        {company.address && (
                            <p className="text-gray-500 text-sm mt-1">{company.address}</p>
                        )}
                        {company.description && (
                            <p className="text-gray-700 mt-2">{company.description}</p>
                        )}
                        {company.sport_zen && (
                            <span className="inline-block mt-2 bg-gradient-to-r from-green-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                🧘 Sport Zen Partner
                            </span>
                        )}
                    </div>
                </div>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {/* Coaches */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                        <Users className="text-blue-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-blue-900">{coaches.length}</p>
                            <p className="text-blue-700">Coach{coaches.length > 1 ? 'es' : ''}</p>
                        </div>
                    </div>
                </div>

                {/* Activités */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                        <Calendar className="text-green-600" size={24} />
                        <div>
                            <p className="text-2xl font-bold text-green-900">{activities.length}</p>
                            <p className="text-green-700">Activité{activities.length > 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Liens rapides */}
            <div className="flex flex-wrap gap-3">
                <Link
                    to={`/companies/${company.id}`}
                    className="bg-[#dc5f18] text-white px-4 py-2 rounded hover:bg-[#b84f14] transition-colors"
                >
                    Voir ma page entreprise
                </Link>
                <Link
                    to="/business"
                    className="bg-[#0a1128] text-white px-4 py-2 rounded hover:bg-[#1a2138] transition-colors"
                >
                    Espace de gestion
                </Link>
            </div>
        </div>
    );
};

export default BusinessInfo;
