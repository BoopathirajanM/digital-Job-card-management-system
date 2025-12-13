const JobCard = require('../models/JobCard');

// Calculate bill totals
exports.calculateBill = async (req, res) => {
    try {
        const { id } = req.params;
        const { spareParts, serviceCosts, discount, discountType } = req.body;

        // Calculate spare parts total
        const sparePartsTotal = (spareParts || []).reduce((sum, part) => {
            return sum + (part.quantity * part.unitPrice);
        }, 0);

        // Calculate service costs total
        const serviceCostsTotal = (serviceCosts || []).reduce((sum, service) => {
            return sum + service.cost;
        }, 0);

        // Calculate subtotal
        const subtotal = sparePartsTotal + serviceCostsTotal;

        // Apply discount
        let discountAmount = 0;
        if (discount && discount > 0) {
            if (discountType === 'percentage') {
                discountAmount = (subtotal * discount) / 100;
            } else {
                discountAmount = discount;
            }
        }

        const afterDiscount = subtotal - discountAmount;

        // Calculate tax (18% GST)
        const taxRate = 18;
        const taxAmount = (afterDiscount * taxRate) / 100;

        // Calculate grand total
        const grandTotal = afterDiscount + taxAmount;

        res.json({
            subtotal: subtotal.toFixed(2),
            discount: discountAmount.toFixed(2),
            taxRate,
            taxAmount: taxAmount.toFixed(2),
            grandTotal: grandTotal.toFixed(2)
        });
    } catch (error) {
        console.error('Calculate bill error:', error);
        res.status(500).json({ msg: 'Server error calculating bill' });
    }
};

// Update billing information
exports.updateBilling = async (req, res) => {
    try {
        const { id } = req.params;
        const { spareParts, serviceCosts, discount, discountType } = req.body;

        const jobCard = await JobCard.findById(id);
        if (!jobCard) {
            return res.status(404).json({ msg: 'Job card not found' });
        }

        // Update spare parts with calculated totals
        const updatedSpareParts = (spareParts || []).map(part => ({
            ...part,
            total: part.quantity * part.unitPrice
        }));

        // Calculate totals
        const sparePartsTotal = updatedSpareParts.reduce((sum, part) => sum + part.total, 0);
        const serviceCostsTotal = (serviceCosts || []).reduce((sum, service) => sum + service.cost, 0);
        const subtotal = sparePartsTotal + serviceCostsTotal;

        // Apply discount
        let discountAmount = 0;
        if (discount && discount > 0) {
            if (discountType === 'percentage') {
                discountAmount = (subtotal * discount) / 100;
            } else {
                discountAmount = discount;
            }
        }

        const afterDiscount = subtotal - discountAmount;
        const taxRate = 18;
        const taxAmount = (afterDiscount * taxRate) / 100;
        const grandTotal = afterDiscount + taxAmount;

        // Update job card
        jobCard.spareParts = updatedSpareParts;
        jobCard.serviceCosts = serviceCosts || [];
        jobCard.billing = {
            subtotal,
            taxRate,
            taxAmount,
            discount: discountAmount,
            discountType: discountType || 'fixed',
            grandTotal
        };

        // Add log entry
        jobCard.logs.push({
            by: req.user.id,
            message: 'Billing information updated',
            at: new Date()
        });

        await jobCard.save();

        res.json({ msg: 'Billing updated successfully', jobCard });
    } catch (error) {
        console.error('Update billing error:', error);
        res.status(500).json({ msg: 'Server error updating billing' });
    }
};

// Get invoice data
exports.getInvoice = async (req, res) => {
    try {
        const { id } = req.params;
        const jobCard = await JobCard.findById(id)
            .populate('assignedTo', 'name email')
            .populate('logs.by', 'name');

        if (!jobCard) {
            return res.status(404).json({ msg: 'Job card not found' });
        }

        res.json(jobCard);
    } catch (error) {
        console.error('Get invoice error:', error);
        res.status(500).json({ msg: 'Server error fetching invoice' });
    }
};

// Update payment status
exports.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { paymentStatus } = req.body;

        if (!['pending', 'partial', 'paid'].includes(paymentStatus)) {
            return res.status(400).json({ msg: 'Invalid payment status' });
        }

        const jobCard = await JobCard.findById(id);
        if (!jobCard) {
            return res.status(404).json({ msg: 'Job card not found' });
        }

        jobCard.paymentStatus = paymentStatus;
        if (paymentStatus === 'paid') {
            jobCard.paymentDate = new Date();
        }

        // Add log entry
        jobCard.logs.push({
            by: req.user.id,
            message: `Payment status updated to ${paymentStatus}`,
            at: new Date()
        });

        await jobCard.save();

        res.json({ msg: 'Payment status updated', jobCard });
    } catch (error) {
        console.error('Update payment status error:', error);
        res.status(500).json({ msg: 'Server error updating payment status' });
    }
};
