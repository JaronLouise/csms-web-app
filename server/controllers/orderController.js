const Order = require('../models/Order');
const User = require('../models/User');
const emailService = require('../services/emailService');

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
    try {
      await emailService.sendOrderConfirmation(order, req.user);
      console.log('Order confirmation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send order confirmation email:', emailError);
      // Don't fail the order creation if email fails
    }

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

    const previousStatus = order.status;
    order.status = req.body.status || order.status;
    await order.save();

    // Send status update email to user
    try {
      const user = await User.findById(order.user);
      if (user) {
        await emailService.sendOrderStatusUpdate(order, user, previousStatus);
        console.log('Order status update email sent successfully');
      }
    } catch (emailError) {
      console.error('Failed to send order status update email:', emailError);
      // Don't fail the status update if email fails
    }

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
    
    const previousStatus = order.status;
    order.status = 'cancelled';
    await order.save();

    // Send cancellation email to user
    try {
      await emailService.sendOrderStatusUpdate(order, req.user, previousStatus);
      console.log('Order cancellation email sent successfully');
    } catch (emailError) {
      console.error('Failed to send order cancellation email:', emailError);
      // Don't fail the cancellation if email fails
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: 'Failed to cancel order' });
  }
};
