import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, loading, getCartTotal } = useCart();
  const navigate = useNavigate();

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    
    // Handle both string and object product references
    const actualProductId = typeof productId === 'object' ? productId._id : productId;
    console.log('Updating quantity for product:', actualProductId, 'to:', newQuantity);
    
    updateQuantity(actualProductId, newQuantity);
  };

  const handleRemoveItem = (productId) => {
    // Handle both string and object product references
    const actualProductId = typeof productId === 'object' ? productId._id : productId;
    console.log('Removing product:', actualProductId);
    
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
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Shopping Cart</h2>
      
      {cart.items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <p style={{ fontSize: '1.2rem', color: '#666' }}>Your cart is empty</p>
          <button 
            onClick={() => navigate('/products')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div style={{ marginBottom: '20px' }}>
            {cart.items.map(item => (
              <div 
                key={item._id} 
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '15px',
                  marginBottom: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                  {item.image && (
                    <img 
                      src={item.image} 
                      alt={item.name}
                      style={{ width: '60px', height: '60px', objectFit: 'cover', marginRight: '15px' }}
                    />
                  )}
                  <div>
                    <h3 style={{ margin: '0 0 5px 0' }}>{item.name}</h3>
                    <p style={{ margin: '0', color: '#666' }}>₱{item.price}</p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <button 
                      onClick={() => handleQuantityChange(item.product, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      style={{
                        padding: '5px 10px',
                        background: item.quantity <= 1 ? '#ccc' : '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: item.quantity <= 1 ? 'not-allowed' : 'pointer'
                      }}
                    >
                      -
                    </button>
                    <span style={{ padding: '0 10px' }}>{item.quantity}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.product, item.quantity + 1)}
                      style={{
                        padding: '5px 10px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      +
                    </button>
                  </div>
                  
                  <div style={{ textAlign: 'right', minWidth: '100px' }}>
                    <p style={{ margin: '0', fontWeight: 'bold' }}>
                      ₱{item.price * item.quantity}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => handleRemoveItem(item.product)}
                    style={{
                      padding: '5px 10px',
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{
            borderTop: '2px solid #ddd',
            paddingTop: '20px',
            textAlign: 'right'
          }}>
            <h3 style={{ margin: '0 0 10px 0' }}>
              Total: ₱{getCartTotal().toLocaleString()}
            </h3>
            <button 
              onClick={() => navigate('/checkout')}
              style={{
                padding: '12px 30px',
                background: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '1.1rem',
                cursor: 'pointer'
              }}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
