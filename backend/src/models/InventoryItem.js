const mongoose = require('mongoose');

const inventoryItemSchema = new mongoose.Schema({
    partNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Brakes', 'Lubricants', 'Filters', 'Electrical', 'Tires', 'AC System', 'Ignition', 'Suspension', 'Other']
    },
    description: {
        type: String,
        default: ''
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    unit: {
        type: String,
        required: true,
        enum: ['piece', 'set', 'liter', 'can', 'kg', 'meter'],
        default: 'piece'
    },
    minStock: {
        type: Number,
        default: 5,
        min: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Text index for search
inventoryItemSchema.index({ name: 'text', description: 'text', partNumber: 'text' });

// Virtual for stock status
inventoryItemSchema.virtual('stockStatus').get(function () {
    if (this.stock === 0) return 'Out of Stock';
    if (this.stock <= this.minStock) return 'Low Stock';
    return 'In Stock';
});

module.exports = mongoose.model('InventoryItem', inventoryItemSchema);
