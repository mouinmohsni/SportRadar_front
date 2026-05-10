import React from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart3,
    Users,
    ShieldCheck,
    Calendar,
    TrendingUp,
    CheckCircle2,
    ArrowRight,
    Building2,
    Dumbbell
} from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const ServicesPage: React.FC = () => {
    const benefits = [
        {
            icon: TrendingUp,
            title: "Boostez votre visibilité",
            description: "Apparaissez sur notre carte interactive et touchez des milliers de sportifs locaux qui cherchent une nouvelle salle ou un nouveau cours."
        },
        {
            icon: Calendar,
            title: "Gestion simplifiée",
            description: "Un outil de réservation intuitif pour vos membres. Fini les appels et les messages, tout se gère automatiquement sur votre dashboard."
        },
        {
            icon: ShieldCheck,
            title: "Valorisez votre bienveillance",
            description: "Obtenez le badge SportZen pour rassurer vos clients sur l'aspect inclusif et non-compétitif de votre établissement."
        },
        {
            icon: BarChart3,
            title: "Suivez vos performances",
            description: "Analysez vos taux de remplissage, vos revenus et la satisfaction de vos membres grâce à nos outils de statistiques avancés."
        }
    ];

    const steps = [
        {
            number: "01",
            title: "Inscrivez votre structure",
            description: "Créez votre compte Business en quelques minutes et renseignez les informations de votre salle."
        },
        {
            number: "02",
            title: "Publiez vos activités",
            description: "Ajoutez vos cours de Yoga, Fitness ou Boxe. Définissez vos horaires, tarifs et nombre de places."
        },
        {
            number: "03",
            title: "Accueillez vos membres",
            description: "Recevez vos réservations en temps réel et concentrez-vous sur ce que vous faites de mieux : le sport !"
        }
    ];

    return (
        <>
            {/*
          OPTIMISATION SEO (Audit point 7)
          - Title : Cible les professionnels (54 caractères)
          - Description : Longue (159 chars) pour attirer les gérants de salles
      */}
            <SEO
                title="Espace Professionnels : Salles de Sport et Coaches | SportRadar"
                description="Développez votre salle de sport ou votre activité de coaching avec SportRadar. Profitez d'outils de gestion, de visibilité et de réservation en ligne simplifiés."
                keywords="logiciel gestion salle de sport, visibilité coach sportif, partenariat sport, plateforme réservation sport, business fitness, sportradar pro"
            />

            <div className="min-h-screen font-sans text-gray-800 bg-gray-50">

                {/* HERO SECTION - PARLE AUX SALLES DE SPORT */}
                <section className="relative bg-[#0a1128] py-24 lg:py-32 overflow-hidden">
                    {/* Décoration de fond */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-96 h-96 bg-[#c44d00] opacity-10 rounded-full blur-3xl"></div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8 }}
                                className="lg:w-1/2 text-center lg:text-left"
                            >
                                <h1 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight mb-6">
                                    Digitalisez votre salle de sport et <span className="text-[#c44d00]">boostez vos réservations.</span>
                                </h1>
                                <p className="text-xl text-gray-300 mb-10 leading-relaxed">
                                    SportRadar offre aux professionnels du fitness une plateforme tout-en-un pour gérer leurs activités, attirer de nouveaux clients et simplifier leur quotidien.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                    <Link
                                        to="/login?type=business"
                                        className="bg-[#c44d00] text-[#0A1128] px-8 py-4 rounded-xl text-lg font-bold hover:bg-[#a34000] transition-all shadow-xl flex items-center justify-center group"
                                    >
                                        <span>Inscrire mon établissement</span>
                                        <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Link>
                                    <Link
                                        to="/activities"
                                        className="border-2 border-gray-600 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-white hover:text-[#0a1128] transition-all"
                                    >
                                        Découvrir la plateforme
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8 }}
                                className="lg:w-1/2 relative"
                            >
                                <div className="bg-[#ABC2D7] p-4 rounded-3xl shadow-2xl overflow-hidden">
                                    <img
                                        src="/images/hero/yoga.png"
                                        alt="Interface de gestion SportRadar pour les salles"
                                        className="rounded-2xl shadow-inner object-cover w-full h-[400px]"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* SECTION AVANTAGES - HIÉRARCHIE H2 -> H3 */}
                <section className="py-24 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl lg:text-4xl font-bold text-[#0a1128] mb-4">Pourquoi rejoindre le réseau SportRadar ?</h2>
                            <div className="w-24 h-1 bg-[#c44d00] mx-auto"></div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
                            {benefits.map((benefit, index) => (
                                <div key={index} className="flex flex-col items-center text-center p-6 rounded-2xl hover:bg-gray-50 transition-colors">
                                    <div className="w-16 h-16 bg-[#ABC2D7] text-[#0a1128] rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                                        <benefit.icon className="w-8 h-8" />
                                    </div>
                                    <h3 className="text-xl font-bold text-[#0a1128] mb-3">{benefit.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* SECTION COMMENT ÇA MARCHE */}
                <section className="py-24 bg-[#ABC2D7] bg-opacity-30">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="lg:w-1/2">
                                <h2 className="text-3xl lg:text-4xl font-bold text-[#0a1128] mb-6">Un processus simple pour les professionnels.</h2>
                                <p className="text-lg text-gray-700 mb-8">
                                    Nous avons conçu SportRadar pour qu'il s'intègre parfaitement à votre flux de travail quotidien, sans complexité technique.
                                </p>
                                <div className="space-y-8">
                                    {steps.map((step, index) => (
                                        <div key={index} className="flex gap-6">
                                            <div className="text-4xl font-black text-[#c44d00] opacity-50">{step.number}</div>
                                            <div>
                                                <h3 className="text-xl font-bold text-[#0a1128] mb-1">{step.title}</h3>
                                                <p className="text-gray-600">{step.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="lg:w-1/2 grid grid-cols-2 gap-4">
                                <div className="space-y-4 pt-12">
                                    <div className="bg-[#0a1128] p-8 rounded-3xl text-white shadow-xl">
                                        <Building2 className="w-10 h-10 mb-4 text-[#c44d00]" />
                                        <div className="text-2xl font-bold">Salles</div>
                                        <p className="text-sm text-gray-400">Gérez vos locaux et vos équipements.</p>
                                    </div>
                                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                                        <Users className="w-10 h-10 mb-4 text-[#c44d00]" />
                                        <div className="text-2xl font-bold text-[#0a1128]">Membres</div>
                                        <p className="text-sm text-gray-500">Suivez l'engagement de votre communauté.</p>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                                        <Dumbbell className="w-10 h-10 mb-4 text-[#c44d00]" />
                                        <div className="text-2xl font-bold text-[#0a1128]">Cours</div>
                                        <p className="text-sm text-gray-500">Planifiez vos sessions en un clin d'œil.</p>
                                    </div>
                                    <div className="bg-[#c44d00] p-8 rounded-3xl text-white shadow-xl">
                                        <CheckCircle2 className="w-10 h-10 mb-4 text-white" />
                                        <div className="text-2xl font-bold">Badge Zen</div>
                                        <p className="text-sm text-orange-100">Valorisez votre éthique inclusive.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* SECTION COACHES DÉDIÉE */}
                <section className="py-24 bg-white border-t border-gray-100">
                    <div className="max-w-4xl mx-auto px-4 text-center">
                        <h2 className="text-3xl font-bold text-[#0a1128] mb-6">Vous êtes un coach indépendant ?</h2>
                        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                            SportRadar n'est pas seulement pour les grandes salles. Les coaches indépendants peuvent aussi publier leurs séances, gérer leurs propres clients et bénéficier de notre visibilité.
                        </p>
                        <Link
                            to="/login?type=coach"
                            className="inline-flex items-center text-[#c44d00] font-bold text-lg hover:underline group"
                        >
                            S'inscrire en tant que Coach
                            <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </section>

                {/* CTA FINAL */}
                <section className="py-20 bg-[#0a1128] relative overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                        <h2 className="text-3xl lg:text-5xl font-bold text-white mb-8">
                            Prêt à transformer votre établissement ?
                        </h2>
                        <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">
                            Rejoignez les centaines de professionnels qui font déjà confiance à SportRadar pour leur développement numérique.
                        </p>
                        <Link
                            to="/login?type=business"
                            className="bg-[#c44d00]   text-[#0A1128] px-10 py-5 rounded-2xl text-xl font-bold hover:bg-[#a34000] transition-all shadow-2xl inline-block"
                        >
                            Démarrer gratuitement maintenant
                        </Link>
                        <p className="mt-6 text-gray-500 text-sm">
                            Sans engagement. Inscription en moins de 2 minutes.
                        </p>
                    </div>
                </section>

            </div>
        </>
    );
};

export default ServicesPage;
