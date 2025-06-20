const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        customizations: [
          {
            option: String,
            value: String
          }
        ]
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
      default: 'pending'
    },
    shippingAddress: {
      street: String,
      city: String,
      zipCode: String
    },
    notes: String,
    orderDate: { type: Date, default: Date.now },
    estimatedDelivery: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
