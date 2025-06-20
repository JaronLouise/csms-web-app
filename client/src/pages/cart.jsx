import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cart, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div>
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <>
          <ul>
            {cart.map(item => (
              <li key={item._id}>
                {item.name} x {item.quantity} - ₱{item.price * item.quantity}
                <button onClick={() => removeFromCart(item._id)}>Remove</button>
              </li>
            ))}
          </ul>
          <div>
            <strong>Total: ₱{total}</strong>
          </div>
          <button onClick={() => navigate('/checkout')}>Proceed to Checkout</button>
        </>
      )}
    </div>
  );
};

export default Cart;
