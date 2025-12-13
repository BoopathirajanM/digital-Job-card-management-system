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

/**
 * Get all technicians
 * GET /api/users/technicians
 */
exports.getTechnicians = async (req, res) => {
    try {
        const JobCard = require('../models/JobCard');

        // Find all users with role 'technician'
        const technicians = await User.find({ role: 'technician' })
            .select('name email')
            .sort({ name: 1 });

        // Get job count for each technician
        const techniciansWithCount = await Promise.all(
            technicians.map(async (tech) => {
                const jobCount = await JobCard.countDocuments({
                    assignedTo: tech._id,
                    status: { $in: ['new', 'in_progress', 'awaiting_parts'] }
                });

                return {
                    _id: tech._id,
                    name: tech.name,
                    email: tech.email,
                    activeJobs: jobCount
                };
            })
        );

        res.json(techniciansWithCount);
    } catch (error) {
        console.error('Get technicians error:', error);
        res.status(500).json({ msg: 'Server error fetching technicians' });
    }
};
