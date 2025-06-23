import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { getCartItemCount } = useCart();
  const cartItemCount = getCartItemCount();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
        </li>
        <li>
          <Link to="/services">Services</Link>
        </li>
        <li>
          <Link to="/contact">Contact</Link>
        </li>
        {user ? (
          <>
            <li>
              <span>Hello, {user.name}</span>
            </li>
            {user.role === 'admin' ? (
              <li>
                <Link to="/admin">Admin Dashboard</Link>
              </li>
            ) : (
              <li>
                <Link to="/cart">
                  Cart {cartItemCount > 0 && `(${cartItemCount})`}
                </Link>
              </li>
            )}
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button onClick={logout}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
            <li>
              <Link to="/cart">
                Cart {cartItemCount > 0 && `(${cartItemCount})`}
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar; 