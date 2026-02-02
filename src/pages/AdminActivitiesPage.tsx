import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from "../api/axiosInstance.ts";

interface Activity {
  id: number;
  name: string;
  description: string;
}

const AdminActivitiesPage: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [edited, setEdited] = useState<{ [key: number]: string }>({});


  const fetchActivities = async () => {
    const res = await axios.get('/activities/');
    setActivities(res.data);
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id: number) => {
    await axiosInstance.delete(`/api/activities/${id}/`);
    fetchActivities();
  };

  const handleEdit = async (id: number) => {
    const newName = edited[id];
    if (!newName) return;

    await axiosInstance.put(`/api/activities/${id}/`, { name: newName });
    setEdited(prev => ({ ...prev, [id]: '' }));
    fetchActivities();
  };

  if (!user || user.type !== 'business') {
    return <p className="p-6 text-red-500">Accès réservé aux entreprises.</p>;
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 #0a1128 p-6 shadow-md rounded-xl">
      <h1 className="text-2xl font-bold text-sky-700 mb-4">Activités (admin)</h1>
      {activities.map(activity => (
        <div key={activity.id} className="flex items-center justify-between border-b py-2">
          <input
            type="text"
            value={edited[activity.id] ?? activity.name}
            onChange={e =>
              setEdited(prev => ({ ...prev, [activity.id]: e.target.value }))
            }
            className="flex-1 border border-gray-300 rounded px-2 py-1 mr-4"
          />
          <button
            onClick={() => handleEdit(activity.id)}
            className="bg-green-500 text-gray-200 px-3 py-1 rounded mr-2"
          >
            Modifier
          </button>
          <button
            onClick={() => handleDelete(activity.id)}
            className="bg-red-500 text-gray-200 px-3 py-1 rounded"
          >
            Supprimer
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminActivitiesPage;
