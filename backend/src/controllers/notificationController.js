const Notification = require('../models/Notification');

/**
 * Get user's notifications
 * GET /api/notifications
 */
exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id;
        const { unreadOnly } = req.query;

        const filter = { user: userId };
        if (unreadOnly === 'true') {
            filter.read = false;
        }

        const notifications = await Notification.find(filter)
            .populate('jobCard', 'jobNumber status')
            .sort({ createdAt: -1 })
            .limit(50);

        const unreadCount = await Notification.countDocuments({
            user: userId,
            read: false
        });

        res.json({
            notifications,
            unreadCount
        });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ msg: 'Server error fetching notifications' });
    }
};

/**
 * Mark notification as read
 * PATCH /api/notifications/:id/read
 */
exports.markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOne({ _id: id, user: userId });
        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        notification.read = true;
        await notification.save();

        res.json({ msg: 'Notification marked as read' });
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ msg: 'Server error updating notification' });
    }
};

/**
 * Mark all notifications as read
 * PATCH /api/notifications/read-all
 */
exports.markAllAsRead = async (req, res) => {
    try {
        const userId = req.user.id;

        await Notification.updateMany(
            { user: userId, read: false },
            { read: true }
        );

        res.json({ msg: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ msg: 'Server error updating notifications' });
    }
};

/**
 * Delete notification
 * DELETE /api/notifications/:id
 */
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user.id;

        const notification = await Notification.findOneAndDelete({ _id: id, user: userId });
        if (!notification) {
            return res.status(404).json({ msg: 'Notification not found' });
        }

        res.json({ msg: 'Notification deleted' });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ msg: 'Server error deleting notification' });
    }
};

/**
 * Helper function to create notification
 */
exports.createNotification = async (userId, type, title, message, jobCardId = null) => {
    try {
        await Notification.create({
            user: userId,
            type,
            title,
            message,
            jobCard: jobCardId
        });
    } catch (error) {
        console.error('Create notification error:', error);
    }
};
