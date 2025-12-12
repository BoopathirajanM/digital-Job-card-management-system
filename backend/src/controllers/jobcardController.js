const JobCard = require('../models/JobCard');
const generateJobNumber = require('../utils/generateJobNumber');

/**
 * Get all job cards
 * GET /api/jobcards
 */
exports.getAllJobCards = async (req, res) => {
    try {
        const jobCards = await JobCard.find()
            .populate('assignedTo', 'name email role')
            .sort({ createdAt: -1 }); // Most recent first

        res.json(jobCards);
    } catch (error) {
        console.error('Get all job cards error:', error);
        res.status(500).json({ msg: 'Server error fetching job cards' });
    }
};

/**
 * Get single job card by ID
 * GET /api/jobcards/:id
 */
exports.getJobCardById = async (req, res) => {
    try {
        const { id } = req.params;

        const jobCard = await JobCard.findById(id)
            .populate('assignedTo', 'name email role')
            .populate('logs.by', 'name email');

        if (!jobCard) {
            return res.status(404).json({ msg: 'Job card not found' });
        }

        res.json(jobCard);
    } catch (error) {
        console.error('Get job card by ID error:', error);
        res.status(500).json({ msg: 'Server error fetching job card' });
    }
};

/**
 * Create new job card
 * POST /api/jobcards
 */
exports.createJobCard = async (req, res) => {
    try {
        const { vehicle, reportedIssues, assignedTo } = req.body;

        // Validate required fields
        if (!vehicle || !vehicle.regNo || !vehicle.model || !vehicle.ownerName) {
            return res.status(400).json({ msg: 'Vehicle details are required' });
        }

        // Generate unique job number
        const jobNumber = generateJobNumber();

        // Create job card
        const jobCard = await JobCard.create({
            jobNumber,
            vehicle,
            reportedIssues: reportedIssues || [],
            assignedTo: assignedTo || null,
            status: 'new'
        });

        // Add creation log
        if (req.user && req.user.id) {
            jobCard.logs.push({
                by: req.user.id,
                message: 'Job card created',
                at: new Date()
            });
            await jobCard.save();
        }

        res.status(201).json(jobCard);
    } catch (error) {
        console.error('Create job card error:', error);
        res.status(500).json({ msg: 'Server error creating job card' });
    }
};

/**
 * Update job card
 * PUT /api/jobcards/:id
 */
exports.updateJobCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, assignedTo, notes, spareParts, labourCharges, completionSummary } = req.body;

        const jobCard = await JobCard.findById(id);
        if (!jobCard) {
            return res.status(404).json({ msg: 'Job card not found' });
        }

        // Update fields if provided
        if (status) jobCard.status = status;
        if (assignedTo !== undefined) jobCard.assignedTo = assignedTo;
        if (spareParts) jobCard.spareParts = spareParts;
        if (labourCharges !== undefined) jobCard.labourCharges = labourCharges;
        if (completionSummary) jobCard.completionSummary = completionSummary;

        // Add log entry
        if (req.user && req.user.id) {
            const logMessage = notes || `Job card updated - Status: ${status || jobCard.status}`;
            jobCard.logs.push({
                by: req.user.id,
                message: logMessage,
                at: new Date()
            });
        }

        await jobCard.save();

        // Populate and return updated job card
        const updatedJobCard = await JobCard.findById(id)
            .populate('assignedTo', 'name email role')
            .populate('logs.by', 'name email');

        res.json(updatedJobCard);
    } catch (error) {
        console.error('Update job card error:', error);
        res.status(500).json({ msg: 'Server error updating job card' });
    }
};

/**
 * Delete job card
 * DELETE /api/jobcards/:id
 */
exports.deleteJobCard = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user is manager or admin
        if (req.user && !['manager', 'admin'].includes(req.user.role)) {
            return res.status(403).json({ msg: 'Only managers can delete job cards' });
        }

        const jobCard = await JobCard.findByIdAndDelete(id);
        if (!jobCard) {
            return res.status(404).json({ msg: 'Job card not found' });
        }

        res.json({ msg: 'Job card deleted successfully', jobNumber: jobCard.jobNumber });
    } catch (error) {
        console.error('Delete job card error:', error);
        res.status(500).json({ msg: 'Server error deleting job card' });
    }
};
