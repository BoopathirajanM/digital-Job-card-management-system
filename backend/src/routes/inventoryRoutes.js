const express = require('express');
const router = express.Router();
const inventoryService = require('../services/inventoryService');
const inventoryController = require('../controllers/inventoryController');
const auth = require('../middleware/auth');

// All routes require authentication
router.use(auth);

// Search for parts
// GET /api/inventory/search?q=brake
router.get('/search', async (req, res) => {
    try {
        const { q } = req.query;

        if (!q || q.trim().length < 2) {
            return res.status(400).json({
                msg: 'Search query must be at least 2 characters'
            });
        }

        const results = await inventoryService.searchParts(q);
        res.json({
            query: q,
            count: results.length,
            results
        });
    } catch (error) {
        console.error('Search parts error:', error);
        res.status(500).json({ msg: 'Error searching parts' });
    }
});

// Get part details by part number
// GET /api/inventory/parts/:partNumber
router.get('/parts/:partNumber', async (req, res) => {
    try {
        const { partNumber } = req.params;
        const part = await inventoryService.getPartDetails(partNumber);

        if (!part) {
            return res.status(404).json({ msg: 'Part not found' });
        }

        res.json(part);
    } catch (error) {
        console.error('Get part details error:', error);
        res.status(500).json({ msg: 'Error fetching part details' });
    }
});

// Check stock availability
// GET /api/inventory/stock/:partNumber
router.get('/stock/:partNumber', async (req, res) => {
    try {
        const { partNumber } = req.params;
        const stock = await inventoryService.checkStock(partNumber);

        if (!stock) {
            return res.status(404).json({ msg: 'Part not found' });
        }

        res.json(stock);
    } catch (error) {
        console.error('Check stock error:', error);
        res.status(500).json({ msg: 'Error checking stock' });
    }
});

// Get current price
// GET /api/inventory/price/:partNumber
router.get('/price/:partNumber', async (req, res) => {
    try {
        const { partNumber } = req.params;
        const price = await inventoryService.getPrice(partNumber);

        if (!price) {
            return res.status(404).json({ msg: 'Part not found' });
        }

        res.json(price);
    } catch (error) {
        console.error('Get price error:', error);
        res.status(500).json({ msg: 'Error fetching price' });
    }
});

// Get all categories
// GET /api/inventory/categories
router.get('/categories', async (req, res) => {
    try {
        const categories = await inventoryService.getCategories();
        res.json({ categories });
    } catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ msg: 'Error fetching categories' });
    }
});

// Get parts by category
// GET /api/inventory/category/:category
router.get('/category/:category', async (req, res) => {
    try {
        const { category } = req.params;
        const parts = await inventoryService.getPartsByCategory(category);
        res.json({
            category,
            count: parts.length,
            parts
        });
    } catch (error) {
        console.error('Get parts by category error:', error);
        res.status(500).json({ msg: 'Error fetching parts' });
    }
});

// CRUD Routes (Admin/Manager only)

// Check if user is admin or manager
const isAdminOrManager = (req, res, next) => {
    if (!['admin', 'manager'].includes(req.user.role)) {
        return res.status(403).json({ msg: 'Access denied. Admin or Manager only.' });
    }
    next();
};

// Get all inventory items
// GET /api/inventory
router.get('/', inventoryController.getAllItems);

// Create new inventory item (admin/manager only)
// POST /api/inventory
router.post('/', isAdminOrManager, inventoryController.createItem);

// Update inventory item (admin/manager only)
// PUT /api/inventory/:id
router.put('/:id', isAdminOrManager, inventoryController.updateItem);

// Delete inventory item (admin/manager only)
// DELETE /api/inventory/:id
router.delete('/:id', isAdminOrManager, inventoryController.deleteItem);

// Update stock quantity
// PATCH /api/inventory/:id/stock
router.patch('/:id/stock', isAdminOrManager, inventoryController.updateStock);

module.exports = router;
