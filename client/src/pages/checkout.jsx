import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { createOrder } from '../services/orderService';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });
  const [notes, setNotes] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  // Calculate total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    setError(null);

    try {
      const orderData = {
        items: cart.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        shippingAddress,
        notes,
        totalAmount: total
      };

      await createOrder(orderData);
      clearCart();
      alert('Order placed successfully! You will receive a confirmation email shortly.');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order');
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div>
        <h2>Checkout</h2>
        <p>Your cart is empty. Please add some items before checkout.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Checkout</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <div>
        <h3>Order Summary</h3>
        {cart.map(item => (
          <div key={item._id}>
            <span>{item.name} x {item.quantity}</span>
            <span>₱{item.price * item.quantity}</span>
          </div>
        ))}
        <div>
          <strong>Total: ₱{total}</strong>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <h3>Shipping Information</h3>
        <input
          placeholder="Street Address"
          value={shippingAddress.street}
          onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})}
          required
        />
        <input
          placeholder="City"
          value={shippingAddress.city}
          onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})}
          required
        />
        <input
          placeholder="State/Province"
          value={shippingAddress.state}
          onChange={e => setShippingAddress({...shippingAddress, state: e.target.value})}
          required
        />
        <input
          placeholder="ZIP Code"
          value={shippingAddress.zipCode}
          onChange={e => setShippingAddress({...shippingAddress, zipCode: e.target.value})}
          required
        />
        <input
          placeholder="Phone Number"
          value={shippingAddress.phone}
          onChange={e => setShippingAddress({...shippingAddress, phone: e.target.value})}
          required
        />
        
        <h3>Order Notes (Optional)</h3>
        <textarea
          placeholder="Any special instructions or notes..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
        />
        
        <button type="submit" disabled={isProcessing}>
          {isProcessing ? 'Processing...' : 'Place Order'}
        </button>
      </form>
    </div>
  );
};

export default Checkout; 