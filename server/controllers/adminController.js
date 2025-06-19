const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    const totalSalesData = await Order.aggregate([
      {
        $group: {
          _id: null,
          totalSales: { $sum: '$totalAmount' }
        }
      }
    ]);

    const totalSales = totalSalesData[0]?.totalSales || 0;

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalSales
    });
  } catch (err) {
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
};
