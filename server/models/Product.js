const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    specifications: {
      capacity: String,
      dimensions: String,
      warranty: String,
      efficiency: String
    },
    images: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
        width: Number,
        height: Number,
        format: String,
        size: Number
      }
    ],
    stock: { type: Number, default: 0 },
    isCustomizable: { type: Boolean, default: false },
    customizationOptions: [
      {
        name: String,
        type: String,
        options: [String]
      }
    ],
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
