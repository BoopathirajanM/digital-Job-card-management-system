const mongoose = require('mongoose');
const s = new mongoose.Schema({
  jobNumber: String,
  vehicle: { regNo:String, model:String, ownerName:String, contact:String, kmReading:Number },
  reportedIssues: [String],
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  status: { type:String, enum:['new','in_progress','awaiting_parts','done','closed'], default:'new' },
  spareParts: [{ externalId:String, name:String, qty:Number, unitPrice:Number, totalPrice:Number }],
  labourCharges: Number,
  completionSummary: String,
  logs: [{ by: { type: mongoose.Schema.Types.ObjectId, ref:'User'}, message:String, at: Date }]
}, { timestamps:true });
module.exports = mongoose.model('JobCard', s);
