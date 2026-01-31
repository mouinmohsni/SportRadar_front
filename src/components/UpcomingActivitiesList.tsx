// src/components/UpcomingActivitiesList.tsx (CORRIGÉ ET AMÉLIORÉ)

import React from 'react';
import { MapPin, Calendar, Clock } from 'lucide-react';
import type { Activity } from '../types';

// On importe la fonction utilitaire pour construire l'URL de l'image
import { getMediaUrl } from '../utils/media';
import {Link} from "react-router-dom";

interface Props {
  activities: Activity[];
}

const UpcomingActivitiesList: React.FC<Props> = ({ activities }) => {

  // Fonction pour formater la date et l'heure de manière lisible
  const formatDateTime = (isoString: string) => {
    const date = new Date(isoString);
    const dateOptions: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    return {
      date: date.toLocaleDateString('fr-FR', dateOptions),
      time: date.toLocaleTimeString('fr-FR', timeOptions)
    };
  };

  return (
      <div className="space-y-4">
        {activities.length > 0 ? (
            activities.map(act => {
              const { date, time } = formatDateTime(act.start_time);
              const imageUrl = getMediaUrl(act.image);

              return (
                  <div key={act.id} className="p-4 bg-white border rounded-lg shadow-sm flex items-start space-x-4">
                    {/* 1. Petite Photo */}
                    <img
                        src={imageUrl || '/images/activity-default.jpg'} // Image par défaut si pas d'image
                        alt={act.name}
                        className="w-24 h-24 object-cover rounded-md flex-shrink-0"
                    />

                    <div className="flex-grow">
                      {/* Nom de l'activité */}
                      <Link to={`/activities/${act.id}`} className="hover:text-[#dc5f18] transition-colors">
                        <p className="font-bold text-lg text-[#0a1128]">{act.name}</p>
                      </Link>

                      {/* 2. Description (tronquée pour ne pas prendre trop de place) */}
                      {act.description && (
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {act.description}
                          </p>
                      )}

                      <div className="mt-3 space-y-1 text-sm text-gray-700">
                        {/* 3. Date et Heure */}
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-[#dc5f18]" />
                          <span>{date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-2 text-[#dc5f18]" />
                          <span>{time}</span>
                        </div>

                        {/* 4. Lieu */}
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-[#dc5f18]" />
                          <span>{act.effective_location || 'Lieu non spécifié'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
              );
            })
        ) : (
            // Message si aucune activité
            <div className="text-center py-10 px-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucune activité à venir.</p>
            </div>
        )}
      </div>
  );
};

export default UpcomingActivitiesList;
