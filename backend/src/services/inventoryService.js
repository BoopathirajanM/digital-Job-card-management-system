const mockInventoryAPI = require('./mockInventoryAPI');
const odooInventoryAPI = require('./odooInventoryAPI');

// Inventory Service Layer
// Switches between mock and Odoo based on environment

class InventoryService {
    constructor() {
        this.mode = process.env.INVENTORY_API_MODE || 'mock';
        console.log('Inventory Service Mode:', this.mode);
    }

    // Helper to check if we should try Odoo
    shouldTryOdoo() {
        return this.mode === 'odoo' || this.mode === 'hybrid';
    }

    // Search for parts
    async searchParts(query) {
        try {
            if (this.shouldTryOdoo()) {
                console.log(`[Hybrid] Searching Odoo for: ${query}`);
                try {
                    const results = await odooInventoryAPI.searchProducts(query);
                    if (results && results.length > 0) {
                        console.log(`[Hybrid] Found ${results.length} items in Odoo`);
                        return results;
                    }
                    console.log('[Hybrid] Odoo returned no results, checking fallback...');
                } catch (odooError) {
                    console.warn('[Hybrid] Odoo API failed, falling back to mock:', odooError.message);
                }
            }
            return mockInventoryAPI.searchParts(query);
        } catch (error) {
            console.error('Search error:', error);
            return mockInventoryAPI.searchParts(query);
        }
    }

    // Get part details
    async getPartDetails(partNumber) {
        try {
            if (this.shouldTryOdoo()) {
                try {
                    const result = await odooInventoryAPI.getProductByPartNumber(partNumber);
                    if (result) return result;
                } catch (odooError) {
                    console.warn('[Hybrid] Odoo API failed, falling back to mock:', odooError.message);
                }
            }
            return mockInventoryAPI.getPartDetails(partNumber);
        } catch (error) {
            console.error('Get part error:', error);
            return mockInventoryAPI.getPartDetails(partNumber);
        }
    }

    // Check stock availability
    async checkStock(partNumber) {
        try {
            if (this.shouldTryOdoo()) {
                try {
                    const product = await odooInventoryAPI.getProductByPartNumber(partNumber);
                    if (product) {
                        return {
                            partNumber: product.partNumber,
                            name: product.name,
                            stock: product.stock,
                            available: product.stock > 0,
                            status: product.stock > 10 ? 'In Stock' :
                                product.stock > 0 ? 'Low Stock' : 'Out of Stock'
                        };
                    }
                } catch (odooError) {
                    console.warn('[Hybrid] Odoo API failed, falling back to mock:', odooError.message);
                }
            }
            return mockInventoryAPI.checkStock(partNumber);
        } catch (error) {
            console.error('Check stock error:', error);
            return mockInventoryAPI.checkStock(partNumber);
        }
    }

    // Get current price
    async getPrice(partNumber) {
        try {
            if (this.shouldTryOdoo()) {
                try {
                    const product = await odooInventoryAPI.getProductByPartNumber(partNumber);
                    if (product) {
                        return {
                            partNumber: product.partNumber,
                            name: product.name,
                            price: product.price,
                            unit: product.unit,
                            lastUpdated: new Date().toISOString()
                        };
                    }
                } catch (odooError) {
                    console.warn('[Hybrid] Odoo API failed, falling back to mock:', odooError.message);
                }
            }
            return mockInventoryAPI.getPrice(partNumber);
        } catch (error) {
            console.error('Get price error:', error);
            return mockInventoryAPI.getPrice(partNumber);
        }
    }

    // Get all categories
    async getCategories() {
        try {
            if (this.shouldTryOdoo()) {
                try {
                    const categories = await odooInventoryAPI.getCategories();
                    if (categories && categories.length > 0) return categories;
                } catch (odooError) {
                    console.warn('[Hybrid] Odoo API failed, falling back to mock:', odooError.message);
                }
            }
            return mockInventoryAPI.getCategories();
        } catch (error) {
            console.error('Get categories error:', error);
            return mockInventoryAPI.getCategories();
        }
    }

    // Get parts by category
    async getPartsByCategory(category) {
        try {
            if (this.shouldTryOdoo()) {
                // Odoo doesn't support category search yet, fallback immediately
                // or implement if Odoo API supports it later
            }
            return mockInventoryAPI.getPartsByCategory(category);
        } catch (error) {
            console.error('Get parts by category error:', error);
            return mockInventoryAPI.getPartsByCategory(category);
        }
    }
}

module.exports = new InventoryService();
