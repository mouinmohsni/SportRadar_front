// File: src/components/PastActivitiesList.tsx
import React from 'react';
import type { Activity } from '../types';

interface Props {
  activities: Activity[];
}

const PastActivitiesList: React.FC<Props> = ({ activities }) => (
  <ul className="space-y-3 mb-8">
    {activities.map((a, idx) => (
      <li key={idx} className="p-4 bg-gray-50 border rounded shadow-sm">
        <p className="font-semibold">{a.name}</p>
        <p className="text-sm text-gray-600">
          Inscrit le {new Date(a.start_time).toLocaleDateString('fr-FR')}
        </p>
      </li>
    ))}
    {activities.length === 0 && (
      <p className="text-center text-gray-500">Aucun historique.</p>
    )}
  </ul>
);

export default PastActivitiesList;
