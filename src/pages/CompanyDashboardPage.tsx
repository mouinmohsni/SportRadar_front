import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import InviteEmployee from '../components/InviteEmployee';

interface Member {
    id: number;
    email: string;
    username: string;
    is_active: boolean;
}

interface CompanyStats {
    total_members: number;
    active_members: number;
    upcoming_sessions: number;
    past_sessions: number;
}

const CompanyDashboardPage: React.FC = () => {
    const { user, isAuthenticated } = useAuth();
    const [members, setMembers] = useState<Member[]>([]);
    const [stats, setStats] = useState<CompanyStats | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !user?.company?.id) return;

        const companyId = user.company.id;

        const fetchData = async () => {
            try {
                const [mRes, sRes] = await Promise.all([
                    axiosInstance.get<Member[]>(`/api/companies/${companyId}/members/`),
                    axiosInstance.get<CompanyStats>(`/api/companies/${companyId}/stats/`),
                ]);
                setMembers(mRes.data);
                setStats(sRes.data);
            } catch {
                toast.error('Erreur chargement dashboard entreprise');
            }
        };

        fetchData();
    }, [isAuthenticated, user]);

    if (!user || user.type !== 'business') {
        return null;
    }

    const companyId = user.company?.id;
    if (!companyId) {
        return <div>Aucune entreprise trouvée</div>;
    }

    return (
        <div className="min-h-screen bg-[#C7C5C5] p-6">
            <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6">
                <h1 className="text-3xl font-bold">Dashboard Société : {user.company?.name}</h1>
                {/* Stats */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                            <p className="text-xl font-semibold">Membres totaux</p>
                            <p className="text-2xl">{stats.total_members}</p>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                            <p className="text-xl font-semibold">Membres actifs</p>
                            <p className="text-2xl">{stats.active_members}</p>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                            <p className="text-xl font-semibold">Sessions à venir</p>
                            <p className="text-2xl">{stats.upcoming_sessions}</p>
                        </div>
                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                            <p className="text-xl font-semibold">Sessions passées</p>
                            <p className="text-2xl">{stats.past_sessions}</p>
                        </div>
                    </div>
                )}
                {/* Members list & Invite */}
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold">Équipe</h2>
                    <InviteEmployee />
                    <ul className="space-y-2">
                        {members.map(m => (
                            <li key={m.id} className="p-3 bg-gray-50 rounded shadow-sm flex justify-between">
                                <span>{m.username} ({m.email})</span>
                                <span>{m.is_active ? 'Actif' : 'Invité'}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default CompanyDashboardPage;
