require('dotenv').config();
const mongoose = require('mongoose');
const InventoryItem = require('../models/InventoryItem');

// Sample inventory data from mock API
const inventoryData = [
    // Brake Parts
    {
        partNumber: "BP-001",
        name: "Brake Pads - Front",
        category: "Brakes",
        description: "High-quality ceramic brake pads for front wheels",
        price: 2500,
        stock: 15,
        unit: "set",
        minStock: 5
    },
    {
        partNumber: "BP-002",
        name: "Brake Pads - Rear",
        category: "Brakes",
        description: "High-quality ceramic brake pads for rear wheels",
        price: 2200,
        stock: 12,
        unit: "set",
        minStock: 5
    },
    {
        partNumber: "BD-001",
        partNumber: "BD-001",
        name: "Brake Disc - Front",
        category: "Brakes",
        description: "Ventilated brake disc for front wheels",
        price: 3500,
        stock: 8,
        unit: "piece",
        minStock: 3
    },

    // Engine Oil
    {
        partNumber: "EO-001",
        name: "Engine Oil 5W-30 Synthetic",
        category: "Lubricants",
        description: "Fully synthetic engine oil 5W-30",
        price: 850,
        stock: 50,
        unit: "liter",
        minStock: 10
    },
    {
        partNumber: "EO-002",
        name: "Engine Oil 10W-40 Semi-Synthetic",
        category: "Lubricants",
        description: "Semi-synthetic engine oil 10W-40",
        price: 650,
        stock: 40,
        unit: "liter",
        minStock: 10
    },

    // Filters
    {
        partNumber: "OF-001",
        name: "Oil Filter",
        category: "Filters",
        description: "Standard oil filter",
        price: 350,
        stock: 30,
        unit: "piece",
        minStock: 10
    },
    {
        partNumber: "AF-001",
        name: "Air Filter",
        category: "Filters",
        description: "High-flow air filter",
        price: 450,
        stock: 25,
        unit: "piece",
        minStock: 10
    },
    {
        partNumber: "FF-001",
        name: "Fuel Filter",
        category: "Filters",
        description: "Inline fuel filter",
        price: 400,
        stock: 20,
        unit: "piece",
        minStock: 8
    },

    // Battery
    {
        partNumber: "BT-001",
        name: "Battery 12V 45Ah",
        category: "Electrical",
        description: "Maintenance-free car battery",
        price: 4500,
        stock: 10,
        unit: "piece",
        minStock: 3
    },
    {
        partNumber: "BT-002",
        name: "Battery 12V 7Ah (Bike)",
        category: "Electrical",
        description: "Sealed lead-acid battery for bikes",
        price: 1200,
        stock: 15,
        unit: "piece",
        minStock: 5
    },

    // Tires
    {
        partNumber: "TR-001",
        name: "Tire 185/65 R15",
        category: "Tires",
        description: "Radial tire for cars",
        price: 5500,
        stock: 20,
        unit: "piece",
        minStock: 8
    },
    {
        partNumber: "TR-002",
        name: "Tire 100/90-17 (Bike)",
        category: "Tires",
        description: "Tubeless tire for bikes",
        price: 2800,
        stock: 25,
        unit: "piece",
        minStock: 10
    },

    // AC Parts
    {
        partNumber: "AC-001",
        name: "AC Compressor",
        category: "AC System",
        description: "Air conditioning compressor",
        price: 12000,
        stock: 5,
        unit: "piece",
        minStock: 2
    },
    {
        partNumber: "AC-002",
        name: "AC Gas R134a",
        category: "AC System",
        description: "Refrigerant gas for AC system",
        price: 800,
        stock: 30,
        unit: "can",
        minStock: 10
    },
    {
        partNumber: "AC-003",
        name: "AC Filter/Dryer",
        category: "AC System",
        description: "AC system filter and dryer",
        price: 1500,
        stock: 10,
        unit: "piece",
        minStock: 3
    },

    // Spark Plugs
    {
        partNumber: "SP-001",
        name: "Spark Plug (Set of 4)",
        category: "Ignition",
        description: "Iridium spark plugs",
        price: 1200,
        stock: 40,
        unit: "set",
        minStock: 10
    },

    // Suspension
    {
        partNumber: "SH-001",
        name: "Shock Absorber - Front",
        category: "Suspension",
        description: "Gas-filled shock absorber",
        price: 3500,
        stock: 12,
        unit: "piece",
        minStock: 4
    },
    {
        partNumber: "SH-002",
        name: "Shock Absorber - Rear",
        category: "Suspension",
        description: "Gas-filled shock absorber",
        price: 3200,
        stock: 10,
        unit: "piece",
        minStock: 4
    }
];

async function seedInventory() {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing inventory
        await InventoryItem.deleteMany({});
        console.log('Cleared existing inventory');

        // Insert new inventory data
        await InventoryItem.insertMany(inventoryData);
        console.log(`✅ Successfully seeded ${inventoryData.length} inventory items`);

        // Display summary
        const categories = await InventoryItem.distinct('category');
        console.log('\nCategories:', categories.join(', '));

        const totalStock = await InventoryItem.aggregate([
            { $group: { _id: null, total: { $sum: '$stock' } } }
        ]);
        console.log('Total items in stock:', totalStock[0]?.total || 0);

        mongoose.connection.close();
        console.log('\n✅ Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error seeding database:', error);
        process.exit(1);
    }
}

// Run the seed function
seedInventory();
