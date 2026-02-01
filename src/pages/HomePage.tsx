import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowRight, MapPin, Users, Shield, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Newsletter from '../components/Newsletter';
// 1. On importe le nouveau composant SEO
import SEO from '../components/SEO';

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: MapPin,
      title: 'Activités',
      description: 'Découvrez toutes les activités sportives près de chez vous',
      link: '/activities'
    },
    {
      icon: Zap,
      title: 'Recommandations intelligentes',
      description: 'Suggestions personnalisées selon vos préférences',
      link: '/recommendations'
    },
    {
      icon: Shield,
      title: 'Badge SportZen',
      description: 'Identifiez les lieux bienveillants et non-compétitifs',
      link: '/badges'
    },
    {
      icon: Users,
      title: 'Offres entreprises',
      description: 'Solutions bien-être sur mesure pour les professionnels',
      link: '/corporate-offers'
    }
  ];

  const testimonials = [
    { name: 'Marie L.', role: 'Utilisatrice', content: "Grâce à SportRadar, j'ai retrouvé le plaisir de bouger ! Les recommandations sont parfaites.", rating: 5 },
    { name: 'Tech Solutions', role: 'Entreprise', content: "Le pack bien-être entreprise a transformé l'ambiance de nos équipes. Très professionnel.", rating: 5 }
  ];

  const images = [
    "/images/hero/yoga.png",
    "/images/hero/swiming.png",
    "/images/hero/runing.jpeg",
    "/images/hero/boxing.png",
    "/images/hero/dance.png",
  ];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
      <>
        {/*
        2. On place le composant SEO en haut de la page.
           - Le titre est optimisé pour être plus descriptif.
           - La description est engageante, contient des mots-clés et respecte la longueur idéale (environ 155 caractères).
      */}
        <SEO
            title="Accueil - Trouvez et Réservez votre Activité Sportive"
            description="SportRadar est la plateforme leader pour découvrir, comparer et réserver des milliers d'activités sportives près de chez vous. Yoga, boxe, escalade... Commencez aujourd'hui !"
        />

        <div className="min-h-screen font-sans text-gray-800">
          {/* Hero Section */}
          <section className="min-h-screen bg-gradient-to-b from-[#0a1128] from-55% to-[#ABC2D7] lg:py-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="lg:w-1/2 w-full">
                  <div className="relative overflow-hidden rounded-2xl shadow-lg">
                    <img
                        src={images[current]}
                        alt="Sport"
                        className="w-full h-80 lg:h-96 object-cover transition-opacity duration-1000"
                        key={current}
                    />
                  </div>
                </div>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="lg:w-1/2 w-full text-center lg:text-left"
                >
                  {/*
                  3. La balise <h1> est parfaite ici. C'est le titre principal de la page.
                     Elle est unique et bien visible.
                */}
                  <h1 className="text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-400 mb-6">
                    Ici, maintenant, <span className="text-[#dc5f18]">à ton rythme !</span>
                  </h1>
                  <p className="text-xl text-gray-400 mb-10 leading-relaxed">
                    SportRadar vous accompagne dans votre reprise d'activité sportive avec des recommandations personnalisées,
                    des activités locales et une approche bienveillante du bien-être.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                    <Link
                        to="/activities"
                        className="bg-[#dc5f18] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:brightness-110 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl flex items-center justify-center"
                    >
                      <span>Découvrir les activités</span>
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                    <Link
                        to="/login"
                        className="border-2 border-[#dc5f18] text-[#dc5f18] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#dc5f18] hover:text-white transition-all duration-300 transform hover:scale-105"
                    >
                      Créer mon compte
                    </Link>
                  </div>
                </motion.div>
              </div>
            </div>

            {/* Stats Section - C'est une section décorative, pas besoin de titre Hn ici. */}
            <section className="flex justify-center items-start my-10 lg:my-24">
              <div className="w-full max-w-3xl h-32 bg-[#736F6F] text-[#0a1128] border border-gray-400 rounded-full flex justify-around items-center text-white shadow-lg px-6">
                <div className="text-center">
                  <div className="text-2xl font-bold">500+</div>
                  <div className="text-xs">Activités référencées</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">10k+</div>
                  <div className="text-xs">Utilisateurs actifs</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">95%</div>
                  <div className="text-xs">Satisfaction utilisateur</div>
                </div>
              </div>
            </section>
          </section>

          {/*
          4. CORRECTION HIÉRARCHIE : On ajoute un titre <h2> pour introduire cette section importante.
             Cela corrige le saut de H1 à H3.
        */}
          <section className="bg-[#C7C5C5] py-20 lg:-mt-44">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold text-[#0a1128]">Une plateforme, tous vos besoins sportifs</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {features.map(({ title, description, icon: Icon, link }) => (
                    <div
                        key={title}
                        onClick={() => navigate(link)}
                        className="cursor-pointer flex flex-col items-center text-center space-y-4 p-6 bg-[#ABC2D7] backdrop-blur-md rounded-2xl shadow-md hover:shadow-xl transition-shadow"
                    >
                      <Icon className="w-10 h-10 text-[#dc5f18]" />
                      {/*
                    5. La balise <h3> est maintenant correcte, car elle est sous un <h2>.
                  */}
                      <h3 className="text-xl font-semibold text-[#0a1128]">{title}</h3>
                      <p className="text-sm text-[#0a1128]">{description}</p>
                    </div>
                ))}
              </div>
            </div>
          </section>

          {/* Testimonials Section */}
          <section className="py-20 bg-[#C7C5C5] lg:-my-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                {/*
                6. La balise <h2> est parfaite ici pour introduire la section des témoignages.
              */}
                <h2 className="text-3xl font-bold text-[#0a1128]">Ce qu'ils disent de nous</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {testimonials.map((testimonial, index) => (
                    <div key={index} className="bg-[#ABC2D7] p-8 rounded-2xl shadow-sm">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-5 h-5 text-[#dc5f18] fill-current" />
                        ))}
                      </div>
                      <p className="text-[#0a1128] mb-4 italic">"{testimonial.content}"</p>
                      <div>
                        {/* Pas besoin de Hn pour un nom propre, un div/span avec un style gras est parfait. */}
                        <div className="font-semibold text-[#0a1128]">{testimonial.name}</div>
                        <div className="text-sm text-[#0a1128]">{testimonial.role}</div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
            <Newsletter />
          </section>
        </div>
      </>
  );
};

export default HomePage;
