const axios = require('axios');

class OdooInventoryAPI {
    constructor() {
        this.url = process.env.ODOO_URL;
        this.db = process.env.ODOO_DB;
        this.username = process.env.ODOO_USERNAME;
        this.apiKey = process.env.ODOO_API_KEY;
        this.sessionId = null;
    }

    // Authenticate with Odoo
    async authenticate() {
        try {
            const response = await axios.post(
                `${this.url}/web/session/authenticate`,
                {
                    jsonrpc: '2.0',
                    params: {
                        db: this.db,
                        login: this.username,
                        password: this.apiKey
                    }
                },
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true
                }
            );

            if (response.data.result && response.data.result.uid) {
                this.sessionId = response.headers['set-cookie'];
                return true;
            }
            return false;
        } catch (error) {
            console.error('Odoo authentication error:', error.message);
            return false;
        }
    }

    // Search products
    async searchProducts(query) {
        try {
            await this.authenticate();

            const response = await axios.post(
                `${this.url}/web/dataset/call_kw/product.product/search_read`,
                {
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        model: 'product.product',
                        method: 'search_read',
                        args: [[
                            '|', '|',
                            ['name', 'ilike', query],
                            ['default_code', 'ilike', query],
                            ['categ_id', 'ilike', query]
                        ]],
                        kwargs: {
                            fields: ['id', 'name', 'default_code', 'list_price', 'qty_available', 'categ_id', 'uom_id'],
                            limit: 20
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': this.sessionId
                    }
                }
            );

            const products = response.data.result || [];

            // Transform to AutoServe format
            return products.map(p => ({
                partNumber: p.default_code || `ODOO-${p.id}`,
                name: p.name,
                category: p.categ_id ? p.categ_id[1] : 'Other',
                price: p.list_price || 0,
                stock: Math.floor(p.qty_available || 0),
                unit: p.uom_id ? p.uom_id[1].toLowerCase() : 'piece',
                description: ''
            }));
        } catch (error) {
            console.error('Odoo search error:', error.message);
            return [];
        }
    }

    // Get product by part number
    async getProductByPartNumber(partNumber) {
        try {
            await this.authenticate();

            const response = await axios.post(
                `${this.url}/web/dataset/call_kw/product.product/search_read`,
                {
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        model: 'product.product',
                        method: 'search_read',
                        args: [[['default_code', '=', partNumber]]],
                        kwargs: {
                            fields: ['id', 'name', 'default_code', 'list_price', 'qty_available', 'categ_id', 'uom_id'],
                            limit: 1
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': this.sessionId
                    }
                }
            );

            const product = response.data.result ? response.data.result[0] : null;
            if (!product) return null;

            return {
                partNumber: product.default_code || `ODOO-${product.id}`,
                name: product.name,
                category: product.categ_id ? product.categ_id[1] : 'Other',
                price: product.list_price || 0,
                stock: Math.floor(product.qty_available || 0),
                unit: product.uom_id ? product.uom_id[1].toLowerCase() : 'piece',
                description: ''
            };
        } catch (error) {
            console.error('Odoo get product error:', error.message);
            return null;
        }
    }

    // Get all categories
    async getCategories() {
        try {
            await this.authenticate();

            const response = await axios.post(
                `${this.url}/web/dataset/call_kw/product.category/search_read`,
                {
                    jsonrpc: '2.0',
                    method: 'call',
                    params: {
                        model: 'product.category',
                        method: 'search_read',
                        args: [[]],
                        kwargs: {
                            fields: ['name'],
                            limit: 100
                        }
                    }
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Cookie': this.sessionId
                    }
                }
            );

            const categories = response.data.result || [];
            return categories.map(c => c.name).sort();
        } catch (error) {
            console.error('Odoo get categories error:', error.message);
            return [];
        }
    }
}

module.exports = new OdooInventoryAPI();
