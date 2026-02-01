// File: src/components/dashboard/common/StatsCard.tsx
import React from 'react';
import CountUp from 'react-countup';
import type {LucideIcon} from 'lucide-react';

interface StatsCardProps {
    title: string;
    value: number;
    suffix?: string;
    prefix?: string;
    icon: LucideIcon;
    color: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

const StatsCard: React.FC<StatsCardProps> = ({
                                                 title,
                                                 value,
                                                 suffix = '',
                                                 prefix = '',
                                                 icon: Icon,
                                                 color,
                                                 trend
                                             }) => {
    return (
        <div className="relative overflow-hidden bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
            {/* Fond coloré avec opacité */}
            <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transform translate-x-8 -translate-y-8">
                <div className={`w-full h-full rounded-full ${color}`}></div>
            </div>

            <div className="relative z-10">
                {/* Icône */}
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${color} bg-opacity-10 mb-4`}>
                    <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
                </div>

                {/* Titre */}
                <h3 className="text-gray-600 text-sm font-medium mb-2">{title}</h3>

                {/* Valeur avec animation */}
                <div className="flex items-end justify-between">
                    <p className="text-3xl font-extrabold text-[#0a1128]">
                        {prefix}
                        <CountUp end={value} duration={1.5} separator=" " />
                        {suffix}
                    </p>

                    {/* Tendance (optionnel) */}
                    {trend && (
                        <div className={`flex items-center text-sm font-semibold ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                            <span>{trend.isPositive ? '↑' : '↓'}</span>
                            <span className="ml-1">{trend.value}%</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StatsCard;
