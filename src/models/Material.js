const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    sku: { type: String, required: true, unique: true, uppercase: true, trim: true },
    category: {
      type: String,
      enum: ['Indoor Driver', 'Outdoor Driver', 'Smart Driver', 'COB LED', 'Raw Material', 'Other'],
      default: 'Other',
    },
    unit: { type: String, default: 'pcs' },
    quantityInStock: { type: Number, required: true, default: 0, min: 0 },
    reorderLevel: { type: Number, required: true, default: 10, min: 0 },
    unitPrice: { type: Number, default: 0, min: 0 },
    supplier: { type: String, trim: true },
    location: { type: String, trim: true, default: 'Main Warehouse' },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

materialSchema.virtual('isLowStock').get(function isLowStock() {
  return this.quantityInStock <= this.reorderLevel;
});

materialSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('Material', materialSchema);
