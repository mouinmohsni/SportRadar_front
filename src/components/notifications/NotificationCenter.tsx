import React, { useState, useRef, useEffect } from 'react';
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react';
import { useNotifications } from '../../hooks/useNotifications';
import type {Notification} from '../../services/notificationService';

const NotificationCenter: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const {
        notifications,
        unreadCount,
        loading,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        fetchNotifications,
    } = useNotifications();

    // Fermer le dropdown quand on clique à l'extérieur
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications();
        }
    };

    const handleMarkAsRead = async (notificationId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await markAsRead(notificationId);
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const handleDelete = async (notificationId: number, e: React.MouseEvent) => {
        e.stopPropagation();
        try {
            await deleteNotification(notificationId);
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const getNotificationIcon = (type: Notification['type']) => {
        const iconClass = 'w-5 h-5';
        switch (type) {
            case 'reminder':
                return <Bell className={iconClass} />;
            case 'booking':
                return <Check className={iconClass} />;
            case 'assignment':
                return <CheckCheck className={iconClass} />;
            case 'cancellation':
                return <X className={iconClass} />;
            case 'alert':
                return <Bell className={`${iconClass} text-red-500`} />;
            default:
                return <Bell className={iconClass} />;
        }
    };

    const getNotificationColor = (type: Notification['type']) => {
        switch (type) {
            case 'reminder':
                return 'bg-blue-500';
            case 'booking':
                return 'bg-green-500';
            case 'assignment':
                return 'bg-purple-500';
            case 'cancellation':
                return 'bg-red-500';
            case 'alert':
                return 'bg-orange-500';
            case 'review':
                return 'bg-yellow-500';
            default:
                return 'bg-gray-500';
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays < 7) return `Il y a ${diffDays}j`;
        return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bouton Bell avec badge */}
            <button
                onClick={handleToggle}
                className="relative p-2 text-gray-600 hover:text-[#dc5f18] transition-colors rounded-lg hover:bg-gray-100"
            >
                <Bell className="w-6 h-6" />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-[#dc5f18] text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50 max-h-[600px] flex flex-col">
                    {/* Header */}
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-[#0a1128] to-[#1a2148] text-white rounded-t-xl">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-bold">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-sm text-white/80 hover:text-white transition-colors flex items-center gap-1"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                    Tout marquer comme lu
                                </button>
                            )}
                        </div>
                        {unreadCount > 0 && (
                            <p className="text-sm text-white/70 mt-1">
                                {unreadCount} notification{unreadCount > 1 ? 's' : ''} non lue{unreadCount > 1 ? 's' : ''}
                            </p>
                        )}
                    </div>

                    {/* Liste des notifications */}
                    <div className="overflow-y-auto flex-1">
                        {loading ? (
                            <div className="p-8 text-center text-gray-500">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#dc5f18] mx-auto"></div>
                                <p className="mt-2">Chargement...</p>
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                <p className="font-medium">Aucune notification</p>
                                <p className="text-sm mt-1">Vous êtes à jour !</p>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer group ${
                                            !notification.is_read ? 'bg-blue-50/50' : ''
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            {/* Icône */}
                                            <div className={`flex-shrink-0 w-10 h-10 rounded-full ${getNotificationColor(notification.type)} flex items-center justify-center text-white`}>
                                                {getNotificationIcon(notification.type)}
                                            </div>

                                            {/* Contenu */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <h4 className={`text-sm font-semibold ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`}>
                                                        {notification.title}
                                                    </h4>
                                                    {!notification.is_read && (
                                                        <span className="flex-shrink-0 w-2 h-2 bg-[#dc5f18] rounded-full"></span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-2">
                                                    {formatDate(notification.created_at)}
                                                </p>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex-shrink-0 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {!notification.is_read && (
                                                    <button
                                                        onClick={(e) => handleMarkAsRead(notification.id, e)}
                                                        className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                                                        title="Marquer comme lu"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </button>
                                                )}
                                                <button
                                                    onClick={(e) => handleDelete(notification.id, e)}
                                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                    title="Supprimer"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="p-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                            <button
                                onClick={() => setIsOpen(false)}
                                className="w-full text-center text-sm text-[#dc5f18] hover:text-[#0a1128] font-medium transition-colors"
                            >
                                Fermer
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationCenter;
