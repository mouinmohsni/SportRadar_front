// File: src/components/profile/CoachInfo.tsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import type { User, Company, Activity } from '../../types';
import { Link } from 'react-router-dom';
import { Building2, MapPin, Calendar } from 'lucide-react';

interface CoachInfoProps {
    user: User;
}

const CoachInfo: React.FC<CoachInfoProps> = ({ user }) => {
    const [company, setCompany] = useState<Company | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoachData = async () => {
            try {
                // Récupérer les activités du coach
                const activitiesResponse = await axiosInstance.get<Activity[]>(`/users/${user.id}/activities/`);
                setActivities(activitiesResponse.data);

                // Récupérer les infos de la company si elle existe
                if (user.company && typeof user.company === 'number') {
                    const companyResponse = await axiosInstance.get<Company>(`/companies/${user.company}/`);
                    setCompany(companyResponse.data);
                } else if (user.company && typeof user.company === 'object') {
                    setCompany(user.company);
                }
            } catch (error) {
                console.error('Erreur lors du chargement des données du coach:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCoachData();
    }, [user]);

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-6">
                <p className="text-gray-500">Chargement...</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-[#0a1128] mb-4">🏋️ Informations Coach</h2>

            {/* Salle de sport */}
            {company ? (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-start gap-3">
                        <Building2 className="text-[#dc5f18] mt-1" size={24} />
                        <div className="flex-1">
                            <h3 className="font-semibold text-lg text-[#0a1128] mb-1">Ma Salle de Sport</h3>
                            <Link
                                to={`/companies/${company.id}`}
                                className="text-[#dc5f18] hover:underline font-medium text-lg"
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
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <p className="text-yellow-800">
                        ⚠️ Vous n'êtes actuellement rattaché à aucune salle de sport.
                    </p>
                </div>
            )}

            {/* Activités */}
            <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-start gap-3">
                    <Calendar className="text-[#dc5f18] mt-1" size={24} />
                    <div className="flex-1">
                        <h3 className="font-semibold text-lg text-[#0a1128] mb-2">Mes Activités</h3>
                        {activities.length > 0 ? (
                            <>
                                <p className="text-gray-700 mb-3">
                                    Vous animez actuellement <strong>{activities.length}</strong> activité{activities.length > 1 ? 's' : ''}.
                                </p>
                                <div className="space-y-2">
                                    {activities.slice(0, 5).map(activity => (
                                        <Link
                                            key={activity.id}
                                            to={`/activities/${activity.id}`}
                                            className="block p-3 bg-white rounded border border-gray-200 hover:border-[#dc5f18] transition-colors"
                                        >
                                            <p className="font-medium text-[#0a1128]">{activity.name}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(activity.start_time).toLocaleDateString('fr-FR', {
                                                    weekday: 'long',
                                                    day: 'numeric',
                                                    month: 'long',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                                {activities.length > 5 && (
                                    <Link
                                        to={`/coaches/${user.id}`}
                                        className="inline-block mt-3 text-[#dc5f18] hover:underline"
                                    >
                                        Voir toutes mes activités →
                                    </Link>
                                )}
                            </>
                        ) : (
                            <p className="text-gray-500">Vous n'avez pas encore d'activités programmées.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CoachInfo;
