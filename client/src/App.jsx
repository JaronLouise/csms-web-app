import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './pages/products';
import Login from './pages/login';
import Cart from "./pages/cart";
import Register from './pages/register';
import Checkout from './pages/checkout';
import Orders from './pages/orders';
import Profile from './pages/profile';
import Services from './pages/services';
import Contact from './pages/contact';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductList from './pages/admin/AdminProductList';
import AdminProductForm from './pages/admin/AdminProductForm';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminUserList from './pages/admin/AdminUserList';
import AdminUserForm from './pages/admin/AdminUserForm';
import AdminServiceList from './pages/admin/AdminServiceList';
import AdminServiceForm from './pages/admin/AdminServiceForm';
import AdminRoute from './components/AdminRoute';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import './App.css';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <div>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
              <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminRoute />}>
                <Route index element={<AdminDashboard />} />
                <Route path="products" element={<AdminProductList />} />
                <Route path="products/new" element={<AdminProductForm />} />
                <Route path="products/edit/:id" element={<AdminProductForm />} />
                <Route path="orders" element={<AdminOrderList />} />
                <Route path="users" element={<AdminUserList />} />
                <Route path="users/edit/:id" element={<AdminUserForm />} />
                <Route path="services" element={<AdminServiceList />} />
                <Route path="services/new" element={<AdminServiceForm />} />
                <Route path="services/edit/:id" element={<AdminServiceForm />} />
              </Route>
            </Routes>
          </div>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
