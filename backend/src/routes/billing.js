const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const billingController = require('../controllers/billingController');

// All routes require authentication
router.use(auth);

// POST /api/jobcards/:id/billing/calculate - Calculate bill totals
router.post('/:id/billing/calculate', billingController.calculateBill);

// PUT /api/jobcards/:id/billing - Update billing information
router.put('/:id/billing', billingController.updateBilling);

// GET /api/jobcards/:id/invoice - Get invoice data
router.get('/:id/invoice', billingController.getInvoice);

// PATCH /api/jobcards/:id/payment-status - Update payment status
router.patch('/:id/payment-status', billingController.updatePaymentStatus);

module.exports = router;
