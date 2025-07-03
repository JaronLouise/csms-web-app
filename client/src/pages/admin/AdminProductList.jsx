import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllProducts, deleteProduct } from '../../services/adminService';

const AdminProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await deleteProduct(productId);
        // Refresh list after delete
        fetchProducts();
      } catch (err) {
        setError('Failed to delete product.');
      }
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainer}>
          <span style={styles.errorIcon} className="material-symbols-outlined">warning</span>
          <p style={styles.errorText}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Product Management</h1>
          <p style={styles.subtitle}>Manage your product catalog and inventory</p>
        </div>
        <Link to="new" style={styles.addButton}>
          <span style={styles.addIcon} className="material-symbols-outlined">add</span>
          Add New Product
        </Link>
      </div>

      {/* Products Grid */}
      <div style={styles.productsGrid}>
        {products.map(product => (
          <div key={product._id} style={styles.productCard}>
            <div style={styles.productImage}>
              {product.images && product.images.length > 0 ? (
                <img 
                  src={product.images[0]} 
                  alt={product.name}
                  style={styles.image}
                />
              ) : (
                <div style={styles.placeholderImage}>
                  <span style={styles.placeholderIcon} className="material-symbols-outlined">inventory_2</span>
                </div>
              )}
            </div>
            
            <div style={styles.productInfo}>
              <h3 style={styles.productName}>{product.name}</h3>
              <p style={styles.productCategory}>
                {product.category?.name || 'No Category'}
              </p>
              
              <div style={styles.productStats}>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Price:</span>
                  <span style={styles.statValue}>₱{product.price?.toLocaleString()}</span>
                </div>
                <div style={styles.stat}>
                  <span style={styles.statLabel}>Stock:</span>
                  <span style={{
                    ...styles.statValue,
                    color: product.stock > 10 ? '#28a745' : product.stock > 0 ? '#ffc107' : '#dc3545'
                  }}>
                    {product.stock} units
                  </span>
                </div>
              </div>
            </div>

            <div style={styles.productActions}>
              <Link 
                to={`/admin/products/edit/${product._id}`} 
                style={styles.editButton}
              >
                <span style={styles.actionIcon} className="material-symbols-outlined">edit</span>
                Edit
              </Link>
              <button 
                onClick={() => handleDelete(product._id)} 
                style={styles.deleteButton}
              >
                <span style={styles.actionIcon} className="material-symbols-outlined">delete</span>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {products.length === 0 && (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon} className="material-symbols-outlined">inventory_2</span>
          <h3 style={styles.emptyTitle}>No Products Yet</h3>
          <p style={styles.emptyText}>Get started by adding your first product to the catalog.</p>
          <Link to="new" style={styles.emptyButton}>
            Add Your First Product
          </Link>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
    padding: '2rem',
    fontFamily: 'Poppins, sans-serif'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  headerContent: {
    flex: 1
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '0.5rem',
    letterSpacing: '-1px'
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#6c757d',
    margin: 0
  },
  addButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    background: '#28a745',
    color: 'white',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)'
  },
  addIcon: {
    fontSize: '1.2rem',
    marginRight: '0.5rem'
  },
  productsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem'
  },
  productCard: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  productImage: {
    height: '200px',
    overflow: 'hidden',
    background: '#f8f9fa'
  },
  image: {
    width: '100%',
    height: '100%',
    objectFit: 'cover'
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f8f9fa'
  },
  placeholderIcon: {
    fontSize: '3rem',
    color: '#6c757d'
  },
  productInfo: {
    padding: '1.5rem'
  },
  productName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 0.5rem 0',
    lineHeight: '1.3'
  },
  productCategory: {
    fontSize: '0.9rem',
    color: '#6c757d',
    margin: '0 0 1rem 0',
    padding: '0.25rem 0.75rem',
    background: '#f8f9fa',
    borderRadius: '20px',
    display: 'inline-block'
  },
  productStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  stat: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#6c757d',
    fontWeight: '500'
  },
  statValue: {
    fontSize: '1rem',
    fontWeight: '600',
    color: '#2c3e50'
  },
  productActions: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0 1.5rem 1.5rem 1.5rem'
  },
  editButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem',
    background: '#007bff',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  deleteButton: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem',
    background: '#dc3545',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  actionIcon: {
    fontSize: '1rem',
    marginRight: '0.5rem'
  },
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    display: 'block',
    color: '#6c757d'
  },
  emptyTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '0.5rem'
  },
  emptyText: {
    fontSize: '1rem',
    color: '#6c757d',
    marginBottom: '2rem'
  },
  emptyButton: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '0.75rem 1.5rem',
    background: '#28a745',
    color: 'white',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh'
  },
  loadingSpinner: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #28a745',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  loadingText: {
    color: '#6c757d',
    fontSize: '1.1rem'
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
  },
  errorIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    color: '#dc3545'
  },
  errorText: {
    color: '#dc3545',
    fontSize: '1.1rem',
    textAlign: 'center'
  }
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .admin-product-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  }
  
  .admin-add-button:hover {
    background: #218838;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
  }
  
  .admin-edit-button:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }
  
  .admin-delete-button:hover {
    background: #c82333;
    transform: translateY(-1px);
  }
`;
document.head.appendChild(styleSheet);

export default AdminProductList; 