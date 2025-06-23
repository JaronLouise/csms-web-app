import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Welcome to the admin dashboard. From here you can manage products, orders, and users.</p>
      <ul>
        <li>
          <Link to="products">Manage Products</Link>
        </li>
        <li>
          <Link to="orders">Manage Orders</Link>
        </li>
        <li>
          <Link to="users">Manage Users</Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminDashboard; 