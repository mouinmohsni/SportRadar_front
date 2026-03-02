import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gradient-to-b from-[#0a1128] from-50% to-[#ABC2D7]  text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <img
                src="../images/hero/Logo_Radar_Blanc.png"
                alt="SportRadar Logo"
                className="w-35 h-12"
              />

            </div>
            <p className="text-sm text-gray-400">
              Votre compagnon bien-être pour une pratique sportive accessible et personnalisée.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/" className="hover:text-sky-400 transition-colors">Accueil</a></li>

              <li><a href="/business" className="hover:text-sky-400 transition-colors">Entreprises</a></li>
              <li><a href="/dashboard" className="hover:text-sky-400 transition-colors">Mon espace</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4">Services</h3>
            <ul className="space-y-2 text-sm">
              <li><a href="/activities" className="hover:text-sky-400 transition-colors">Activités </a></li>
              <li><a href="/recommendations" className="hover:text-sky-400 transition-colors">Recommandations</a></li>
              <li><a href="/Badges" className="hover:text-sky-400 transition-colors">Badge SportZen</a></li>
              <li><a href="/corporate-offers" className="hover:text-sky-400 transition-colors">Bien-être sur mesure</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-gray-200 font-semibold mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4 text-sky-400" />
                <span>contact@sportradar.fr</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-sky-400" />
                <span>+33 614 82 85 84</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-sky-400" />
                <span>Lyon, France</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-white">
          <div className="flex justify-center space-x-4 mb-4">
            <a href="/legal" className="hover:text-[#0a1128] transition-colors">
              Mentions légales
            </a>
            <span>|</span>
            <a href="/privacy" className="hover:text-[#0a1128] transition-colors">
              Politique de confidentialité
            </a>
            <span>|</span>
            <a href="/sitemap" className="hover:text-[#0a1128] transition-colors">
              Plan du site
            </a>

            <span>|</span>
            <a href="/faq" className="hover:text-[#0a1128] transition-colors">
              FAQ
            </a>
          </div>
          <p>&copy; 2025 SportRadar by VitaMobilis. Tous droits réservés. Projet ficitif dans le cadre de l'école</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
