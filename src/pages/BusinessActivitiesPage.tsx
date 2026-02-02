import React, { useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Link } from 'react-router-dom';
import { Trash, Pencil } from 'lucide-react';

interface Activity {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

const BusinessActivitiesPage: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyActivities();
  }, []);

  const fetchMyActivities = async () => {
    try {
      const res = await axiosInstance.get('/api/activities/');
      setActivities(res.data);
    } catch (err) {
      console.error('Erreur chargement activités business:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Supprimer cette activité ?")) return;
    try {
      await axiosInstance.delete(`/api/api/activities/${id}/`);
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      console.error("Erreur suppression", err);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-700 mb-6">Mes Activités</h1>

      <div className="mb-6">
        <Link
          to="/activities/new"
          className="bg-[#e63946] text-white px-6 py-3 rounded hover:bg-[#d62828] transition"
        >
          + Créer une activité
        </Link>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : activities.length === 0 ? (
        <p className="text-gray-500">Aucune activité créée pour le moment.</p>
      ) : (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white p-4 shadow rounded flex justify-between items-center">
              <div>
                <h3 className="text-lg font-semibold">{activity.name}</h3>
                <p className="text-sm text-gray-500">{activity.description}</p>
                <p className="text-xs text-gray-400 mt-1">Créée le {new Date(activity.created_at).toLocaleDateString()}</p>
              </div>
              <div className="flex space-x-3">
                <Link
                  to={`/activities/${activity.id}/edit`}
                  className="text-blue-600 hover:text-blue-800"
                  title="Modifier"
                >
                  <Pencil />
                </Link>
                <button
                  onClick={() => handleDelete(activity.id)}
                  className="text-red-500 hover:text-red-700"
                  title="Supprimer"
                >
                  <Trash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BusinessActivitiesPage;
