// File: src/hooks/useNotifications.ts
import { useState, useEffect, useCallback } from 'react';
import notificationService, {type Notification } from '../services/notificationService';

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState<number>(0);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    /**
     * Charger les notifications
     */
    const fetchNotifications = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await notificationService.getNotifications();
            setNotifications(response.results);
            console.log("response===",response)
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement des notifications');
            console.error('Error fetching notifications:', err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Charger le nombre de notifications non lues
     */
    const fetchUnreadCount = useCallback(async () => {
        try {
            const count = await notificationService.getUnreadCount();
            setUnreadCount(count);
        } catch (err: any) {
            console.error('Error fetching unread count:', err);
        }
    }, []);

    /**
     * Marquer une notification comme lue
     */
    const markAsRead = useCallback(async (notificationId: number) => {
        try {
            await notificationService.markAsRead(notificationId);

            // Mettre à jour l'état local
            setNotifications(prev =>
                prev.map(notif =>
                    notif.id === notificationId ? { ...notif, is_read: true } : notif
                )
            );

            // Mettre à jour le compteur
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err: any) {
            console.error('Error marking notification as read:', err);
            throw err;
        }
    }, []);

    /**
     * Marquer toutes les notifications comme lues
     */
    const markAllAsRead = useCallback(async () => {
        try {
            await notificationService.markAllAsRead();

            // Mettre à jour l'état local
            setNotifications(prev =>
                prev.map(notif => ({ ...notif, is_read: true }))
            );

            // Réinitialiser le compteur
            setUnreadCount(0);
        } catch (err: any) {
            console.error('Error marking all notifications as read:', err);
            throw err;
        }
    }, []);

    /**
     * Supprimer une notification
     */
    const deleteNotification = useCallback(async (notificationId: number) => {
        try {
            await notificationService.deleteNotification(notificationId);

            // Retirer la notification de l'état local
            setNotifications(prev => prev.filter(notif => notif.id !== notificationId));

            // Mettre à jour le compteur si la notification n'était pas lue
            const notification = notifications.find(n => n.id === notificationId);
            if (notification && !notification.is_read) {
                setUnreadCount(prev => Math.max(0, prev - 1));
            }
        } catch (err: any) {
            console.error('Error deleting notification:', err);
            throw err;
        }
    }, [notifications]);

    /**
     * Rafraîchir les notifications (polling)
     */
    useEffect(() => {
        // Charger les notifications au montage
        fetchNotifications();
        fetchUnreadCount();

        // Polling toutes les 30 secondes
        const interval = setInterval(() => {
            fetchUnreadCount();
        }, 30000);

        return () => clearInterval(interval);
    }, [fetchNotifications, fetchUnreadCount]);

    return {
        notifications,
        unreadCount,
        loading,
        error,
        fetchNotifications,
        fetchUnreadCount,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    };
};
