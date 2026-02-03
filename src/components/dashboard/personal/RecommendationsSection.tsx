// File: src/components/dashboard/personal/RecommendationsSection.tsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, MapPin, Target, Star, Users, Clock } from 'lucide-react';
import axiosInstance from '../../../api/axiosInstance';
import type { Activity, User } from '../../../types';
import {getMediaUrl} from "../../../utils/media.ts";

interface RecommendationScore {
    activity: Activity;
    score: number;
    reasons: string[];
}

const RecommendationsSection: React.FC = () => {
    const [recommendations, setRecommendations] = useState<RecommendationScore[]>([]);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchUserAndRecommendations();
    }, []);

    const fetchUserAndRecommendations = async () => {
        try {
            setLoading(true);

            // Récupérer les infos utilisateur
            const userResponse = await axiosInstance.get('/api/users/me/');
            const userData = userResponse.data;
            setUser(userData);

            // Récupérer toutes les activités
            const activitiesResponse = await axiosInstance.get('/api/activities/');
            const activities = activitiesResponse.data.results || activitiesResponse.data;

            // Calculer les scores de recommandation
            const scored = calculateRecommendationScores(activities, user || userData);

            // Trier par score décroissant et prendre les 6 meilleures
            const topRecommendations = scored
                .sort((a, b) => b.score - a.score)
                .slice(0, 6);

            setRecommendations(topRecommendations);
        } catch (error) {
            console.error('Error fetching recommendations:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateRecommendationScores = (activities: Activity[], user: User): RecommendationScore[] => {
        return activities.map(activity => {
            let score = 0;
            const reasons: string[] = [];

            // 1. OBJECTIFS FITNESS (30% du score)
            if (user.preferences?.objectives && user.preferences.objectives.length > 0) {
                const goalScore = calculateGoalScore(activity.category, user.preferences.objectives);
                score += goalScore * 30;
                if (goalScore > 0.7) {
                    reasons.push(`Parfait pour ${user.preferences.objectives[0]}`);
                }
            }

            // 2. LOCALISATION (40% du score)
            if (user.preferences?.location && activity.company.city) {
                const locationScore = calculateLocationScore(user.preferences.location, activity.company.city);
                score += locationScore * 40;
                if (locationScore === 1) {
                    reasons.push(`Dans votre ville (${user.preferences.location})`);
                } else if (locationScore > 0.5) {
                    reasons.push('Proche de vous');
                }
            }

            // 3. NIVEAU (20% du score)
            if (user.preferences?.level) {
                const levelScore = calculateLevelScore(activity.level, user.preferences.level);
                score += levelScore * 20;
                if (levelScore === 1) {
                    reasons.push(`Adapté à votre niveau (${translateLevel(user.preferences.level)})`);
                }
            }

            // 4. NOTES (10% du score)
            if (activity.average_score) {
                const ratingScore = activity.average_score / 5;
                score += ratingScore * 10;
                if (activity.average_score >= 4.5) {
                    reasons.push(`Excellentes notes (${activity.average_score.toFixed(1)}/5)`);
                }
            }

            // Bonus : Places disponibles
            const availableSpots = activity.max_participants - activity.participants_count;
            if (availableSpots > 0 && availableSpots <= 3) {
                reasons.push(`Plus que ${availableSpots} place${availableSpots > 1 ? 's' : ''} !`);
            }

            // Bonus : Catégories préférées
            if (user.preferences?.objectives && user.preferences.objectives.includes(activity.category)) {
                score += 5;
                reasons.push('Catégorie favorite');
            }

            return {
                activity,
                score: Math.min(100, score),
                reasons: reasons.slice(0, 3) // Limiter à 3 raisons
            };
        });
    };

    const calculateGoalScore = (category: string, goals: string[]): number => {
        const goalMapping: { [key: string]: string[] } = {
            'perte de poids': ['cardio', 'hiit', 'running', 'cycling', 'zumba', 'aerobic'],
            'renforcement musculaire': ['musculation', 'crossfit', 'bodybuilding', 'strength', 'fitness'],
            'réduction du stress': ['yoga', 'meditation', 'pilates', 'tai chi', 'stretching'],
            'amélioration de la flexibilité': ['yoga', 'fitness', 'pilates', 'stretching', 'dance'],
            'endurance cardio': ['running', 'cycling', 'swimming', 'cardio', 'triathlon'],
            'bien-être général': ['yoga', 'fitness', 'meditation', 'pilates', 'tai chi'],
            'socialisation': ['dance', 'zumba', 'group fitness', 'team sports', 'crossfit']
        };

        let maxScore = 0;
        goals.forEach(goal => {
            const relevantCategories = goalMapping[goal.toLowerCase()] || [];
            if (relevantCategories.some(cat => category.toLowerCase().includes(cat))) {
                maxScore = Math.max(maxScore, 1);
            } else if (relevantCategories.length > 0) {
                maxScore = Math.max(maxScore, 0.3);
            }
        });

        return maxScore;
    };

    const calculateLocationScore = (userCity: string, activityCity: string): number => {
        const normalizedUserCity = userCity.toLowerCase().trim();
        const normalizedActivityCity = activityCity.toLowerCase().trim();

        if (normalizedUserCity === normalizedActivityCity) {
            return 1; // Même ville
        }

        // Vérifier si une ville contient l'autre (ex: "Paris" et "Paris 15")
        if (normalizedUserCity.includes(normalizedActivityCity) ||
            normalizedActivityCity.includes(normalizedUserCity)) {
            return 0.8;
        }

        return 0.2; // Ville différente
    };

    const calculateLevelScore = (
        activityLevel: Activity['level'],
        userLevel: string
    ): number => {
        if (activityLevel === 'all') return 1;

        const levelHierarchy: { [key: string]: number } = {
            'beginner': 1,
            'intermediate': 2,
            'advanced': 3
        };

        const userLevelNum = levelHierarchy[userLevel.toLowerCase()] || 1;
        const activityLevelNum = levelHierarchy[activityLevel];

        if (userLevelNum === activityLevelNum) return 1;
        if (Math.abs(userLevelNum - activityLevelNum) === 1) return 0.6;
        return 0.2;
    };

    const translateLevel = (level: string): string => {
        const translations: { [key: string]: string } = {
            'beginner': 'Débutant',
            'intermediate': 'Intermédiaire',
            'advanced': 'Avancé',
            'all': 'Tous niveaux'
        };
        return translations[level.toLowerCase()] || level;
    };

    const getDifficultyColor = (level: Activity['level']): string => {
        const colors = {
            'beginner': 'bg-green-100 text-green-700',
            'intermediate': 'bg-yellow-100 text-yellow-700',
            'advanced': 'bg-red-100 text-red-700',
            'all': 'bg-blue-100 text-blue-700'
        };
        return colors[level] || colors.all;
    };

    if (loading) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dc5f18]"></div>
                    <span className="ml-3 text-gray-600">Calcul des recommandations...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-gray-900">Recommandations pour vous</h3>
                        <p className="text-sm text-gray-600">
                            Basées sur vos objectifs, localisation et niveau
                        </p>
                    </div>
                </div>
            </div>

            {/* Grille de recommandations */}
            {recommendations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Sparkles className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                    <p>Aucune recommandation disponible pour le moment</p>
                    <p className="text-sm mt-2">Complétez votre profil pour obtenir des recommandations personnalisées</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recommendations.map(({ activity, score, reasons }) => (
                        <Link
                            key={activity.id}
                            to={`/activities/${activity.id}`}
                            className="group relative bg-gradient-to-br from-gray-50 to-white rounded-lg border border-gray-200 hover:border-[#dc5f18] hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
                        >
                            {/* Badge de score */}
                            <div className="absolute top-3 right-3 z-10">
                                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                                    {Math.round(score)}% Match
                                </div>
                            </div>

                            {/* Image */}
                            {activity.image ? (
                                <div className="h-40 overflow-hidden">

                                    <img
                                        src={activity.image ? getMediaUrl(activity.image) : '/activity-default11.jpeg'}
                                        alt={activity.name}
                                        className="w-full h-64 object-cover"
                                        onError={(event) => {
                                            const target = event.currentTarget;
                                            if (target.src.includes('activity-default11.jpeg')) return;
                                            target.src = '/activity-default11.jpeg';
                                            target.onerror = null;
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="h-40 bg-gradient-to-br from-[#0a1128] to-[#dc5f18] flex items-center justify-center">
                                    <Target className="w-12 h-12 text-white opacity-50" />
                                </div>
                            )}

                            {/* Contenu */}
                            <div className="p-4">
                                {/* Titre et catégorie */}
                                <div className="mb-3">
                                    <h4 className="font-bold text-gray-900 mb-1 line-clamp-1 group-hover:text-[#dc5f18] transition-colors">
                                        {activity.name}
                                    </h4>
                                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(activity.level)}`}>
                                        {translateLevel(activity.level)}
                                    </span>
                                </div>

                                {/* Raisons de recommandation */}
                                <div className="space-y-1 mb-3">
                                    {reasons.map((reason, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-xs text-gray-600">
                                            <div className="w-1 h-1 bg-[#dc5f18] rounded-full"></div>
                                            <span>{reason}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* Infos */}
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{activity.duration}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        <span>{activity.participants_count}/{activity.max_participants}</span>
                                    </div>
                                    {activity.average_score && (
                                        <div className="flex items-center gap-1">
                                            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            <span>{activity.average_score.toFixed(1)}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Localisation */}
                                <div className="flex items-center gap-2 text-xs text-gray-600 mb-3 pb-3 border-b border-gray-100">
                                    <MapPin className="w-3 h-3 text-[#dc5f18]" />
                                    <span className="line-clamp-1">{activity.company.name} - {activity.company.city}</span>
                                </div>

                                {/* Prix et CTA */}
                                <div className="flex items-center justify-between">
                                    <div className="text-lg font-bold text-[#dc5f18]">
                                        {activity.price}€
                                    </div>
                                    <div className="px-4 py-2 bg-gradient-to-r from-[#dc5f18] to-[#ff7a3d] text-white text-sm font-medium rounded-lg group-hover:shadow-lg transition-all">
                                        Voir détails
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecommendationsSection;
