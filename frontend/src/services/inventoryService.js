import api from "../lib/api";

// Frontend Inventory Service
// Calls backend inventory API

class InventoryService {
    // Search for parts
    async searchParts(query) {
        try {
            const response = await api.get('/inventory/search', {
                params: { q: query }
            });
            return response.data.results || [];
        } catch (error) {
            console.error('Search parts error:', error);
            return [];
        }
    }

    // Get part details
    async getPartDetails(partNumber) {
        try {
            const response = await api.get(`/inventory/parts/${partNumber}`);
            return response.data;
        } catch (error) {
            console.error('Get part details error:', error);
            return null;
        }
    }

    // Check stock availability
    async checkStock(partNumber) {
        try {
            const response = await api.get(`/inventory/stock/${partNumber}`);
            return response.data;
        } catch (error) {
            console.error('Check stock error:', error);
            return null;
        }
    }

    // Get current price
    async getPrice(partNumber) {
        try {
            const response = await api.get(`/inventory/price/${partNumber}`);
            return response.data;
        } catch (error) {
            console.error('Get price error:', error);
            return null;
        }
    }

    // Get all categories
    async getCategories() {
        try {
            const response = await api.get('/inventory/categories');
            return response.data.categories || [];
        } catch (error) {
            console.error('Get categories error:', error);
            return [];
        }
    }
}

export default new InventoryService();
