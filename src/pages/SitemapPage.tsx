// src/pages/SitemapPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Home, Activity, Users, MapPin, FileText,
    HelpCircle, Lock, LayoutDashboard,
    UserCircle, Briefcase, PlusCircle, Search
} from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const routes = [
    { path: '/', label: 'Accueil', icon: <Home className="w-5 h-5 mr-3" /> },
    { path: '/activities', label: 'Toutes les Activités', icon: <Activity className="w-5 h-5 mr-3" /> },
    { path: '/coaches', label: 'Nos Coaches Experts', icon: <Users className="w-5 h-5 mr-3" /> },
    { path: '/companies', label: 'Salles de Sport & Clubs', icon: <MapPin className="w-5 h-5 mr-3" /> },
    { path: '/services', label: 'Espace Professionnels', icon: <Briefcase className="w-5 h-5 mr-3" /> },
    { path: '/dashboard', label: 'Tableau de bord', icon: <LayoutDashboard className="w-5 h-5 mr-3" /> },
    { path: '/profile', label: 'Mon Profil & Préférences', icon: <UserCircle className="w-5 h-5 mr-3" /> },
    { path: '/add-activity', label: 'Ajouter une Activité', icon: <PlusCircle className="w-5 h-5 mr-3" /> },
    { path: '/recommendations', label: 'Recommandations Sportives', icon: <Search className="w-5 h-5 mr-3" /> },
    { path: '/faq', label: 'Questions Fréquentes (FAQ)', icon: <HelpCircle className="w-5 h-5 mr-3" /> },
    { path: '/legal', label: 'Mentions Légales', icon: <FileText className="w-5 h-5 mr-3" /> },
    { path: '/privacy', label: 'Politique de Confidentialité', icon: <Lock className="w-5 h-5 mr-3" /> },
    { path: '/sitemap', label: 'Plan du site', icon: <MapPin className="w-5 h-5 mr-3" /> },
];

const SitemapPage: React.FC = () => (
    <>
        <Helmet>
            <title>Plan du site | SportRadar - Navigation Complète</title>
            <meta name="description" content="Accédez rapidement à toutes les rubriques de SportRadar : activités, coaches, salles de sport et services professionnels. Trouvez votre chemin facilement !" />
        </Helmet>

        <div className="min-h-screen bg-gray-100 py-24 px-4 flex flex-col items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-3xl bg-white rounded-3xl shadow-xl p-10"
            >
                {/*
                    CORRECTION AUDIT : "Plan du site" au lieu de "Sitemap"
                    pour une meilleure distinction sémantique.
                */}
                <h1 className="text-3xl font-bold text-[#0a1128] mb-10 text-center border-b pb-6">
                    Plan du site
                </h1>

                <nav>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {routes.map(({ path, label, icon }) => (
                            <li key={path}>
                                <Link
                                    to={path}
                                    className="flex items-center p-4 rounded-xl text-[#0a1128] hover:text-white hover:bg-[#c44d00] transition-all duration-300 group border border-gray-50 hover:border-[#c44d00]"
                                >
                                    <span className="text-[#c44d00] group-hover:text-white transition-colors">
                                        {icon}
                                    </span>
                                    <span className="font-medium">{label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>
            </motion.div>
        </div>
    </>
);

export default SitemapPage;
