const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Register a new user
 * POST /api/auth/register
 */
exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Validate required fields
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: 'Email already registered' });
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create new user
        const user = await User.create({
            name: name || '',
            email,
            passwordHash,
            role: role || 'service_advisor'
        });

        res.status(201).json({
            msg: 'User registered successfully',
            userId: user._id
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ msg: 'Server error during registration' });
    }
};

/**
 * Login user and return JWT token
 * POST /api/auth/login
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ msg: 'Email and password are required' });
        }

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }

        // Compare password
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
            return res.status(401).json({ msg: 'Invalid email or password' });
        }

        // Generate JWT token with user info
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                name: user.name
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ msg: 'Server error during login' });
    }
};
