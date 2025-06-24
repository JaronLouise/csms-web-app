import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { useNavigate } from 'react-router-dom';

const Checkout = () => {
  const { user } = useAuth();
  const { cart, getCartTotal, clearCart, loadCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    apartment: '',
    postalCode: '',
    city: '',
    region: 'Batangas',
    phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Pre-fill form with user profile data if available
    if (user && user.profile) {
      setFormData(prev => ({
        ...prev,
        firstName: user.name.split(' ')[0] || '',
        lastName: user.name.split(' ').slice(1).join(' ') || '',
        phone: user.profile.phone || '',
        address: user.profile.address?.street || '',
        city: user.profile.address?.city || '',
        postalCode: user.profile.address?.zipCode || '',
        region: user.profile.address?.state || 'Batangas',
      }));
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    for (const key in formData) {
      if (['apartment', 'phone'].includes(key)) continue;
      if (!formData[key]) {
        setError(`Please fill out the ${key.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`);
        return;
      }
    }

    setLoading(true);
    try {
      const orderData = {
        billingAddress: formData,
        notes: 'Order for pickup'
      };
      
      const newOrder = await createOrder(orderData);
      await loadCart();
      alert('Order placed successfully! You will be redirected to your orders page.');
      
      // No need to call clearCart here as the backend handles it.
      // The CartContext will eventually sync. For immediate UI update, we can call loadCart or just navigate.
      
      navigate(`/orders`);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2>Your cart is empty.</h2>
        <p>You cannot proceed to checkout without items in your cart.</p>
        <button onClick={() => navigate('/products')}>Continue Shopping</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
      <div style={{ width: '50%', paddingRight: '20px' }}>
        {/* Payment Section */}
        <h2>Payment</h2>
        <p>All transactions are secure and encrypted.</p>
        <div style={{ border: '2px solid #007bff', borderRadius: '5px', padding: '15px', backgroundColor: '#f0f8ff' }}>
          <input type="radio" id="cash" name="payment" value="cash" checked readOnly />
          <label htmlFor="cash" style={{ fontWeight: 'bold', marginLeft: '10px' }}>Cash on Pickup</label>
          <p style={{ marginLeft: '25px', color: '#555' }}>Pay when you pick up your order from the store.</p>
        </div>

        {/* Billing Address Section */}
        <h2 style={{ marginTop: '40px' }}>Billing address</h2>
        <form onSubmit={handleSubmit} id="checkout-form">
          <select name="country" style={inputStyle} disabled><option>Philippines</option></select>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input style={inputStyle} type="text" name="firstName" placeholder="First name" value={formData.firstName} onChange={handleInputChange} required />
            <input style={inputStyle} type="text" name="lastName" placeholder="Last name" value={formData.lastName} onChange={handleInputChange} required />
          </div>
          <input style={inputStyle} type="text" name="address" placeholder="Address" value={formData.address} onChange={handleInputChange} required />
          <input style={inputStyle} type="text" name="apartment" placeholder="Apartment, suite, etc. (optional)" value={formData.apartment} onChange={handleInputChange} />
          <div style={{ display: 'flex', gap: '10px' }}>
            <input style={inputStyle} type="text" name="postalCode" placeholder="Postal code" value={formData.postalCode} onChange={handleInputChange} required />
            <input style={inputStyle} type="text" name="city" placeholder="City" value={formData.city} onChange={handleInputChange} required />
          </div>
          <select name="region" style={inputStyle} value={formData.region} onChange={handleInputChange} required>
            <option value="Batangas">Batangas</option>
            {/* Add other regions if needed */}
          </select>
          <input style={inputStyle} type="tel" name="phone" placeholder="Phone (optional)" value={formData.phone} onChange={handleInputChange} />
        </form>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>

      {/* Order Summary Section */}
      <div style={{ width: '40%', padding: '20px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>Order Summary</h3>
        {cart.items.map(item => (
          <div key={item.product._id || item.product} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <img src={item.image} alt={item.name} style={{ width: '50px', height: '50px', borderRadius: '5px', marginRight: '10px' }} />
              <span>{item.name} x {item.quantity}</span>
            </div>
            <span>₱{item.price * item.quantity}</span>
          </div>
        ))}
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '10px' }}>
          <span>Total</span>
          <span>₱{getCartTotal()}</span>
        </div>
        <button 
          type="submit" 
          form="checkout-form"
          disabled={loading}
          style={{ width: '100%', padding: '15px', marginTop: '20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontSize: '16px' }}
        >
          {loading ? 'Processing...' : 'Complete order'}
        </button>
      </div>
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  borderRadius: '5px',
  border: '1px solid #ccc',
  boxSizing: 'border-box'
};

export default Checkout; 