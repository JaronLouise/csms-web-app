# React Components Documentation

This document provides a comprehensive overview of all React components in the CSMS web application, including their structure, props, and usage examples.

## 🏗️ Component Architecture

The frontend follows a modular component architecture with clear separation of concerns:

```
src/
├── components/           # Reusable UI components
│   ├── auth/           # Authentication-related components
│   ├── layout/         # Layout and navigation components
│   ├── forms/          # Form components
│   ├── modals/         # Modal and dialog components
│   └── ui/             # Basic UI components
├── pages/              # Page-level components
├── context/            # React Context providers
└── services/           # API service functions
```

## 🧩 Core Components

### 1. Navbar Component

**File**: `src/components/Navbar.jsx`

**Purpose**: Main navigation component with responsive design

**Props**: None (uses context for authentication state)

**Features**:
- Responsive navigation menu
- User authentication status display
- Shopping cart indicator
- Admin panel access
- Mobile hamburger menu

**Usage**:
```jsx
import Navbar from './components/Navbar';

function App() {
  return (
    <div>
      <Navbar />
      {/* Other components */}
    </div>
  );
}
```

**Key Features**:
```jsx
// Authentication state management
const { user, logout } = useContext(AuthContext);
const { cartItems } = useContext(CartContext);

// Responsive menu toggle
const [isMenuOpen, setIsMenuOpen] = useState(false);

// Cart items count
const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
```

### 2. ProtectedRoute Component

**File**: `src/components/ProtectedRoute.jsx`

**Purpose**: Route protection for authenticated users

**Props**:
- `children` (ReactNode): Components to render if authenticated

**Usage**:
```jsx
import ProtectedRoute from './components/ProtectedRoute';

<Route 
  path="/cart" 
  element={
    <ProtectedRoute>
      <Cart />
    </ProtectedRoute>
  } 
/>
```

**Implementation**:
```jsx
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? children : null;
};
```

### 3. AdminRoute Component

**File**: `src/components/AdminRoute.jsx`

**Purpose**: Route protection for admin users with nested routing

**Props**: None (uses Outlet for nested routes)

**Usage**:
```jsx
<Route path="/admin" element={<AdminRoute />}>
  <Route index element={<AdminDashboard />} />
  <Route path="products" element={<AdminProductList />} />
</Route>
```

**Implementation**:
```jsx
const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== 'admin')) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) return <div>Loading...</div>;
  if (!user || user.role !== 'admin') return null;

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
};
```

## 📄 Page Components

### 1. Home Page

**File**: `src/pages/Home.jsx`

**Purpose**: Landing page with hero section and featured content

**Features**:
- Hero section with call-to-action
- Featured products display
- Services overview
- Contact information

**Key Sections**:
```jsx
const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [services, setServices] = useState([]);

  useEffect(() => {
    // Fetch featured products and services
    fetchFeaturedProducts();
    fetchServices();
  }, []);

  return (
    <div className="home">
      <HeroSection />
      <FeaturedProducts products={featuredProducts} />
      <ServicesOverview services={services} />
      <ContactSection />
    </div>
  );
};
```

### 2. Products Page

**File**: `src/pages/products.jsx`

**Purpose**: Product catalog with filtering and search

**Features**:
- Product grid display
- Category filtering
- Search functionality
- Pagination
- Sort options

**State Management**:
```jsx
const [products, setProducts] = useState([]);
const [categories, setCategories] = useState([]);
const [loading, setLoading] = useState(true);
const [filters, setFilters] = useState({
  category: '',
  search: '',
  sort: 'name',
  order: 'asc'
});
const [pagination, setPagination] = useState({
  page: 1,
  limit: 12,
  total: 0
});
```

**Filter Implementation**:
```jsx
const handleFilterChange = (filterType, value) => {
  setFilters(prev => ({
    ...prev,
    [filterType]: value
  }));
  setPagination(prev => ({ ...prev, page: 1 }));
};

const filteredProducts = products.filter(product => {
  const matchesCategory = !filters.category || product.category._id === filters.category;
  const matchesSearch = !filters.search || 
    product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
    product.description.toLowerCase().includes(filters.search.toLowerCase());
  
  return matchesCategory && matchesSearch;
});
```

### 3. Cart Page

**File**: `src/pages/cart.jsx`

**Purpose**: Shopping cart management

**Features**:
- Cart items display
- Quantity updates
- Item removal
- Price calculations
- Checkout integration

**Cart Operations**:
```jsx
const { cartItems, updateQuantity, removeItem, clearCart } = useContext(CartContext);

const handleQuantityChange = async (productId, newQuantity) => {
  if (newQuantity < 1) {
    await removeItem(productId);
  } else {
    await updateQuantity(productId, newQuantity);
  }
};

const handleRemoveItem = async (productId) => {
  await removeItem(productId);
};

const handleClearCart = async () => {
  await clearCart();
};
```

### 4. Checkout Page

**File**: `src/pages/checkout.jsx`

**Purpose**: Order completion and payment processing

**Features**:
- Order summary
- Shipping address form
- Payment method selection
- Order confirmation

**Form Validation**:
```jsx
const [formData, setFormData] = useState({
  shippingAddress: {
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'USA'
  },
  paymentMethod: 'credit_card'
});

const [errors, setErrors] = useState({});

const validateForm = () => {
  const newErrors = {};
  
  if (!formData.shippingAddress.street) {
    newErrors.street = 'Street address is required';
  }
  if (!formData.shippingAddress.city) {
    newErrors.city = 'City is required';
  }
  // ... more validation
  
  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};
```

## 🎨 UI Components

### 1. ProductCard Component

**File**: `src/components/ProductCard.jsx`

**Purpose**: Reusable product display card

**Props**:
- `product` (Object): Product data
- `onAddToCart` (Function): Add to cart handler
- `showAddToCart` (Boolean): Show/hide add to cart button

**Usage**:
```jsx
<ProductCard 
  product={product}
  onAddToCart={handleAddToCart}
  showAddToCart={true}
/>
```

**Implementation**:
```jsx
const ProductCard = ({ product, onAddToCart, showAddToCart = true }) => {
  const { _id, name, description, price, image, stock } = product;
  const [isLoading, setIsLoading] = useState(false);

  const handleAddToCart = async () => {
    setIsLoading(true);
    try {
      await onAddToCart(_id, 1);
      toast.success('Added to cart!');
    } catch (error) {
      toast.error('Failed to add to cart');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="product-card">
      <img src={image} alt={name} className="product-image" />
      <div className="product-info">
        <h3 className="product-name">{name}</h3>
        <p className="product-description">{description}</p>
        <div className="product-price">${price}</div>
        {showAddToCart && (
          <button 
            onClick={handleAddToCart}
            disabled={isLoading || stock === 0}
            className="add-to-cart-btn"
          >
            {isLoading ? 'Adding...' : stock === 0 ? 'Out of Stock' : 'Add to Cart'}
          </button>
        )}
      </div>
    </div>
  );
};
```

### 2. Modal Components

#### ContactModal

**File**: `src/components/ContactModal.jsx`

**Purpose**: Contact form modal

**Props**:
- `isOpen` (Boolean): Modal visibility
- `onClose` (Function): Close modal handler

**Form Fields**:
- Name
- Email
- Subject
- Message

#### QuoteModal

**File**: `src/components/QuoteModal.jsx`

**Purpose**: Service quote request modal

**Props**:
- `isOpen` (Boolean): Modal visibility
- `onClose` (Function): Close modal handler
- `service` (Object): Service data

#### ServiceDetailModal

**File**: `src/components/ServiceDetailModal.jsx`

**Purpose**: Service details display modal

**Props**:
- `isOpen` (Boolean): Modal visibility
- `onClose` (Function): Close modal handler
- `service` (Object): Service data

### 3. Form Components

#### LoginForm

**File**: `src/components/auth/LoginForm.jsx`

**Purpose**: User authentication form

**Features**:
- Email and password fields
- Form validation
- Error handling
- Loading states

**Implementation**:
```jsx
const LoginForm = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (error) {
      setErrors({ general: error.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <input
          type="email"
          id="email"
          value={formData.email}
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          value={formData.password}
          onChange={(e) => setFormData({...formData, password: e.target.value})}
          required
        />
      </div>
      {errors.general && <div className="error">{errors.general}</div>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
};
```

## 🔄 Context Providers

### 1. AuthContext

**File**: `src/context/AuthContext.jsx`

**Purpose**: Global authentication state management

**State**:
```jsx
const [user, setUser] = useState(null);
const [loading, setLoading] = useState(true);
const [token, setToken] = useState(localStorage.getItem('token'));
```

**Methods**:
- `login(email, password)` - User authentication
- `register(userData)` - User registration
- `logout()` - User logout
- `updateProfile(userData)` - Profile updates
- `checkAuth()` - Verify authentication status

**Usage**:
```jsx
const { user, login, logout, loading } = useContext(AuthContext);
```

### 2. CartContext

**File**: `src/context/CartContext.jsx`

**Purpose**: Global shopping cart state management

**State**:
```jsx
const [cartItems, setCartItems] = useState([]);
const [loading, setLoading] = useState(false);
```

**Methods**:
- `addItem(productId, quantity)` - Add item to cart
- `removeItem(productId)` - Remove item from cart
- `updateQuantity(productId, quantity)` - Update item quantity
- `clearCart()` - Clear all items
- `getCart()` - Fetch cart from server

**Usage**:
```jsx
const { cartItems, addItem, removeItem, updateQuantity } = useContext(CartContext);
```

## 🎯 Component Best Practices

### 1. Props Validation
```jsx
import PropTypes from 'prop-types';

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    stock: PropTypes.number.isRequired
  }).isRequired,
  onAddToCart: PropTypes.func.isRequired,
  showAddToCart: PropTypes.bool
};

ProductCard.defaultProps = {
  showAddToCart: true
};
```

### 2. Error Boundaries
```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}
```

### 3. Loading States
```jsx
const LoadingSpinner = ({ size = 'medium' }) => (
  <div className={`loading-spinner ${size}`}>
    <div className="spinner"></div>
  </div>
);

// Usage in components
{loading ? <LoadingSpinner /> : <ComponentContent />}
```

### 4. Conditional Rendering
```jsx
// Using logical AND
{user && <UserProfile />}

// Using ternary operator
{isLoading ? <LoadingSpinner /> : <ComponentContent />}

// Using conditional rendering with multiple conditions
{user ? (
  user.role === 'admin' ? <AdminPanel /> : <UserDashboard />
) : (
  <LoginPrompt />
)}
```

## 🎨 Styling Guidelines

### 1. CSS Classes
- Use BEM methodology for class naming
- Keep classes semantic and descriptive
- Use utility classes for common patterns

### 2. Responsive Design
```jsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {products.map(product => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>
```

### 3. Component Styling
```jsx
// Component-specific styles
const ProductCard = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 1rem;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
`;
```

## 🔧 Component Testing

### 1. Unit Testing
```jsx
import { render, screen, fireEvent } from '@testing-library/react';
import ProductCard from './ProductCard';

test('renders product information', () => {
  const product = {
    _id: '1',
    name: 'Test Product',
    price: 99.99,
    image: 'test.jpg'
  };

  render(<ProductCard product={product} />);
  
  expect(screen.getByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText('$99.99')).toBeInTheDocument();
});
```

### 2. Integration Testing
```jsx
test('adds product to cart when button is clicked', async () => {
  const mockAddToCart = jest.fn();
  const product = { _id: '1', name: 'Test Product' };

  render(
    <CartProvider>
      <ProductCard product={product} onAddToCart={mockAddToCart} />
    </CartProvider>
  );

  fireEvent.click(screen.getByText('Add to Cart'));
  
  expect(mockAddToCart).toHaveBeenCalledWith('1', 1);
});
```

---

**Components Version**: 1.0  
**Last Updated**: December 2024 