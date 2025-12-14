const mongoose = require('mongoose');

const sparePartSchema = new mongoose.Schema({
  name: { type: String, required: true },
  partNumber: String,
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  total: { type: Number, required: true, min: 0 }
});

const serviceCostSchema = new mongoose.Schema({
  description: { type: String, required: true },
  cost: { type: Number, required: true, min: 0 }
});

const billingSchema = new mongoose.Schema({
  subtotal: { type: Number, default: 0 },
  taxRate: { type: Number, default: 18 }, // GST 18%
  taxAmount: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'fixed' },
  grandTotal: { type: Number, default: 0 }
});

const jobCardSchema = new mongoose.Schema({
  jobNumber: String,
  vehicle: {
    type: { type: String, enum: ['Car', 'Bike'], required: true },
    regNo: String,
    model: String,
    ownerName: String,
    contact: String,
    kmReading: Number
  },
  reportedIssues: [String],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'awaiting_parts', 'done', 'closed'],
    default: 'new'
  },

  // Billing fields
  spareParts: [sparePartSchema],
  serviceCosts: [serviceCostSchema],
  billing: { type: billingSchema, default: () => ({}) },

  // Invoice fields
  invoiceNumber: String,
  invoiceDate: Date,
  paymentStatus: {
    type: String,
    enum: ['pending', 'partial', 'paid'],
    default: 'pending'
  },
  paymentDate: Date,

  // Legacy fields (keeping for backward compatibility)
  labourCharges: Number,
  completionSummary: String,

  logs: [{
    by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    message: String,
    at: Date
  }]
}, { timestamps: true });

// Auto-generate invoice number when status changes to 'done'
jobCardSchema.pre('save', async function () {
  if (this.isModified('status') && this.status === 'done' && !this.invoiceNumber) {
    const timestamp = Date.now().toString().slice(-6);
    this.invoiceNumber = `INV-${timestamp}`;
    this.invoiceDate = new Date();
  }
});

module.exports = mongoose.model('JobCard', jobCardSchema);
