const mongoose = require('mongoose');

const purchaseRequestSchema = new mongoose.Schema(
  {
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'Material', required: true },
    quantity: { type: Number, required: true, min: 1 },
    supplier: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'approved', 'ordered', 'received', 'cancelled'], default: 'pending' },
    notes: { type: String, trim: true },
    requestedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('PurchaseRequest', purchaseRequestSchema);
