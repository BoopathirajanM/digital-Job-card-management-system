const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if(!email || !password) return res.status(400).json({ msg: 'Missing fields' });
    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ msg: 'Email exists' });
    const hash = await bcrypt.hash(password, 10);
    const u = await User.create({ name, email, passwordHash: hash, role });
    res.json({ msg: 'ok', userId: u._id });
  } catch (e) { console.error(e); res.status(500).json({ msg:'server error' }) }
});

// POST /api/auth/login
router.post('/login', async (req,res)=>{
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if(!user) return res.status(400).json({ msg:'invalid' });
    const match = await bcrypt.compare(password, user.passwordHash);
    if(!match) return res.status(400).json({ msg:'invalid' });
    const token = jwt.sign({ id: user._id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ token });
  } catch(e){ console.error(e); res.status(500).json({ msg:'server error'}) }
});

module.exports = router;
