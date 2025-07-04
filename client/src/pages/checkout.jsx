import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { createOrder } from '../services/orderService';
import { useNavigate } from 'react-router-dom';

if (typeof document !== 'undefined' && !document.getElementById('checkout-hover-effects')) {
  const style = document.createElement('style');
  style.id = 'checkout-hover-effects';
  style.textContent = `
    .checkout-btn {
      transition: background 0.2s, color 0.2s, transform 0.2s;
    }
    .checkout-btn:hover {
      background: #28a745 !important;
      color: #fff !important;
      transform: translateY(-2px) scale(1.03);
    }
    .checkout-empty-btn {
      transition: background 0.2s, color 0.2s, transform 0.2s;
    }
    .checkout-empty-btn:hover {
      background: #28a745 !important;
      color: #fff !important;
      transform: translateY(-2px) scale(1.03);
    }
  `;
  document.head.appendChild(style);
}

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
      alert('Order placed successfully! You will be redirected to your cart.');
      console.log('DEBUG: Navigating to /cart after order creation');
      navigate(`/cart`);

    } catch (err) {
      setError(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon} className="material-symbols-outlined">shopping_cart</span>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptyText}>You cannot proceed to checkout without items in your cart.</p>
          <button 
            onClick={() => navigate('/products')} 
            style={styles.emptyButton}
            className="checkout-empty-btn"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Checkout</h1>
        <p style={styles.subtitle}>Complete your order and secure your items</p>
      </div>

      <div style={styles.checkoutLayout}>
        {/* Left Column - Payment & Billing */}
        <div style={styles.leftColumn}>
          {/* Payment Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Payment Method</h2>
            <div style={styles.paymentCard}>
              <div style={styles.paymentOption}>
                <input type="radio" id="cash" name="payment" value="cash" checked readOnly />
                <label htmlFor="cash" style={styles.paymentLabel}>Cash on Pickup</label>
                <p style={styles.paymentDescription}>Pay when you pick up your order from the store.</p>
              </div>
            </div>
          </div>

          {/* Billing Address Section */}
          <div style={styles.section}>
            <h2 style={styles.sectionTitle}>Billing Address</h2>
            <form onSubmit={handleSubmit} id="checkout-form" style={styles.form}>
              <select 
                name="country" 
                style={styles.input} 
                disabled
                onFocus={e => e.target.style.borderColor = '#28a745'}
                onBlur={e => e.target.style.borderColor = '#b7eac7'}
              >
                <option>Philippines</option>
              </select>
              
              <div style={styles.inputRow}>
                <input 
                  style={styles.input} 
                  type="text" 
                  name="firstName" 
                  placeholder="First name" 
                  value={formData.firstName} 
                  onChange={handleInputChange} 
                  required
                  onFocus={e => e.target.style.borderColor = '#28a745'}
                  onBlur={e => e.target.style.borderColor = '#b7eac7'}
                />
                <input 
                  style={styles.input} 
                  type="text" 
                  name="lastName" 
                  placeholder="Last name" 
                  value={formData.lastName} 
                  onChange={handleInputChange} 
                  required
                  onFocus={e => e.target.style.borderColor = '#28a745'}
                  onBlur={e => e.target.style.borderColor = '#b7eac7'}
                />
              </div>
              
              <input 
                style={styles.input} 
                type="text" 
                name="address" 
                placeholder="Address" 
                value={formData.address} 
                onChange={handleInputChange} 
                required
                onFocus={e => e.target.style.borderColor = '#28a745'}
                onBlur={e => e.target.style.borderColor = '#b7eac7'}
              />
              
              <input 
                style={styles.input} 
                type="text" 
                name="apartment" 
                placeholder="Apartment, suite, etc. (optional)" 
                value={formData.apartment} 
                onChange={handleInputChange}
                onFocus={e => e.target.style.borderColor = '#28a745'}
                onBlur={e => e.target.style.borderColor = '#b7eac7'}
              />
              
              <div style={styles.inputRow}>
                <input 
                  style={styles.input} 
                  type="text" 
                  name="postalCode" 
                  placeholder="Postal code" 
                  value={formData.postalCode} 
                  onChange={handleInputChange} 
                  required
                  onFocus={e => e.target.style.borderColor = '#28a745'}
                  onBlur={e => e.target.style.borderColor = '#b7eac7'}
                />
                <input 
                  style={styles.input} 
                  type="text" 
                  name="city" 
                  placeholder="City" 
                  value={formData.city} 
                  onChange={handleInputChange} 
                  required
                  onFocus={e => e.target.style.borderColor = '#28a745'}
                  onBlur={e => e.target.style.borderColor = '#b7eac7'}
                />
              </div>
              
              <select 
                name="region" 
                style={styles.input} 
                value={formData.region} 
                onChange={handleInputChange} 
                required
                onFocus={e => e.target.style.borderColor = '#28a745'}
                onBlur={e => e.target.style.borderColor = '#b7eac7'}
              >
                <option value="Batangas">Batangas</option>
              </select>
              
              <input 
                style={styles.input} 
                type="tel" 
                name="phone" 
                placeholder="Phone (optional)" 
                value={formData.phone} 
                onChange={handleInputChange}
                onFocus={e => e.target.style.borderColor = '#28a745'}
                onBlur={e => e.target.style.borderColor = '#b7eac7'}
              />
            </form>
            
            {error && (
              <div style={styles.errorContainer}>
                <span style={styles.errorIcon} className="material-symbols-outlined">warning</span>
                <p style={styles.errorText}>{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div style={styles.rightColumn}>
          <div style={styles.orderSummary}>
            <h3 style={styles.summaryTitle}>Order Summary</h3>
            
            <div style={styles.itemsList}>
              {cart.items.map(item => (
                <div key={item.product._id || item.product} style={styles.itemRow}>
                  <div style={styles.itemInfo}>
                    <span style={styles.itemName}>{item.name}</span>
                    <span style={styles.itemQuantity}>x {item.quantity}</span>
                  </div>
                  <span style={styles.itemPrice}>₱{(item.price * item.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>
            
            <div style={styles.divider}></div>
            
            <div style={styles.totalRow}>
              <span style={styles.totalLabel}>Total</span>
              <span style={styles.totalAmount}>₱{getCartTotal().toLocaleString()}</span>
            </div>
            
            <button 
              type="submit" 
              form="checkout-form"
              disabled={loading}
              style={loading ? styles.submitButtonDisabled : styles.submitButton}
              className="checkout-btn"
            >
              {loading ? (
                <>
                  <div style={styles.loadingSpinner}></div>
                  Processing...
                </>
              ) : (
                'Complete Order'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(180deg, #b2f0e6 0%, #d0f7c6 70%)',
    padding: '2rem',
    fontFamily: 'Poppins, sans-serif'
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '0.5rem',
    letterSpacing: '-1px'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#6c757d',
    margin: 0
  },
  checkoutLayout: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  leftColumn: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2rem'
  },
  rightColumn: {
    height: 'fit-content'
  },
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '1.5rem'
  },
  paymentCard: {
    border: '2px solid #007bff',
    borderRadius: '12px',
    padding: '1.5rem',
    backgroundColor: '#f0f8ff'
  },
  paymentOption: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  paymentLabel: {
    fontWeight: '600',
    color: '#2c3e50',
    fontSize: '1.1rem'
  },
  paymentDescription: {
    color: '#6c757d',
    margin: 0,
    fontSize: '0.95rem'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  inputRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  input: {
    width: '100%',
    padding: '0.85rem',
    borderRadius: '12px',
    border: '2px solid #b7eac7',
    fontSize: '1rem',
    fontFamily: 'Poppins, sans-serif',
    background: '#f5f7fa',
    color: '#222',
    transition: 'border-color 0.3s ease',
    boxSizing: 'border-box',
    outline: 'none'
  },
  orderSummary: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    position: 'sticky',
    top: '2rem'
  },
  summaryTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '1.5rem'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  itemRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.75rem 0'
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem'
  },
  itemName: {
    fontWeight: '500',
    color: '#2c3e50'
  },
  itemQuantity: {
    fontSize: '0.9rem',
    color: '#6c757d'
  },
  itemPrice: {
    fontWeight: '600',
    color: '#2c3e50'
  },
  divider: {
    height: '1px',
    background: '#e9ecef',
    margin: '1.5rem 0'
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem'
  },
  totalLabel: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2c3e50'
  },
  totalAmount: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#28a745'
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(90deg, #28a745 0%, #16a34a 100%)',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    fontSize: '1.1rem',
    fontWeight: '600',
    fontFamily: 'Poppins, sans-serif',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  submitButtonDisabled: {
    width: '100%',
    padding: '16px',
    background: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '12px',
    cursor: 'not-allowed',
    fontSize: '1.1rem',
    fontWeight: '600',
    fontFamily: 'Poppins, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem'
  },
  loadingSpinner: {
    width: '20px',
    height: '20px',
    border: '2px solid #ffffff',
    borderTop: '2px solid transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  },
  errorContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: '1rem',
    background: '#f8d7da',
    border: '1px solid #f5c6cb',
    borderRadius: '8px',
    marginTop: '1rem'
  },
  errorIcon: {
    color: '#dc3545',
    fontSize: '1.2rem'
  },
  errorText: {
    color: '#721c24',
    margin: 0,
    fontSize: '0.95rem'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    textAlign: 'center'
  },
  emptyIcon: {
    fontSize: '4rem',
    color: '#6c757d',
    marginBottom: '1rem'
  },
  emptyTitle: {
    fontSize: '2rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.5rem'
  },
  emptyText: {
    fontSize: '1.1rem',
    color: '#6c757d',
    marginBottom: '2rem'
  },
  emptyButton: {
    padding: '12px 24px',
    background: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '500',
    textDecoration: 'none',
    transition: 'background-color 0.3s ease'
  }
};

// Add CSS animation for loading spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  input:focus, select:focus {
    outline: none;
    border-color: #28a745;
  }
  
  .checkout-submit-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.2);
  }
`;
document.head.appendChild(styleSheet);

export default Checkout; 