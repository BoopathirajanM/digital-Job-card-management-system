import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import api from "../lib/api";

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState("all"); // all, unread, read
    const [loading, setLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchNotifications();
    }, []);

    async function fetchNotifications() {
        try {
            const res = await api.get('/notifications');
            setNotifications(res.data.notifications);
            setUnreadCount(res.data.unreadCount);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    }

    async function markAsRead(notificationId) {
        try {
            await api.patch(`/notifications/${notificationId}/read`);
            fetchNotifications();
        } catch (error) {
            console.error('Error marking as read:', error);
        }
    }

    async function markAllAsRead() {
        try {
            await api.patch('/notifications/read-all');
            fetchNotifications();
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    }

    async function deleteNotification(notificationId) {
        try {
            await api.delete(`/notifications/${notificationId}`);
            fetchNotifications();
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    }

    function handleNotificationClick(notification) {
        if (!notification.read) {
            markAsRead(notification._id);
        }
        if (notification.jobCard) {
            navigate(`/jobcards/${notification.jobCard._id}`);
        }
    }

    const filteredNotifications = notifications.filter((n) => {
        if (filter === "unread") return !n.read;
        if (filter === "read") return n.read;
        return true;
    });

    return (
        <Layout>
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="glass-card p-6 mb-6">
                    <div className="flex justify-between items-center">
                        <div>
                            <h1 className="text-3xl font-bold text-gradient">Notifications</h1>
                            <p className="text-slate-600 mt-1">
                                {unreadCount > 0 ? `${unreadCount} unread notifications` : "All caught up!"}
                            </p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="btn-primary text-sm px-4 py-2"
                            >
                                Mark All as Read
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="flex gap-2 mt-6">
                        <button
                            onClick={() => setFilter("all")}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === "all"
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            All ({notifications.length})
                        </button>
                        <button
                            onClick={() => setFilter("unread")}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === "unread"
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            Unread ({unreadCount})
                        </button>
                        <button
                            onClick={() => setFilter("read")}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${filter === "read"
                                    ? "bg-blue-600 text-white"
                                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                        >
                            Read ({notifications.length - unreadCount})
                        </button>
                    </div>
                </div>

                {/* Notifications List */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="loading-spinner"></div>
                    </div>
                ) : filteredNotifications.length === 0 ? (
                    <div className="glass-card p-12 text-center">
                        <svg className="w-24 h-24 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                        </svg>
                        <p className="text-xl font-semibold text-slate-600">No notifications</p>
                        <p className="text-slate-500 mt-2">
                            {filter === "unread" ? "All caught up!" : "You don't have any notifications yet"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredNotifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`glass-card p-5 transition-all hover:shadow-lg ${!notification.read ? "border-l-4 border-l-blue-500 bg-blue-50" : ""
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Icon */}
                                    <div
                                        className={`p-3 rounded-xl ${notification.type === "job_assigned"
                                                ? "bg-blue-100 text-blue-600"
                                                : notification.type === "status_changed"
                                                    ? "bg-green-100 text-green-600"
                                                    : "bg-slate-100 text-slate-600"
                                            }`}
                                    >
                                        {notification.type === "job_assigned" ? (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        ) : (
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <h3 className="font-bold text-slate-900 text-lg">
                                                    {notification.title}
                                                </h3>
                                                <p className="text-slate-700 mt-1">{notification.message}</p>
                                                <div className="flex items-center gap-4 mt-3">
                                                    <p className="text-sm text-slate-500">
                                                        {new Date(notification.createdAt).toLocaleString()}
                                                    </p>
                                                    {!notification.read && (
                                                        <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                                                            NEW
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Actions */}
                                            <div className="flex gap-2">
                                                {notification.jobCard && (
                                                    <button
                                                        onClick={() => handleNotificationClick(notification)}
                                                        className="btn-primary text-sm px-4 py-2"
                                                    >
                                                        View Job
                                                    </button>
                                                )}
                                                {!notification.read && (
                                                    <button
                                                        onClick={() => markAsRead(notification._id)}
                                                        className="btn-outline text-sm px-4 py-2"
                                                    >
                                                        Mark Read
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => deleteNotification(notification._id)}
                                                    className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all"
                                                    title="Delete"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
