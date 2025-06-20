import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/products">Products</Link>
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
              <>
                <li>
                  <Link to="/cart">Cart</Link>
                </li>
                <li>
                  <Link to="/orders">Orders</Link>
                </li>
              </>
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
              <Link to="/cart">Cart</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar; 