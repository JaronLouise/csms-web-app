const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        name: { type: String, required: true },
        image: { type: String }
      }
    ],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'processing', 'ready_for_pickup', 'completed', 'cancelled'],
      default: 'pending'
    },
    shippingMethod: {
      type: String,
      enum: ['pickup'],
      default: 'pickup'
    },
    paymentMethod: {
      type: String,
      enum: ['cash_on_pickup'],
      default: 'cash_on_pickup'
    },
    billingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      apartment: { type: String },
      postalCode: { type: String, required: true },
      city: { type: String, required: true },
      region: { type: String, required: true },
      phone: { type: String }
    },
    notes: String,
    orderDate: { type: Date, default: Date.now },
    estimatedDelivery: Date
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
