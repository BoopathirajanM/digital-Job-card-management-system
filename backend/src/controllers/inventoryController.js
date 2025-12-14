const InventoryItem = require('../models/InventoryItem');

// Get all inventory items
exports.getAllItems = async (req, res) => {
    try {
        const items = await InventoryItem.find({ isActive: true }).sort({ name: 1 });
        res.json(items);
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching inventory items' });
    }
};

// Get single item by ID
exports.getItemById = async (req, res) => {
    try {
        const item = await InventoryItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }
        res.json(item);
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching item' });
    }
};

// Create new inventory item (admin only)
exports.createItem = async (req, res) => {
    try {
        const { partNumber, name, category, description, price, stock, unit, minStock } = req.body;

        // Check if part number already exists
        const existing = await InventoryItem.findOne({ partNumber });
        if (existing) {
            return res.status(400).json({ msg: 'Part number already exists' });
        }

        const item = new InventoryItem({
            partNumber,
            name,
            category,
            description,
            price,
            stock,
            unit,
            minStock
        });

        await item.save();
        res.status(201).json(item);
    } catch (error) {
        console.error('Create item error:', error);
        res.status(500).json({ msg: 'Error creating item' });
    }
};

// Update inventory item (admin only)
exports.updateItem = async (req, res) => {
    try {
        const { name, category, description, price, stock, unit, minStock } = req.body;

        const item = await InventoryItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        // Update fields
        if (name) item.name = name;
        if (category) item.category = category;
        if (description !== undefined) item.description = description;
        if (price !== undefined) item.price = price;
        if (stock !== undefined) item.stock = stock;
        if (unit) item.unit = unit;
        if (minStock !== undefined) item.minStock = minStock;

        await item.save();
        res.json(item);
    } catch (error) {
        console.error('Update item error:', error);
        res.status(500).json({ msg: 'Error updating item' });
    }
};

// Delete inventory item (admin only)
exports.deleteItem = async (req, res) => {
    try {
        const item = await InventoryItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        // Soft delete
        item.isActive = false;
        await item.save();

        res.json({ msg: 'Item deleted successfully' });
    } catch (error) {
        res.status(500).json({ msg: 'Error deleting item' });
    }
};

// Update stock quantity
exports.updateStock = async (req, res) => {
    try {
        const { quantity, operation } = req.body; // operation: 'add' or 'subtract'

        const item = await InventoryItem.findById(req.params.id);
        if (!item) {
            return res.status(404).json({ msg: 'Item not found' });
        }

        if (operation === 'add') {
            item.stock += quantity;
        } else if (operation === 'subtract') {
            item.stock = Math.max(0, item.stock - quantity);
        } else {
            item.stock = quantity; // Direct set
        }

        await item.save();
        res.json(item);
    } catch (error) {
        res.status(500).json({ msg: 'Error updating stock' });
    }
};

// Search inventory items
exports.searchItems = async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({ msg: 'Search query must be at least 2 characters' });
        }

        const items = await InventoryItem.find({
            $text: { $search: q },
            isActive: true
        }).limit(20);

        res.json({
            query: q,
            count: items.length,
            results: items
        });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ msg: 'Error searching items' });
    }
};

// Get item by part number
exports.getItemByPartNumber = async (req, res) => {
    try {
        const item = await InventoryItem.findOne({
            partNumber: req.params.partNumber.toUpperCase(),
            isActive: true
        });

        if (!item) {
            return res.status(404).json({ msg: 'Part not found' });
        }

        res.json(item);
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching part' });
    }
};

// Get all categories
exports.getCategories = async (req, res) => {
    try {
        const categories = await InventoryItem.distinct('category', { isActive: true });
        res.json({ categories: categories.sort() });
    } catch (error) {
        res.status(500).json({ msg: 'Error fetching categories' });
    }
};
