const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

// GET /api/users/profile - Get current user profile
router.get('/profile', auth, userController.getProfile);

// PUT /api/users/profile - Update user profile
router.put('/profile', auth, userController.updateProfile);

// GET /api/users/technicians - Get all technicians
router.get('/technicians', auth, userController.getTechnicians);

module.exports = router;
