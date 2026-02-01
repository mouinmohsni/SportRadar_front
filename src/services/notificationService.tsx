// File: src/services/notificationService.ts
import axiosInstance from '../api/axiosInstance'; // Importez votre instance existante

export interface Notification {
    id: number;
    type: 'reminder' | 'booking' | 'assignment' | 'cancellation' | 'resignation' | 'review' | 'report' | 'alert' | 'info';
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
    async getNotifications(): Promise<Notification[]> {
        // Si votre API utilise la pagination de Django Rest Framework, elle renvoie { results: [] }
        // Sinon, elle renvoie directement le tableau [].
        const response = await axiosInstance.get('/notifications/');
        return response.data.results || response.data;
    }

    /**
     * Récupérer le nombre de notifications non lues
     */
    async getUnreadCount(): Promise<number> {
        const response = await axiosInstance.get('/notifications/unread-count/');
        // Note: Dans votre backend views.py, on a renvoyé {'unread_count': count}
        return response.data.unread_count;
    }

    /**
     * Marquer une notification comme lue
     */
    async markAsRead(notificationId: number): Promise<void> {
        await axiosInstance.post(`/notifications/${notificationId}/mark-read/`);
    }

    /**
     * Marquer toutes les notifications comme lues
     */
    async markAllAsRead(): Promise<void> {
        await axiosInstance.post('/notifications/mark-all-read/');
    }

    /**
     * Supprimer une notification
     */
    async deleteNotification(notificationId: number): Promise<void> {
        await axiosInstance.delete(`/notifications/${notificationId}/`);
    }
}

export default new NotificationService();
