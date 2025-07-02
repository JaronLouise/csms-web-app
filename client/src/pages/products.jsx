import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import placeholderImage from '../assets/solar.png';

const BACKEND_URL = 'http://localhost:5000/';

const styles = {
  bgGreen: {
    background: 'linear-gradient(180deg, #b2f0e6 0%, #d0f7c6 70%)',
    paddingTop: '12px',
    paddingBottom: '12px',
    fontFamily: 'Poppins, sans-serif',
    minHeight: '100vh',
    width: '100vw',
    boxSizing: 'border-box',
    overflowX: 'hidden',
  },
  sectionContainer: {
    width: '100%',
    maxWidth: 1400,
    marginLeft: 'auto',
    marginRight: 'auto',
    paddingLeft: '16px',
    paddingRight: '16px',
    boxSizing: 'border-box',
  },
  heroCardWide: {
    background: '#fff',
    boxShadow: '0 6px 32px rgba(0,0,0,0.10)',
    borderRadius: '1.25rem',
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3rem 2rem',
    minHeight: '200px',
    transition: 'box-shadow 0.2s',
    gap: '1rem',
  },
  heroText: {
    flex: 1,
    minWidth: 200,
    textAlign: 'left',
  },
  heroImgContainer: {
    maxWidth: 300,
    width: '100%',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
};

const Product = () => {
  const { addToCart, cart } = useCart();
  const { user } = useAuth();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [productsData, categoriesData] = await Promise.all([
          getProducts(),
          getCategories()
        ]);
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(product =>
        product.category && (product.category._id === selectedCategory || product.category === selectedCategory)
      );
    }

    if (search) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    if (minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
    }

    filtered.sort((a, b) => {
      const aValue = sortBy === 'price' ? a.price : a.name.toLowerCase();
      const bValue = sortBy === 'price' ? b.price : b.name.toLowerCase();
      return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, search, minPrice, maxPrice, sortBy, sortOrder]);

  const handleAddToCart = (product) => {
    if (!user) return alert('Please log in to add items to your cart.');
    addToCart(product);
  };

  const getProductImage = (product) => {
    if (product.images?.length > 0) {
      const img = product.images[0];
      if (typeof img === 'string') return BACKEND_URL + img.replace(/\\/g, '/');
      if (img.url) return img.url;
    }
    return product.image || placeholderImage;
  };

  const getProductQuantity = (productId) => {
    const item = cart.items.find(i => i.productId === productId || i._id === productId);
    return item ? item.quantity : 0;
  };

  if (loading) return <div style={{ textAlign: 'center', padding: '40px' }}>Loading products...</div>;
  if (error) return <div style={{ textAlign: 'center', padding: '40px' }}>Error: {error}</div>;

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
          font-family: 'Poppins', sans-serif;
        }
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
        }
        #root {
          width: 100%;
        }
        @media (max-width: 768px) {
          .filters-wrapper {
            flex-direction: column;
            align-items: stretch;
          }
          .product-card {
            flex: 1 1 100%;
            max-width: 100%;
          }
          .hero-img {
            justify-content: center !important;
          }
          .hero-text {
            text-align: center !important;
          }
        }
      `}</style>
      <div style={styles.bgGreen}>
        <div style={{ ...styles.sectionContainer }}>
          <div style={styles.heroCardWide}>
            <div className="hero-text" style={styles.heroText}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, display: 'flex', flexDirection: 'column' }}>
                <span style={{ display: 'block', marginBottom: 18 }}>Browse our Products</span>
                <span style={{ display: 'block' }}>for your Sustainable Needs</span>
              </h1>
            </div>
            <div className="hero-img" style={styles.heroImgContainer}>
              <img src={placeholderImage} alt="Solar Panels" style={{ width: '100%', maxWidth: 280, maxHeight: 180, height: 'auto', objectFit: 'contain' }} />
            </div>
          </div>
        </div>

        <div style={{ ...styles.sectionContainer, paddingTop: '1rem', paddingBottom: '2rem' }}>
          <div className="filters-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px' }}>
              <option value=''>All Categories</option>
              {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
            <button onClick={() => setShowAdvanced(!showAdvanced)} style={{ padding: '0.5rem 1rem', borderRadius: '8px' }}>Filters</button>
          </div>

          {showAdvanced && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
              <input type="text" placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px' }} />
              <input type="number" placeholder="Min Price" value={minPrice} onChange={e => setMinPrice(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px' }} />
              <input type="number" placeholder="Max Price" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px' }} />
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px' }}>
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
              <select value={sortOrder} onChange={e => setSortOrder(e.target.value)} style={{ padding: '0.5rem', borderRadius: '8px' }}>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {filteredProducts.map(product => (
              <div key={product._id} className="product-card" style={{ background: '#fff', borderRadius: '16px', padding: '1rem', width: '100%', maxWidth: '300px', flex: '1 1 260px', boxSizing: 'border-box', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '370px' }}>
                <img src={getProductImage(product)} alt={product.name} style={{ width: '100%', maxHeight: '150px', objectFit: 'contain', borderRadius: '10px', backgroundColor: '#e2e8f0' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0.5rem 0' }}>{product.name}</h3>
                <p style={{ color: '#10b981', fontWeight: 'bold', margin: '0.25rem 0' }}>₱{product.price.toLocaleString()}</p>
                <p style={{ fontSize: '0.875rem', color: '#555' }}>{product.description || 'No description available.'}</p>
                {user?.role !== 'admin' && (
                  <button onClick={() => handleAddToCart(product)} style={{ marginTop: 'auto', background: '#000', color: '#fff', padding: '0.5rem', borderRadius: '999px', width: '100%' }}>
                    Add to Cart{getProductQuantity(product._id) > 0 ? ` (${getProductQuantity(product._id)})` : ''}
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Product;
