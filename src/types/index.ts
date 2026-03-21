// File: src/types/index.ts (VERSION MISE À JOUR)

// ============================================
// 🔧 TYPES POUR LES UTILISATEURS
// ============================================

export interface SimpleUser {
  id: number;
  email: string;
  username: string;
  first_name: string;  // ✅ AJOUTÉ
  last_name: string;   // ✅ AJOUTÉ
  avatar: string | null;
  type: 'coach' | 'personal' | 'business';
}

export interface UserPreferences {
  level: string;
  location: string;
  objectives: string[];
}

export interface User {
  id: number;
  email: string;
  username: string;
  first_name: string;  // ✅ AJOUTÉ
  last_name: string;   // ✅ AJOUTÉ
  type: 'personal' | 'coach' | 'business' | 'admin';
  avatar: string | null;
  is_staff: boolean;
  is_active: boolean;  // ✅ AJOUTÉ
  preferences: UserPreferences;
  company?: Company;
  created_at?: string;
}

export interface Instructor {
  id: number;
  email: string;
  username: string;
  first_name: string;  // ✅ AJOUTÉ
  last_name: string;   // ✅ AJOUTÉ
  type: 'coach' | 'personal' | 'business';
  avatar: string | null;
}

// ============================================
// 🔧 TYPES POUR LES ENTREPRISES
// ============================================

export interface Company {
  id: number;
  name: string;
  description: string | null;
  logo: string | null;
  address: string;
  city: string;
  phone_number: string;
  website: string;
  sport_zen: boolean;
}

// ============================================
// 🔧 TYPES POUR LES ACTIVITÉS
// ============================================

export interface ActivityRating {
  id: number;
  user: SimpleUser;
  score: number;
  comment: string;
  created_at: string;
}

export interface Activity {
  id: number;
  name: string;
  description: string | null;
  category: string;
  image: string | File | null;


  start_time: string; // Format ISO 8601
  duration: string;   // Format HH:MM:SS
  location_address: string;

  price: string; // String car DecimalField
  level: 'all' | 'beginner' | 'intermediate' | 'advanced';
  venue: 'indoor' | 'outdoor';

  max_participants: number;
  participants_count: number;
  ratings: ActivityRating[];
  average_score: number | null;

  is_public: boolean;
  created_at: string;
  effective_location: string;

  // Champs imbriqués
  company: Company;
  instructor: Instructor | null ;
  sport_zen: boolean;
  instructor_id?: number;

}

// ============================================
// 🔧 TYPES POUR LES RÉSERVATIONS
// ============================================

export interface Booking {
  nb_persone: number;
  id: number;
  user: number; // ID de l'utilisateur
  activity: Activity; // Objet activité complet
  status: string;
  created_at: string; // Format ISO 8601
}

// ============================================
// 🔧 TYPES POUR LES AVIS (REVIEWS)
// ============================================

export interface Review {
  id: number;
  user: {
    username: string;
    avatar: string | null;
  };
  rating: number | null;
  comment: string;
  created_at: string;
}

// ============================================
// 🔧 TYPES POUR LES NOTIFICATIONS
// ============================================

export interface Notification {
  id: number;
  message: string;
  date: string;
}
