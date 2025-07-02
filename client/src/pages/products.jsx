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
        .flash-slide {
          border: none;
          display: inline-block;
          color: #222;
          border-radius: 32px;
          position: relative;
          overflow: hidden;
          text-decoration: none;
          font-family: 'Poppins', sans-serif;
          font-size: 20px;
          font-weight: 600;
          letter-spacing: 0.5px;
          text-align: center;
          box-shadow: 0 4px 20px rgba(40,167,69,0.13);
          transition: box-shadow 0.3s, transform 0.3s;
          background: linear-gradient(90deg, #e8fbe8 0%, #28a745 100%);
          cursor: pointer;
          padding: 18px 52px;
        }
        .flash-slide--green {
          background: linear-gradient(90deg, #e8fbe8 0%, #28a745 100%);
        }
        
        .flash-slide:hover {
          transform: scale(1.08);
          box-shadow: 0 8px 32px rgba(40,167,69,0.25);
        }

        .flash-slide::before {
          content: "";
          position: absolute;
          top: 0;
          left: -75%;
          width: 50%;
          height: 100%;
          background: rgba(255, 255, 255, 0.3);
          transform: skewX(-20deg);
          transition: left 0.5s;
        }

        .flash-slide:hover::before {
          left: 125%;
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
        .product-card {
          transition: box-shadow 0.3s cubic-bezier(.4,0,.2,1), transform 0.3s cubic-bezier(.4,0,.2,1), opacity 0.5s, top 0.5s;
          box-shadow: 0 2px 12px rgba(40,167,69,0.08);
          position: relative;
          opacity: 0;
          top: 24px;
          animation: fadeInUp 0.6s cubic-bezier(.4,0,.2,1) forwards;
        }
        .product-card:hover {
          box-shadow: 0 8px 32px rgba(40,167,69,0.18);
          transform: translateY(-8px) scale(1.02);
          z-index: 2;
        }
        .product-card .product-img {
          transition: transform 0.3s cubic-bezier(.4,0,.2,1);
        }
        .product-card:hover .product-img {
          transform: scale(1.06);
        }
        @keyframes fadeInUp {
          0% { opacity: 0; top: 24px; }
          100% { opacity: 1; top: 0; }
        }
      `}</style>
      <div style={styles.bgGreen}>
        <div style={{ ...styles.sectionContainer }}>
          <div style={{ width: '100%', maxWidth: 1400, margin: '0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1rem' }}>
            <div style={{ position: 'relative', width: '100%' }}>
              <span className="material-symbols-outlined" style={{ position: 'absolute', left: 20, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: '1.5rem', pointerEvents: 'none' }}>search</span>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.9rem 1.5rem 0.9rem 3rem',
                  borderRadius: '32px',
                  border: '1.5px solid #ddd',
                  fontSize: '1.1rem',
                  fontFamily: 'Poppins, sans-serif',
                  outline: 'none',
                  background: '#fff',
                  color: '#222',
                  boxShadow: '0 2px 12px rgba(40,167,69,0.06)',
                  transition: 'border 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => e.target.style.border = '1.5px solid #28a745'}
                onBlur={e => e.target.style.border = '1.5px solid #ddd'}
              />
            </div>
          </div>
          <div style={styles.heroCardWide}>
            <div className="hero-text" style={styles.heroText}>
              <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: 0, display: 'flex', flexDirection: 'column', color: '#000' }}>
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
            <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} style={{ 
              padding: '0.75rem 2.5rem 0.75rem 1.5rem',
              borderRadius: '12px',
              border: '1px solid #ddd',
              fontSize: '1rem',
              fontFamily: 'Poppins, sans-serif',
              background: '#fff',
              color: '#333',
              cursor: 'pointer',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
              backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%23333\" height=\"20\" viewBox=\"0 0 24 24\" width=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 1rem center',
              backgroundSize: '1.2rem',
              minWidth: '100px',
            }}>
              <option value=''>All Categories</option>
              {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
            </select>
            <button 
              onClick={() => setShowAdvanced(!showAdvanced)} 
              style={{ 
                padding: '1rem', 
                background: '#000',
                color: '#fff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Poppins, sans-serif',
                transition: 'all 0.3s ease',
                width: '48px',
                height: '48px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#333';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#000';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '1.8rem', color: '#fff' }}>tune</span>
            </button>
          </div>

          {showAdvanced && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
              <input 
                type="number" 
                placeholder="Min Price" 
                value={minPrice} 
                onChange={e => setMinPrice(e.target.value)} 
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: '12px', 
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  fontFamily: 'Poppins, sans-serif',
                  background: '#fff',
                  color: '#333',
                  minWidth: '120px'
                }} 
              />
              <input 
                type="number" 
                placeholder="Max Price" 
                value={maxPrice} 
                onChange={e => setMaxPrice(e.target.value)} 
                style={{ 
                  padding: '0.75rem 1rem', 
                  borderRadius: '12px', 
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  fontFamily: 'Poppins, sans-serif',
                  background: '#fff',
                  color: '#333',
                  minWidth: '120px'
                }} 
              />
              <select 
                value={sortBy} 
                onChange={e => setSortBy(e.target.value)} 
                style={{ 
                  padding: '0.75rem 2.5rem 0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  fontFamily: 'Poppins, sans-serif',
                  background: '#fff',
                  color: '#333',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%23333\" height=\"20\" viewBox=\"0 0 24 24\" width=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.2rem',
                  minWidth: '140px',
                  width: '160px',
                }}
              >
                <option value="name">Name</option>
                <option value="price">Price</option>
              </select>
              <select 
                value={sortOrder} 
                onChange={e => setSortOrder(e.target.value)} 
                style={{ 
                  padding: '0.75rem 2.5rem 0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: '1px solid #ddd',
                  fontSize: '1rem',
                  fontFamily: 'Poppins, sans-serif',
                  background: '#fff',
                  color: '#333',
                  cursor: 'pointer',
                  appearance: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none',
                  backgroundImage: "url('data:image/svg+xml;utf8,<svg fill=\"%23333\" height=\"20\" viewBox=\"0 0 24 24\" width=\"20\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')",
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 1rem center',
                  backgroundSize: '1.2rem',
                  minWidth: '140px',
                  width: '160px',
                }}
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          )}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center' }}>
            {filteredProducts.map(product => (
              <div key={product._id} className="product-card" style={{ background: '#fff', borderRadius: '16px', padding: '1rem', width: '100%', maxWidth: '300px', flex: '1 1 260px', boxSizing: 'border-box', textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: '370px' }}>
                <img src={getProductImage(product)} alt={product.name} className="product-img" style={{ width: '100%', maxHeight: '150px', objectFit: 'contain', borderRadius: '10px', backgroundColor: '#e2e8f0' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0.5rem 0' }}>{product.name}</h3>
                <p style={{ color: '#10b981', fontWeight: 'bold', margin: '0.25rem 0' }}>₱{product.price.toLocaleString()}</p>
                <p style={{ fontSize: '0.875rem', color: '#555' }}>{product.description || 'No description available.'}</p>
                {user?.role !== 'admin' && (
                  <button 
                    onClick={() => handleAddToCart(product)} 
                    style={{ 
                      marginTop: 'auto', 
                      width: '100%',
                      fontSize: '1rem',
                      fontWeight: '600',
                      padding: '0.75rem 1.5rem',
                      background: '#000',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '32px',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 20px rgba(40,167,69,0.13)'
                    }}
                    onMouseEnter={e => {
                      e.target.style.background = '#222';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={e => {
                      e.target.style.background = '#000';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
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
