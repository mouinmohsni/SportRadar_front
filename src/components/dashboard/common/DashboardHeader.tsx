// File: src/components/dashboard/common/DashboardHeader.tsx
import React from 'react';
import type { User } from '../../../types';
import { getMediaUrl } from '../../../utils/mediaUtils';

interface DashboardHeaderProps {
    user: User;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return '🌅 Bonjour';
        if (hour < 18) return '☀️ Bon après-midi';
        return '🌙 Bonsoir';
    };

    const getUserDisplayName = (): string => {
        if (user.first_name && user.last_name) {
            return `${user.first_name} ${user.last_name}`;
        }
        if (user.first_name) return user.first_name;
        if (user.last_name) return user.last_name;
        return user.username;
    };

    const getUserTypeLabel = (): string => {
        switch (user.type) {
            case 'personal':
                return '👤 Client';
            case 'coach':
                return '🥋 Coach';
            case 'business':
                return '🏢 Salle de Sport';
            case 'admin':
                return '⚙️ Administrateur';
            default:
                return '';
        }
    };

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-[#0a1128] via-[#14213d] to-[#0a1128] rounded-2xl p-8 mb-8 shadow-2xl">
            {/* Effet de fond animé */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-64 h-64 bg-[#dc5f18] rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#dc5f18] rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            </div>

            <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-6">
                    {/* Avatar */}
                    <div className="relative">
                        <img
                            src={getMediaUrl(user.avatar) || '/images/avatar-default.png'}
                            alt={getUserDisplayName()}
                            className="w-20 h-20 rounded-full object-cover border-4 border-[#dc5f18] shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-[#dc5f18] text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
                            {getUserTypeLabel()}
                        </div>
                    </div>

                    {/* Texte de bienvenue */}
                    <div>
                        <h1 className="text-3xl font-extrabold text-white mb-1">
                            {getGreeting()}, <span className="text-[#dc5f18]">{getUserDisplayName()}</span> !
                        </h1>
                        <p className="text-gray-300 text-sm">{user.email}</p>
                    </div>
                </div>

                {/* Date du jour */}
                <div className="hidden md:block text-right">
                    <p className="text-white text-lg font-semibold">
                        {new Date().toLocaleDateString('fr-FR', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                    <p className="text-gray-300 text-sm">
                        {new Date().toLocaleTimeString('fr-FR', {
                            hour: '2-digit',
                            minute: '2-digit'
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default DashboardHeader;
