// src/utils/media.ts

// On récupère l'URL de base de l'API depuis les variables d'environnement.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Construit l'URL complète pour une ressource média du back-end.
 * @param relativePath - Le chemin relatif renvoyé par l'API (ex: "avatars/image.jpg").
 * @returns L'URL complète (ex: "http://localhost:8000/media/avatars/image.jpg" ).
 */
export const getMediaUrl = (pathOrUrl: string | null | undefined): string | undefined => {
    // Si le chemin est vide, null ou undefined, on ne fait rien.
    if (!pathOrUrl) {
        return undefined;
    }

    // --- LOGIQUE AMÉLIORÉE ---
    // Si le chemin est DÉJÀ une URL complète, on le renvoie directement.
    if (pathOrUrl.startsWith('http://' ) || pathOrUrl.startsWith('https://' )) {
        return pathOrUrl;
    }

    // Si ce n'est PAS une URL complète, alors c'est un chemin relatif.
    // On construit l'URL comme avant.
    const cleanedPath = pathOrUrl.startsWith('/') ? pathOrUrl.slice(1) : pathOrUrl;

    // On s'assure que API_BASE_URL est bien défini pour éviter les "undefined/"
    if (!API_BASE_URL) {
        console.error("La variable d'environnement VITE_API_BASE_URL n'est pas définie !");
        return `/media/${cleanedPath}`; // On renvoie une URL relative en dernier recours.
    }

    return `${API_BASE_URL}/media/${cleanedPath}`;
};

export const getImageUrl = (img: string | null | undefined) => {
    if (!img) return '/images/activity-default.jpg';
    if (/^https?:\/\//i.test(img)) return img;
    return `${import.meta.env.VITE_MEDIA_URL}${img}`;
};