// Mock Inventory API
// Simulates a 3rd party inventory system for testing

const mockInventory = {
    "BP-001": {
        partNumber: "BP-001",
        name: "Brake Pads - Front",
        category: "Brakes",
        description: "High-quality ceramic brake pads for front wheels",
        price: 2500,
        stock: 15,
        unit: "set"
    },
    "BP-002": {
        partNumber: "BP-002",
        name: "Brake Pads - Rear",
        category: "Brakes",
        description: "High-quality ceramic brake pads for rear wheels",
        price: 2200,
        stock: 12,
        unit: "set"
    },
    "BD-001": {
        partNumber: "BD-001",
        name: "Brake Disc - Front",
        category: "Brakes",
        description: "Ventilated brake disc for front wheels",
        price: 3500,
        stock: 8,
        unit: "piece"
    },
    "EO-001": {
        partNumber: "EO-001",
        name: "Engine Oil 5W-30 Synthetic",
        category: "Lubricants",
        description: "Fully synthetic engine oil 5W-30",
        price: 850,
        stock: 50,
        unit: "liter"
    },
    "EO-002": {
        partNumber: "EO-002",
        name: "Engine Oil 10W-40 Semi-Synthetic",
        category: "Lubricants",
        description: "Semi-synthetic engine oil 10W-40",
        price: 650,
        stock: 40,
        unit: "liter"
    },
    "OF-001": {
        partNumber: "OF-001",
        name: "Oil Filter",
        category: "Filters",
        description: "Standard oil filter",
        price: 350,
        stock: 30,
        unit: "piece"
    },
    "AF-001": {
        partNumber: "AF-001",
        name: "Air Filter",
        category: "Filters",
        description: "High-flow air filter",
        price: 450,
        stock: 25,
        unit: "piece"
    },
    "FF-001": {
        partNumber: "FF-001",
        name: "Fuel Filter",
        category: "Filters",
        description: "Inline fuel filter",
        price: 400,
        stock: 20,
        unit: "piece"
    },
    "BT-001": {
        partNumber: "BT-001",
        name: "Battery 12V 45Ah",
        category: "Electrical",
        description: "Maintenance-free car battery",
        price: 4500,
        stock: 10,
        unit: "piece"
    },
    "BT-002": {
        partNumber: "BT-002",
        name: "Battery 12V 7Ah (Bike)",
        category: "Electrical",
        description: "Sealed lead-acid battery for bikes",
        price: 1200,
        stock: 15,
        unit: "piece"
    },
    "TR-001": {
        partNumber: "TR-001",
        name: "Tire 185/65 R15",
        category: "Tires",
        description: "Radial tire for cars",
        price: 5500,
        stock: 20,
        unit: "piece"
    },
    "TR-002": {
        partNumber: "TR-002",
        name: "Tire 100/90-17 (Bike)",
        category: "Tires",
        description: "Tubeless tire for bikes",
        price: 2800,
        stock: 25,
        unit: "piece"
    },
    "AC-001": {
        partNumber: "AC-001",
        name: "AC Compressor",
        category: "AC System",
        description: "Air conditioning compressor",
        price: 12000,
        stock: 5,
        unit: "piece"
    },
    "AC-002": {
        partNumber: "AC-002",
        name: "AC Gas R134a",
        category: "AC System",
        description: "Refrigerant gas for AC system",
        price: 800,
        stock: 30,
        unit: "can"
    },
    "AC-003": {
        partNumber: "AC-003",
        name: "AC Filter/Dryer",
        category: "AC System",
        description: "AC system filter and dryer",
        price: 1500,
        stock: 10,
        unit: "piece"
    },
    "SP-001": {
        partNumber: "SP-001",
        name: "Spark Plug (Set of 4)",
        category: "Ignition",
        description: "Iridium spark plugs",
        price: 1200,
        stock: 40,
        unit: "set"
    },
    "SH-001": {
        partNumber: "SH-001",
        name: "Shock Absorber - Front",
        category: "Suspension",
        description: "Gas-filled shock absorber",
        price: 3500,
        stock: 12,
        unit: "piece"
    },
    "SH-002": {
        partNumber: "SH-002",
        name: "Shock Absorber - Rear",
        category: "Suspension",
        description: "Gas-filled shock absorber",
        price: 3200,
        stock: 10,
        unit: "piece"
    }
};

// Search for parts
function searchParts(query) {
    const lowerQuery = query.toLowerCase();
    const results = Object.values(mockInventory).filter(part =>
        part.name.toLowerCase().includes(lowerQuery) ||
        part.partNumber.toLowerCase().includes(lowerQuery) ||
        part.category.toLowerCase().includes(lowerQuery) ||
        part.description.toLowerCase().includes(lowerQuery)
    );
    return results;
}

// Get part details by part number
function getPartDetails(partNumber) {
    return mockInventory[partNumber.toUpperCase()] || null;
}

// Check stock availability
function checkStock(partNumber) {
    const part = mockInventory[partNumber.toUpperCase()];
    if (!part) return null;

    return {
        partNumber: part.partNumber,
        name: part.name,
        stock: part.stock,
        available: part.stock > 0,
        status: part.stock > 10 ? 'In Stock' : part.stock > 0 ? 'Low Stock' : 'Out of Stock'
    };
}

// Get current price
function getPrice(partNumber) {
    const part = mockInventory[partNumber.toUpperCase()];
    if (!part) return null;

    return {
        partNumber: part.partNumber,
        name: part.name,
        price: part.price,
        unit: part.unit
    };
}

// Get all categories
function getCategories() {
    const categories = [...new Set(Object.values(mockInventory).map(part => part.category))];
    return categories.sort();
}

// Get parts by category
function getPartsByCategory(category) {
    return Object.values(mockInventory).filter(part =>
        part.category.toLowerCase() === category.toLowerCase()
    );
}

module.exports = {
    searchParts,
    getPartDetails,
    checkStock,
    getPrice,
    getCategories,
    getPartsByCategory
};
