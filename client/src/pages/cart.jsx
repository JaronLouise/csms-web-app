import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, loading, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    const actualProductId = typeof productId === 'object' ? productId._id : productId;
    updateQuantity(actualProductId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    const actualProductId = typeof productId === 'object' ? productId._id : productId;
    removeFromCart(actualProductId);
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '20px' }}>
        <p>Loading cart...</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      overflowX: 'hidden',
      background: 'linear-gradient(135deg, #b6f7a7 0%, #7ee8fa 100%)',
      fontFamily: 'Poppins, sans-serif',
      padding: 0,
      margin: 0,
      boxSizing: 'border-box',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-start',
      paddingLeft: 8,
      paddingRight: 8,
    }}>
      <div style={{
        maxWidth: 700,
        width: '98vw',
        margin: '32px auto',
        background: 'white',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        padding: 20,
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
      }}>
        <h1 style={{
          fontWeight: 700,
          fontSize: '2.2rem',
          color: '#222',
          margin: 0,
          marginBottom: 32,
          textAlign: 'left',
          letterSpacing: 0.5,
          fontFamily: 'Poppins, sans-serif',
        }}>SHOPPING CART</h1>
        {cart.items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '1.2rem', color: '#666', fontFamily: 'Poppins, sans-serif' }}>Your cart is empty</p>
            <button 
              onClick={() => navigate('/products')}
              style={{
                marginTop: 10,
                padding: '12px 32px',
                background: '#047857',
                color: 'white',
                border: 'none',
                borderRadius: 999,
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                fontFamily: 'Poppins, sans-serif',
              }}
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              {cart.items.map((item, idx) => (
                <div 
                  key={item._id} 
                  style={{
                    background: '#fff',
                    borderRadius: 14,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                    padding: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 12,
                    marginBottom: 12,
                    flexWrap: 'wrap',
                  }}
                >
                  {/* Product Image, Name, Price */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 120, flex: 2 }}>
                    {item.image && (
                      <img 
                        src={item.image} 
                        alt={item.name}
                        style={{
                          width: 60,
                          height: 60,
                          objectFit: 'contain',
                          borderRadius: 10,
                          background: '#e2e8f0',
                          boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                        }}
                      />
                    )}
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 'clamp(0.95rem, 2.5vw, 1rem)', fontFamily: 'Poppins, sans-serif', color: '#444', marginBottom: 2 }}>{item.name}</div>
                      <div style={{ color: '#555', fontWeight: 500, fontSize: 'clamp(0.9rem, 2vw, 0.98rem)', fontFamily: 'Poppins, sans-serif', textAlign: 'left' }}>₱{item.price.toLocaleString()}</div>
                    </div>
                  </div>
                  {/* Quantity Controls */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, justifyContent: 'center', minWidth: 90 }}>
                    <button 
                      onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      style={{
                        background: item.quantity <= 1 ? '#e5e7eb' : '#d1d5db',
                        color: '#222',
                        border: 'none',
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer',
                        fontFamily: 'Poppins, sans-serif',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                        marginRight: 2,
                      }}
                    >-</button>
                    <span style={{
                      fontWeight: 500,
                      fontSize: 'clamp(0.95rem, 2vw, 1rem)',
                      minWidth: 20,
                      textAlign: 'center',
                      color: '#555',
                      fontFamily: 'Poppins, sans-serif',
                      background: '#f3f4f6',
                      borderRadius: 6,
                      padding: '4px 10px',
                      border: '1px solid #e5e7eb',
                      margin: '0 2px',
                      display: 'inline-block',
                    }}>{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                      style={{
                        background: '#38bdf8',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 6,
                        padding: '4px 10px',
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        fontFamily: 'Poppins, sans-serif',
                        boxShadow: '0 1px 4px rgba(0,0,0,0.07)',
                        marginLeft: 2,
                      }}
                    >+</button>
                  </div>
                  {/* Line Subtotal */}
                  <div style={{ fontWeight: 700, color: '#111', fontSize: '1rem', minWidth: 70, textAlign: 'right', flex: 1 }}>
                    ₱{(item.price * item.quantity).toLocaleString()}
                  </div>
                  {/* Remove Button */}
                  <button 
                    onClick={() => handleRemoveItem(item.product)}
                    style={{
                      background: '#dc3545',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 8,
                      padding: '6px 16px',
                      fontWeight: 400,
                      fontSize: 'clamp(0.9rem, 2vw, 0.95rem)',
                      cursor: 'pointer',
                      marginLeft: 8,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                      fontFamily: 'Poppins, sans-serif',
                    }}
                  >Remove</button>
                </div>
              ))}
            </div>
            {/* Total and Checkout */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: 18 }}>
              <div style={{ fontWeight: 700, fontSize: '1.4rem', color: '#111', fontFamily: 'Poppins, sans-serif', marginBottom: 10 }}>
                Total: <span style={{ color: '#444', fontWeight: 700, fontFamily: 'Poppins, sans-serif' }}>₱{getCartTotal().toLocaleString()}</span>
              </div>
              <button 
                onClick={() => navigate('/checkout')}
                style={{
                  background: '#22c55e',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  padding: '14px 32px',
                  fontWeight: 700,
                  fontSize: '1.4rem',
                  cursor: 'pointer',
                  marginTop: 0,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  fontFamily: 'Poppins, sans-serif',
                }}
              >Proceed to Checkout</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const cartStyles = {
  bg: {
    minHeight: '100vh',
    width: '100vw',
    background: 'linear-gradient(90deg, #D1FAE5 0%, #C1F3B3 100%)',
    fontFamily: 'Poppins, sans-serif',
    padding: 0,
    margin: 0,
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },
  hero: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: '16px',
    padding: '32px 24px 24px 24px',
    margin: '0 auto 24px auto',
    maxWidth: '1100px',
    width: '100%',
    boxSizing: 'border-box',
    flexWrap: 'wrap',
    gap: '16px',
  },
  heroText: {
    flex: '1 1 300px',
    minWidth: '220px',
  },
  heroHeading: {
    fontSize: 'clamp(2rem, 4vw, 2.8rem)',
    fontWeight: '700',
    fontFamily: 'Poppins, sans-serif',
    marginBottom: '0',
    textAlign: 'left',
    lineHeight: 1.2,
  },
  heroImage: {
    maxWidth: '140px',
    width: '100%',
    height: 'auto',
    flexShrink: 0,
    display: 'block',
    marginLeft: 'auto',
    borderRadius: '12px',
    background: '#fff',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    background: '#fff',
    borderRadius: '18px',
    boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
    padding: '32px 18px 32px 18px',
    marginTop: '40px',
    marginBottom: '40px',
    minHeight: '400px',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '30px',
    fontWeight: 700,
    fontSize: '2rem',
    fontFamily: 'Poppins, sans-serif',
    color: '#222',
  },
  continueBtn: {
    marginTop: '10px',
    padding: '12px 32px',
    background: '#047857',
    color: 'white',
    border: 'none',
    borderRadius: '999px',
    fontWeight: 600,
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
  card: {
    background: '#fff',
    borderRadius: '14px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '18px',
    flexWrap: 'wrap',
  },
  cardLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    minWidth: '180px',
    flex: 1,
  },
  image: {
    width: '60px',
    height: '60px',
    objectFit: 'contain',
    borderRadius: '10px',
    background: '#e2e8f0',
  },
  productName: {
    fontWeight: 700,
    fontSize: '1.1rem',
    fontFamily: 'Poppins, sans-serif',
    marginBottom: '2px',
    color: '#222',
  },
  productPrice: {
    color: '#10b981',
    fontWeight: 'bold',
    fontSize: '1.1rem',
    marginBottom: '2px',
  },
  cardRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },
  qtyBox: {
    display: 'flex',
    alignItems: 'center',
    background: '#f1f5f9',
    borderRadius: '999px',
    padding: '4px 10px',
    gap: '6px',
  },
  qtyBtn: {
    background: '#047857',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    padding: '6px 16px',
    fontWeight: 700,
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    transition: 'background 0.18s',
  },
  qtyNum: {
    fontWeight: 600,
    fontSize: '1.1rem',
    minWidth: '24px',
    textAlign: 'center',
    fontFamily: 'Poppins, sans-serif',
  },
  lineTotal: {
    fontWeight: 700,
    color: '#222',
    fontSize: '1.1rem',
    minWidth: '80px',
    textAlign: 'right',
  },
  removeBtn: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    padding: '8px 18px',
    fontWeight: 600,
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1rem',
    cursor: 'pointer',
    marginLeft: '8px',
  },
  totalBox: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: '16px',
    borderTop: '2px solid #eee',
    paddingTop: '18px',
    marginBottom: '18px',
  },
  totalLabel: {
    fontWeight: 700,
    fontSize: '1.2rem',
    color: '#222',
    fontFamily: 'Poppins, sans-serif',
  },
  totalValue: {
    fontWeight: 700,
    fontSize: '1.3rem',
    color: '#10b981',
    fontFamily: 'Poppins, sans-serif',
  },
  checkoutBtn: {
    width: '100%',
    background: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    padding: '16px 0',
    fontWeight: 700,
    fontFamily: 'Poppins, sans-serif',
    fontSize: '1.1rem',
    cursor: 'pointer',
    marginTop: '10px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
  },
};

export default Cart;
