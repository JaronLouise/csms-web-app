import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

if (typeof document !== 'undefined' && !document.getElementById('cart-hover-effects')) {
  const style = document.createElement('style');
  style.id = 'cart-hover-effects';
  style.textContent = `
    .cart-item-hover {
      transition: box-shadow 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1);
    }
    .cart-item-hover:hover {
      box-shadow: 0 8px 32px rgba(40,167,69,0.13);
      transform: translateY(-6px) scale(1.01);
      z-index: 2;
    }
    .cart-remove-btn {
      transition: background 0.2s, color 0.2s, transform 0.2s;
    }
    .cart-remove-btn:hover {
      background: #dc3545 !important;
      color: #fff !important;
      transform: scale(1.1);
    }
    .cart-qty-btn {
      transition: background 0.2s, color 0.2s, transform 0.2s;
    }
    .cart-qty-btn:hover:not(:disabled) {
      background: #28a745 !important;
      color: #fff !important;
      transform: scale(1.1);
    }
    .cart-checkout-btn {
      transition: background 0.2s, color 0.2s, transform 0.2s;
    }
    .cart-checkout-btn:hover {
      background: #28a745 !important;
      color: #fff !important;
      transform: translateY(-2px) scale(1.03);
    }
    .cart-empty-btn {
      transition: background 0.2s, color 0.2s, transform 0.2s;
    }
    .cart-empty-btn:hover {
      background: #28a745 !important;
      color: #fff !important;
      transform: translateY(-2px) scale(1.03);
    }
  `;
  document.head.appendChild(style);
}

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
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Shopping Cart</h1>
        <p style={styles.subtitle}>Review your items and proceed to checkout</p>
      </div>

      {cart.items.length === 0 ? (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon} className="material-symbols-outlined">shopping_cart</span>
          <h2 style={styles.emptyTitle}>Your cart is empty</h2>
          <p style={styles.emptyText}>Add some products to your cart to get started.</p>
          <button 
            onClick={() => navigate('/products')}
            style={styles.emptyButton}
            className="cart-empty-btn"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div style={styles.cartContent}>
          {/* Cart Items */}
          <div style={styles.itemsList}>
            {cart.items.map((item, idx) => (
              <div key={item._id} style={styles.cartItem} className="cart-item-hover">
                {/* Product Image */}
                <div style={styles.itemImage}>
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={styles.image}
                    />
                  ) : (
                    <div style={styles.placeholderImage}>
                      <span style={styles.placeholderIcon} className="material-symbols-outlined">inventory_2</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div style={styles.itemInfo}>
                  <h3 style={styles.itemName}>{item.name}</h3>
                  <p style={styles.itemPrice}>₱{item.price.toLocaleString()}</p>
                </div>

                {/* Quantity Controls */}
                <div style={styles.quantityControls}>
                  <button 
                    onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                    disabled={item.quantity <= 1}
                    style={item.quantity <= 1 ? styles.quantityBtnDisabled : styles.quantityBtn}
                    className="cart-qty-btn"
                  >
                    -
                  </button>
                  <span style={styles.quantityDisplay}>{item.quantity}</span>
                  <button 
                    onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                    style={styles.quantityBtn}
                    className="cart-qty-btn"
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div style={styles.itemSubtotal}>
                  ₱{(item.price * item.quantity).toLocaleString()}
                </div>

                {/* Remove Button */}
                <button 
                  onClick={() => handleRemoveItem(item.product)}
                  style={styles.removeButton}
                  title="Remove item"
                  className="cart-remove-btn"
                >
                  <span style={styles.removeIcon} className="material-symbols-outlined">delete</span>
                </button>
              </div>
            ))}
          </div>

          {/* Cart Summary */}
          <div style={styles.cartSummary}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Total ({cart.items.length} items)</span>
              <span style={styles.summaryTotal}>₱{getCartTotal().toLocaleString()}</span>
            </div>
            
            <button 
              onClick={() => navigate('/checkout')}
              style={styles.checkoutButton}
              className="cart-checkout-btn"
            >
              <span style={styles.checkoutIcon} className="material-symbols-outlined">shopping_cart_checkout</span>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
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
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #28a745',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  loadingText: {
    color: '#6c757d',
    fontSize: '1.1rem'
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
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  cartContent: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  itemsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
  },
  cartItem: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    display: 'grid',
    gridTemplateColumns: 'auto 1fr auto auto auto',
    gap: '1rem',
    alignItems: 'center'
  },
  itemImage: {
    width: '80px',
    height: '80px',
    borderRadius: '12px',
    overflow: 'hidden',
    background: '#f8f9fa'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9fa'
  },
  placeholderIcon: {
    fontSize: '2rem',
    color: '#6c757d'
  },
  itemInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  itemName: {
    fontSize: '1.1rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: 0
  },
  itemPrice: {
    fontSize: '1rem',
    color: '#6c757d',
    margin: 0
  },
  quantityControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
    background: '#f8f9fa',
    borderRadius: '8px',
    padding: '0.25rem'
  },
  quantityBtn: {
    background: '#28a745',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  quantityBtnDisabled: {
    background: '#6c757d',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    padding: '0.5rem 0.75rem',
    fontWeight: '600',
    fontSize: '1rem',
    cursor: 'not-allowed'
  },
  quantityDisplay: {
    padding: '0.5rem 0.75rem',
    fontWeight: '600',
    fontSize: '1rem',
    color: '#2c3e50',
    minWidth: '2rem',
    textAlign: 'center'
  },
  itemSubtotal: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#28a745',
    textAlign: 'right'
  },
  removeButton: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.5rem',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  removeIcon: {
    fontSize: '1.2rem'
  },
  cartSummary: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #e9ecef'
  },
  summaryLabel: {
    fontSize: '1.2rem',
    fontWeight: '600',
    color: '#2c3e50'
  },
  summaryTotal: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#28a745'
  },
  checkoutButton: {
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
  checkoutIcon: {
    fontSize: '1.2rem'
  }
};

// Add CSS animation for loading spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .cart-quantity-btn:hover {
    background: #218838 !important;
  }
  
  .cart-remove-btn:hover {
    background: #c82333 !important;
  }
  
  .cart-checkout-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.2);
  }
`;
document.head.appendChild(styleSheet);

export default Cart; 