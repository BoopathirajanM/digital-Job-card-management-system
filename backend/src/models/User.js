const mongoose = require('mongoose');
const s = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
  role: { type: String, enum: ['service_advisor','technician','cashier','manager','admin'], default:'service_advisor' }
}, { timestamps:true });
module.exports = mongoose.model('User', s);
