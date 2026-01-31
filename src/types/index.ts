// File: src/types/index.ts

// Déclare les types Activity et Notification

export interface Activity {
  id: number;
  name: string;
  description: string | null;
  category: string;
  image: string | null;

  start_time: string; // C'est une chaîne de caractères au format ISO 8601
  duration: string;   // C'est une chaîne de caractères au format HH:MM:SS
  location_address:string;

  price: string; // C'est un string, pas un nombre, car c'est un DecimalField
  level: 'all' | 'beginner' | 'intermediate' | 'advanced'; // Soyons précis
  venue: 'indoor' | 'outdoor';

  max_participants: number;
  participants_count: number; // Votre API renvoie un nombre, pas un string
  ratings: ActivityRating[]; // Le champ s'appelle 'ratings'
  average_score: number | null; // Le champ s'appelle 'average_score'


  is_public: boolean;
  created_at: string;
  effective_location: string;

  // --- Champs imbriqués ---
  company: Company;
  instructor: Instructor | null; // L'instructeur peut être null
}

export interface SimpleUser {
  username: string;
  avatar: string | null;
}

export interface ActivityRating {
  id: number;
  user: SimpleUser;
  score: number; // Votre champ s'appelle 'score'
  comment: string;
  created_at: string;
}

export interface Review {
  id: number;
  user: { // On n'a besoin que du nom d'utilisateur
    username: string;
    avatar: string | null;
  };
  rating: number | null;
  comment: string;
  created_at: string;
}

export interface Notification {
  id: number;
  message: string;
  date: string;
}

// src/types/index.ts (ou un nom similaire)

// Interface pour l'objet Company retourné par l'API
export interface Company {
  id: number;
  name: string;
  description: string | null;
  logo: string | null;
  address: string; // <-- Maintenant disponible !
  city: string;
  phone_number: string; // <-- Maintenant disponible !
  website: string;
  sport_zen: boolean;
}

// Interface pour l'objet Instructor (qui est un User) retourné par l'API
export interface Instructor {
  id: number;
  email: string;
  username: string;
  type: 'coach' | 'personal' | 'business'; // On peut être précis sur les types possibles
  avatar: string | null; // L'avatar peut être null
}

export interface Booking {
  id: number;
  user: number; // L'ID de l'utilisateur qui a réservé
  activity: Activity; // L'objet activité complet (ou juste { id: number } si votre API ne renvoie que l'ID)
  status: 'confirmed' | 'cancelled' | 'pending'; // Les statuts possibles
  created_at: string; // La date de création au format ISO 8601
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
  type: 'personal' | 'coach' | 'business';
  avatar: string | null;
  is_staff: boolean;
  preferences: UserPreferences; // <-- Utilisez la nouvelle interface ici
}
