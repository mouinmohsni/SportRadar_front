// src/pages/DashboardPage.tsx (COMPLET ET CORRIGÉ)

import React, { useEffect, useState, useMemo, useLayoutEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axiosInstance from '../api/axiosInstance';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { toast } from 'react-toastify';
import { Star } from 'lucide-react';
import SummaryCards from '../components/SummaryCards';
import PreferencesCard from '../components/PreferencesCard';
import UpcomingActivitiesList from '../components/UpcomingActivitiesList';
import PastActivitiesList from '../components/PastActivitiesList';
import QuickActions from '../components/QuickActions';
import CountUp from 'react-countup';
import { Helmet } from 'react-helmet-async';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis,
  Tooltip as RechartsTooltip, ResponsiveContainer
} from 'recharts';
import type { Activity, Booking, Notification } from '../types'; // Assurez-vous d'importer Booking

const DashboardPage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activities, setActivities] = useState<Activity[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [date, setDate] = useState<Date>(new Date());
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  useLayoutEffect(() => { window.scrollTo(0, 0); }, [tab, location.pathname]);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data: bookings } = await axiosInstance.get<Booking[]>('/bookings/');
        const userActivities = bookings.map(booking => booking.activity).filter(Boolean) as Activity[];
        setActivities(userActivities);

        setNotifications([
          { id: 1, message: 'Nouvelle activité ajoutée', date: '2025-06-20' },
          { id: 2, message: 'Préférences mises à jour', date: '2025-06-25' }
        ]);
      } catch {
        toast.error('Erreur lors du chargement de vos données.');
      } finally {
        setLoading(false);
      }
    })();
  }, [isAuthenticated]);

  // --- CORRECTION : RÉINTÉGRATION DES VARIABLES MANQUANTES ---

  const today = useMemo(() => new Date(), []);
  const upcoming = useMemo(() => activities.filter(a => new Date(a.start_time) >= today), [activities, today]);
  const past = useMemo(() => activities.filter(a => new Date(a.start_time) < today), [activities, today]);

  const avgPriceByCategory = useMemo(() => {
    const m: Record<string, { sum: number; count: number }> = {};
    activities.forEach(a => {
      const num = parseFloat(a.price?.replace(/[^\d.]/g, '') || '') || 0;
      if (!m[a.category]) m[a.category] = { sum: 0, count: 0 };
      m[a.category].sum += num;
      m[a.category].count += 1;
    });
    return Object.entries(m).map(([category, { sum, count }]) => ({
      category,
      avgPrice: count ? parseFloat((sum / count).toFixed(2)) : 0
    }));
  }, [activities]);

  const objectivePercent = useMemo(() => {
    const objectives = user?.preferences?.objectives || [];
    if (objectives.length === 0) return 0; // Éviter la division par zéro
    const done = activities.filter(a => objectives.includes(a.category)).length;
    return Math.min(100, Math.round((done / objectives.length) * 100));
  }, [activities, user]);

  const recommendations = useMemo(() => {
    const prefLevel = user?.preferences?.level || '';
    const objectives = user?.preferences?.objectives || [];
    const first = activities.filter(a => objectives.includes(a.category) && a.level === prefLevel);
    const levelOnly = activities.filter(a => a.level === prefLevel && !first.includes(a));
    const freq: Record<string, number> = {};
    levelOnly.forEach(a => { freq[a.name] = (freq[a.name] || 0) + 1; });
    const second = Object.entries(freq)
        .sort(([, a], [, b]) => b - a)
        .map(([name]) => levelOnly.find(a => a.name === name)!)
        .filter(Boolean);
    return [...new Set([...first, ...second])].slice(0, 3); // Utiliser un Set pour dédupliquer
  }, [activities, user]);

  const communityPercent = useMemo(() => Math.floor((1 - Math.min(activities.length, 100) / 100) * 100), [activities]);

  // --- FIN DE LA CORRECTION ---

  if (!user) return null;
  if (loading) return <div className="min-h-screen flex justify-center items-center">Chargement…</div>;

  return (
      <>
        <Helmet>
          <title>Mon espace - SportRadar</title>
          <meta name="description" content="Consultez vos statistiques d'activités et suivez votre progression bien-être." />
          <meta name="robots" content="noindex, nofollow" />
        </Helmet>

        <div className="min-h-screen bg-[#C7C5C5] p-6">
          <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-2xl p-8">

            {/* ... Le reste de votre JSX reste exactement le même ... */}
            {/* Il fonctionnera maintenant car toutes les variables existent. */}

            <div className="mb-6">
              <h1 className="text-2xl font-bold text-[#0a1128]">
                Bienvenue, <span className="text-[#dc5f18]">{user.username}</span> !
              </h1>
              <h3>{user.email}</h3>
            </div>
            <div className="mb-8">
              <SummaryCards activities={activities} notifications={notifications} />
            </div>
            {user.preferences && <PreferencesCard preferences={user.preferences} />}
            <div className="flex flex-col lg:flex-row gap-8 mb-8">
              <div className="flex-1">

                <div className="flex space-x-4 mb-4">
                  <button
                      className={`px-6 py-2 rounded ${tab === 'upcoming' ? 'bg-[#dc5f18] text-white' : 'bg-gray-200'}`}
                      onClick={() => setTab('upcoming')}
                  >À venir ({upcoming.length})</button>
                  <button
                      className={`px-6 py-2 rounded ${tab === 'past' ? 'bg-[#dc5f18] text-white' : 'bg-gray-200'}`}
                      onClick={() => setTab('past')}
                  >Passées ({past.length})</button>
                </div>
                {tab === 'upcoming'
                    ? <UpcomingActivitiesList activities={upcoming} />
                    : <PastActivitiesList activities={past} />}
              </div>
              <div className="w-full lg:w-80">
                <h2 className="text-xl font-semibold mb-4">Calendrier</h2>
                <Calendar
                    onChange={(value) => {
                      if (value) {
                        const dateValue = Array.isArray(value) ? value[0] : value;
                        if (dateValue) {
                          setDate(dateValue);
                        }
                      }
                    }}
                    value={date}
                    tileContent={({ date: d, view }) => view === 'month' && (
                        activities.filter(a => new Date(a.start_time).toDateString() === d.toDateString()).length > 0
                            ? <div className="mx-auto mt-1 rounded-full bg-[#dc5f18]" style={{ width: 8, height: 8 }} />
                            : null
                    )}
                />
                <div className="mt-4">
                  <h3 className="font-medium mb-2">Activités du {date.toLocaleDateString()}</h3>
                  {activities.filter(a => new Date(a.start_time).toDateString() === date.toDateString()).map(a => (
                      <p key={a.id} className="text-sm bg-gray-100 p-2 rounded mb-1">{a.name} — {new Date(a.start_time).toLocaleTimeString()}</p>
                  ))}
                  {!activities.some(a => new Date(a.start_time).toDateString() === date.toDateString()) && <p className="text-gray-500">Aucune activité</p>}
                </div>
              </div>
            </div>
            <section className="mb-8 p-6 bg-gradient-to-r from-[#0a1128] to-[#14213d] rounded-lg text-center text-white">
              <h2 className="text-lg font-semibold mb-2">Votre position dans la communauté</h2>
              {activities.length === 0 ? (
                  <>
                    <div className="text-5xl font-extrabold mb-2">0%</div>
                    <p className="mb-4">Aucune activité pour l'instant. Lancez-vous !</p>
                    <Star className="w-6 h-6 text-gray-500 mx-auto" />
                  </>
              ) : (
                  <>
                    <div className="text-5xl font-extrabold mb-2">
                      <CountUp end={communityPercent} suffix="%" duration={1.2} />
                    </div>
                    <div className="flex justify-center space-x-1 mb-2">
                      {Array.from({ length: communityPercent >= 90 ? 5 : communityPercent >= 50 ? 3 : 1 }).map((_, i) => (
                          <Star key={i} className="w-6 h-6 text-[#dc5f18] animate-pulse" />
                      ))}
                    </div>
                    <p className="text-lg">{communityPercent >= 90 ? '🎉 Bravo ! Vous êtes dans le top 10 %.' : communityPercent >= 50 ? '👍 Vous êtes bien parti, continuez !' : '🚀 Mobilisez-vous, vous pouvez progresser !'}</p>
                  </>
              )}
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Nos recommandations par rapport à vos objectifs</h2>
              <div className="flex items-center space-x-8 relative">
                <div className="relative w-32 h-32">
                  <PieChart width={128} height={128}>
                    <Pie data={[{ name: 'reste', value: 100 - objectivePercent }, { name: 'atteint', value: objectivePercent }]} dataKey="value" innerRadius={40} outerRadius={60} startAngle={90} endAngle={-270}>
                      <Cell fill="#e5e7eb" />
                      <Cell fill="#dc5f18" />
                    </Pie>
                  </PieChart>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-bold text-lg text-[#0a1128]">{objectivePercent}%</span>
                  </div>
                </div>
                <div className="flex-1">
                  {recommendations.length > 0 ? (
                      <ul className="space-y-2">{recommendations.map((r, i) => (
                          <li key={r.id} className="flex items-center bg-gray-50 p-3 rounded-lg shadow-sm">
                            <span className={`mr-3 text-2xl ${i === 0 ? 'text-[#dc5f18]' : i === 1 ? 'text-[#ffc658]' : 'text-[#82ca9d]'}`}>★</span>
                            <div><p className="font-semibold text-[#0a1128]">{r.name}</p><p className="text-sm text-gray-600">{r.level ? `Niveau ${r.level}` : 'Correspond à vos objectifs'}</p></div>
                          </li>))}</ul>
                  ) : (
                      <p className="text-gray-600 italic">Poursuivez vos activités pour recevoir des suggestions personnalisées !</p>
                  )}
                </div>
              </div>
            </section>
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Prix moyen par catégorie (€)</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={avgPriceByCategory} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <XAxis dataKey="category" />
                  <YAxis />
                  <RechartsTooltip />
                  <Bar dataKey="avgPrice" fill="#0a1128" />
                </BarChart>
              </ResponsiveContainer>
            </section>
            <QuickActions />
          </div>
        </div>
      </>
  );
};

export default DashboardPage;
