import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/adminService';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setError(null); // Clear previous errors on success
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.');
      console.error(err);
    }
  };
  
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <h3>Order Management</h3>
      <table style={{ width: '100%', marginTop: '1rem' }}>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>User</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order._id.slice(-6)}</td>
              <td>{order.user?.name || 'N/A'}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>₱{order.totalAmount}</td>
              <td>{order.status}</td>
              <td>
                <select 
                  value={order.status} 
                  onChange={(e) => handleStatusChange(order._id, e.target.value)}
                >
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrderList; 