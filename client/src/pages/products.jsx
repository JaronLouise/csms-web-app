import { useEffect, useState } from 'react';
import { getProducts } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import placeholderImage from '../assets/landscape-placeholder-svgrepo-com.svg';

const BACKEND_URL = 'http://localhost:5000/';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .catch((err) => {
        setError('Failed to load products');
        console.error('Failed to load products', err);
      });
  }, []);

  const handleAddToCart = (product) => {
    if (!user) {
      alert('Please log in to add items to your cart.');
    } else {
      addToCart(product);
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '30px 10px' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>Product Catalog</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '24px',
      }}>
        {products.map((p) => {
          console.log('Product:', p.name, 'Image:', p.images && p.images[0]);
          const imageUrl = p.images && p.images.length > 0
            ? BACKEND_URL + p.images[0].replace(/\\/g, '/')
            : placeholderImage;
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
    </div>
  );
};

export default Products;
