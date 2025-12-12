const express = require('express');
const router = express.Router();
const jobcardController = require('../controllers/jobcardController');
const auth = require('../middleware/auth');

// GET /api/jobcards - Get all job cards
router.get('/', auth, jobcardController.getAllJobCards);

// GET /api/jobcards/:id - Get single job card
router.get('/:id', auth, jobcardController.getJobCardById);

// POST /api/jobcards - Create new job card
router.post('/', auth, jobcardController.createJobCard);

// PUT /api/jobcards/:id - Update job card
router.put('/:id', auth, jobcardController.updateJobCard);

// DELETE /api/jobcards/:id - Delete job card (manager only)
router.delete('/:id', auth, jobcardController.deleteJobCard);

module.exports = router;
