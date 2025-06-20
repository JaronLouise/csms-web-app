import { useEffect, useState } from 'react';
import { getMyOrders } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError('Failed to load orders');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Loading orders...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>My Orders</h2>
      {orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div>
          {orders.map(order => (
            <div key={order._id} style={{ border: '1px solid #ccc', margin: '10px 0', padding: '10px' }}>
              <h3>Order #{order._id.slice(-6)}</h3>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Status:</strong> {order.status}</p>
              <p><strong>Total:</strong> ₱{order.totalAmount}</p>
              
              <h4>Items:</h4>
              <ul>
                {order.items.map((item, index) => (
                  <li key={index}>
                    {item.name} x {item.quantity} - ₱{item.price * item.quantity}
                  </li>
                ))}
              </ul>
              
              {order.shippingAddress && (
                <div>
                  <h4>Shipping Address:</h4>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}</p>
                  <p>Phone: {order.shippingAddress.phone}</p>
                </div>
              )}
              
              {order.notes && (
                <div>
                  <h4>Notes:</h4>
                  <p>{order.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders; 