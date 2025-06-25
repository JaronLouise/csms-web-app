import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import { getCategories } from '../services/categoryService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import placeholderImage from '../assets/landscape-placeholder-svgrepo-com.svg';

const BACKEND_URL = 'http://localhost:5000/';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  
  const { addToCart } = useCart();
  const { user } = useAuth();

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
        setError('Failed to load products');
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Apply filters whenever filter states change
  useEffect(() => {
    let filtered = [...products];

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category && product.category._id === selectedCategory
      );
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Filter by price range
    if (minPrice) {
      filtered = filtered.filter(product => product.price >= parseFloat(minPrice));
    }
    if (maxPrice) {
      filtered = filtered.filter(product => product.price <= parseFloat(maxPrice));
    }

    // Sort products
    filtered.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'name':
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchTerm, minPrice, maxPrice, sortBy, sortOrder]);

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
    } else {
      addToCart(product);
    }
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSearchTerm('');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('name');
    setSortOrder('asc');
  };

  if (loading) {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 10px', textAlign: 'center' }}>
        <div>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 10px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Product Catalog</h2>
      
      {/* Filter Section */}
      <div style={{
        background: '#f8f9fa',
        padding: '20px',
        borderRadius: '10px',
        marginBottom: '30px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Filters</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '20px'
        }}>
          {/* Search */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Search Products:
            </label>
            <input
              type="text"
              placeholder="Search by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Category Filter */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Category:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Min Price (₱):
            </label>
            <input
              type="number"
              placeholder="Min price"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Max Price (₱):
            </label>
            <input
              type="number"
              placeholder="Max price"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            />
          </div>

          {/* Sort Options */}
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Sort By:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Order:
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px'
              }}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={clearFilters}
          style={{
            background: '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            padding: '8px 16px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          Clear All Filters
        </button>

        {/* Results Count */}
        <div style={{ marginTop: '15px', color: '#666', fontSize: '14px' }}>
          Showing {filteredProducts.length} of {products.length} products
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
          <h3>No products found</h3>
          <p>Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '24px',
        }}>
          {filteredProducts.map((p) => {
            console.log('Product:', p.name, 'Image:', p.images && p.images[0]);
            
            // Handle both old string format and new object format
            let imageUrl = placeholderImage;
            if (p.images && p.images.length > 0) {
              if (typeof p.images[0] === 'string') {
                // Old format: string URL
                imageUrl = BACKEND_URL + p.images[0].replace(/\\/g, '/');
              } else if (p.images[0].url) {
                // New format: Supabase object with url property
                imageUrl = p.images[0].url;
              }
            }
            
            return (
              <div key={p._id} style={{
                background: '#fff',
                borderRadius: '10px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                minHeight: '350px',
              }}>
                <img
                  src={imageUrl}
                  alt={p.name}
                  style={{ width: '200px', height: '150px', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px', background: '#eee' }}
                />
                <h3 style={{ margin: '10px 0 6px 0' }}>{p.name}</h3>
                <div style={{ color: '#007bff', fontWeight: 'bold', marginBottom: '8px' }}>₱{p.price}</div>
                <p style={{ fontSize: '0.98rem', color: '#444', marginBottom: '16px', minHeight: '48px' }}>{p.description || 'No description available.'}</p>
                {user?.role !== 'admin' && (
                  <button
                    onClick={() => handleAddToCart(p)}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      borderRadius: '5px',
                      padding: '10px 24px',
                      fontSize: '1rem',
                      cursor: 'pointer',
                      marginTop: 'auto',
                    }}
                  >
                    Add to Cart
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Products;
