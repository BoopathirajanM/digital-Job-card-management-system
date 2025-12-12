const bcrypt = require('bcryptjs');
const User = require('../models/User');

/**
 * Update user profile (name and/or password)
 * PUT /api/users/profile
 */
exports.updateProfile = async (req, res) => {
    try {
        const userId = req.user.id; // From JWT token
        const { name, password } = req.body;

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Update name if provided
        if (name !== undefined && name !== null) {
            user.name = name;
        }

        // Update password if provided
        if (password) {
            if (password.length < 6) {
                return res.status(400).json({ msg: 'Password must be at least 6 characters' });
            }
            user.passwordHash = await bcrypt.hash(password, 10);
        }

        await user.save();

        res.json({
            msg: 'Profile updated successfully',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ msg: 'Server error updating profile' });
    }
};

/**
 * Get current user profile
 * GET /api/users/profile
 */
exports.getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ msg: 'Server error fetching profile' });
    }
};
