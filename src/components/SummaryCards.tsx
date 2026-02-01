import React, { useMemo } from 'react';
import type { Activity, Notification } from '../types';
import { ActivitySquare, Zap, Clock, Bell } from 'lucide-react';
import Card from './Card';

interface SummaryCardsProps {
  activities: Activity[];
  notifications: Notification[];
}

const SummaryCards: React.FC<SummaryCardsProps> = ({ activities, notifications }) => {
  const today = new Date();

  // Filtre des activités à venir et passées
  const upcoming = useMemo(
    () => activities.filter(a => new Date(a.start_time) >= today),
    [activities, today]
  );
  const past = useMemo(
    () => activities.filter(a => new Date(a.start_time) < today),
    [activities, today]
  );

  // Prochaine activité la plus proche
  const nextActivity = useMemo(
    () =>
      upcoming
        .slice()
        .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())[0],
    [upcoming]
  );

  // Nombre de notifications (on peut étendre pour ne compter que les non-lues)
  const unreadCount = notifications.length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {/* Carte Prochaine activité */}
      <Card title="Prochaine activité" icon={<ActivitySquare />}>
        {nextActivity ? (
          <>
            <p className="font-semibold">{nextActivity.name}</p>
            <p className="text-sm">
              {nextActivity.start_time} à {nextActivity.start_time}
            </p>
          </>
        ) : (
          <p className="text-sm">Aucune activité</p>
        )}
      </Card>

      {/* Carte Activités à venir */}
      <Card title="À venir" icon={<Zap />}>
        <p className="text-2xl font-bold">{upcoming.length}</p>
      </Card>

      {/* Carte Activités passées */}
      <Card title="Passées" icon={<Clock />}>
        <p className="text-2xl font-bold">{past.length}</p>
      </Card>

      {/* Carte Notifications */}
      <Card title="Notifications" icon={<Bell />}>
        <p className="text-2xl font-bold">{unreadCount}</p>
      </Card>
    </div>
  );
};

export default SummaryCards;
