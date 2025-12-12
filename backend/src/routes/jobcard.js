const express = require('express');
const router = express.Router();
const JobCard = require('../models/JobCard');
const auth = require('../middleware/auth'); // optional, keep simple for now

// GET /api/jobcards
router.get('/', auth, async (req, res) => {
  try {
    const list = await JobCard.find().populate('assignedTo', 'name email role');
    res.json(list);
  } catch(e){ console.error(e); res.status(500).json({ msg:'server error' }); }
});

// POST /api/jobcards
router.post('/', auth, async (req, res) => {
  try {
    const { vehicle, reportedIssues, assignedTo } = req.body;
    const jobNumber = `JC-${Date.now()}`;
    const jc = await JobCard.create({ jobNumber, vehicle, reportedIssues, assignedTo });
    res.json(jc);
  } catch(e){ console.error(e); res.status(500).json({ msg:'server error' }); }
});

module.exports = router;
