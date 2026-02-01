// src/utils/mediaUtils.ts
export const getMediaUrl = (path: string | null | undefined): string | null => {
    if (!path) return null;
    if (path.startsWith('http' )) return path;
    return `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}${path}`;
};