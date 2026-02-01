// File: src/services/notificationService.ts
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface Notification {
    id: number;
    type: 'reminder' | 'booking' | 'assignment' | 'cancellation' | 'review' | 'report' | 'alert' | 'info';
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
    related_object_type?: string;
    related_object_id?: number;
}

export interface NotificationResponse {
    count: number;
    next: string | null;
    previous: string | null;
    results: Notification[];
}

class NotificationService {
    /**
     * Récupérer toutes les notifications de l'utilisateur connecté
     */
    async getNotifications(): Promise<NotificationResponse> {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/notifications/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    }

    /**
     * Récupérer le nombre de notifications non lues
     */
    async getUnreadCount(): Promise<number> {
        const token = localStorage.getItem('access_token');
        const response = await axios.get(`${API_URL}/notifications/unread-count/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data.count;
    }

    /**
     * Marquer une notification comme lue
     */
    async markAsRead(notificationId: number): Promise<void> {
        const token = localStorage.getItem('access_token');
        await axios.post(
            `${API_URL}/notifications/${notificationId}/mark-read/`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    async markAllAsRead(): Promise<void> {
        const token = localStorage.getItem('access_token');
        await axios.post(
            `${API_URL}/notifications/mark-all-read/`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    }

    /**
     * Supprimer une notification
     */
    async deleteNotification(notificationId: number): Promise<void> {
        const token = localStorage.getItem('access_token');
        await axios.delete(`${API_URL}/notifications/${notificationId}/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
    }
}

export default new NotificationService();
