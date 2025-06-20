const Order = require('../models/Order');
const sendEmail = require('../utils/sendEmail');

// Create new order
exports.createOrder = async (req, res) => {
  try {
    const { items, shippingAddress, notes } = req.body;

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const order = await Order.create({
      user: req.user._id,
      items,
      shippingAddress,
      notes,
      totalAmount
    });

    // Send confirmation email to user
    const userEmail = req.user.email;
    const orderSummary = items.map(item =>
      `<li>${item.quantity} x ${item.product} — ₱${item.price}</li>`
    ).join('');

    const emailBody = `
      <h2>Order Confirmation</h2>
      <p>Thank you for your order!</p>
      <p><strong>Total:</strong> ₱${totalAmount}</p>
      <ul>${orderSummary}</ul>
      <p>We'll contact you soon regarding delivery and payment.</p>
    `;

    await sendEmail(userEmail, 'Your CSPS Order Confirmation', emailBody);

    // Optional: notify admin
    await sendEmail(
      process.env.EMAIL_FROM,
      'New Order Received',
      `<p>A new order has been placed by ${req.user.name} (${req.user.email}).</p>`
    );

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Order failed', error: err });
  }
};

// Get orders for current user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).populate('items.product');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Get single order by ID
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('items.product');
    if (!order) return res.status(404).json({ message: 'Order not found' });

    // Only admin or owner can access
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch order' });
  }
};

// Admin: Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('user', 'name email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
};

// Admin: Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.status = req.body.status || order.status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
};

// Client: Cancel order if not shipped or delivered
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (["shipped", "delivered", "cancelled"].includes(order.status)) {
      return res.status(400).json({ message: `Order cannot be cancelled when status is '${order.status}'.` });
    }
    order.status = 'cancelled';
    await order.save();
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};
