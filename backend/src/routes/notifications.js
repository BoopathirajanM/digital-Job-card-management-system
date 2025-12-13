const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationController = require('../controllers/notificationController');

// All routes require authentication
router.use(auth);

// GET /api/notifications - Get user's notifications
router.get('/', notificationController.getNotifications);

// PATCH /api/notifications/read-all - Mark all as read
router.patch('/read-all', notificationController.markAllAsRead);

// PATCH /api/notifications/:id/read - Mark as read
router.patch('/:id/read', notificationController.markAsRead);

// DELETE /api/notifications/:id - Delete notification
router.delete('/:id', notificationController.deleteNotification);

module.exports = router;
