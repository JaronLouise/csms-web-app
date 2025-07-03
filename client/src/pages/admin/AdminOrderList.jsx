import { useEffect, useState } from 'react';
import { getAllOrders, updateOrderStatus } from '../../services/adminService';

const AdminOrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      setError(null); // Clear previous errors on success
      fetchOrders();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update order status.');
      console.error(err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return '#ffc107';
      case 'processing': return '#17a2b8';
      case 'ready_for_pickup': return '#28a745';
      case 'completed': return '#28a745';
      case 'cancelled': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'schedule';
      case 'processing': return 'settings';
      case 'ready_for_pickup': return 'local_shipping';
      case 'completed': return 'check_circle';
      case 'cancelled': return 'cancel';
      default: return 'receipt_long';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading orders...</p>
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
      <div style={styles.headerCentered}>
        <h1 style={styles.title}>{'Order Management'}</h1>
        <p style={styles.subtitle}>{'Track and manage customer orders'}</p>
      </div>
      {/* Stats Card - upper right above orders grid */}
      <div style={styles.statsRight}>
        <div style={styles.statCard}>
          <span style={styles.statNumber}>{orders.length}</span>
          <span style={styles.statLabel}>Total Orders</span>
        </div>
      </div>
      {/* Orders Grid */}
      <div style={styles.ordersGrid}>
        {orders.map(order => (
          <div key={order._id} style={styles.orderCard}>
            <div style={styles.orderHeader}>
              <div style={styles.orderId}>
                <span style={styles.orderIdLabel}>Order #</span>
                <span style={styles.orderIdValue}>{order._id.slice(-6)}</span>
              </div>
              <div style={{
                ...styles.statusBadge,
                backgroundColor: getStatusColor(order.status)
              }}>
                <span style={styles.statusIcon} className="material-symbols-outlined">
                  {getStatusIcon(order.status)}
                </span>
                <span style={styles.statusText}>
                  {order.status.replace('_', ' ').toUpperCase()}
                </span>
              </div>
            </div>

            <div style={styles.orderInfo}>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Customer:</span>
                <span style={styles.infoValue}>{order.user?.name || 'N/A'}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Date:</span>
                <span style={styles.infoValue}>{formatDate(order.createdAt)}</span>
              </div>
              <div style={styles.infoRow}>
                <span style={styles.infoLabel}>Total:</span>
                <span style={styles.totalAmount}>₱{order.totalAmount?.toLocaleString()}</span>
              </div>
            </div>

            <div style={styles.orderItems}>
              <span style={styles.itemsLabel}>Items:</span>
              <div style={styles.itemsList}>
                {order.items?.slice(0, 3).map((item, index) => (
                  <span key={index} style={styles.item}>
                    {item.product?.name || 'Unknown Product'} x{item.quantity}
                  </span>
                ))}
                {order.items?.length > 3 && (
                  <span style={styles.moreItems}>+{order.items.length - 3} more</span>
                )}
              </div>
            </div>

            <div style={styles.orderActions}>
              <select 
                value={order.status} 
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                style={styles.statusSelect}
              >
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="ready_for_pickup">Ready for Pickup</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon} className="material-symbols-outlined">receipt_long</span>
          <h3 style={styles.emptyTitle}>No Orders Yet</h3>
          <p style={styles.emptyText}>Orders from customers will appear here once they start shopping.</p>
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
  headerCentered: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '1.5rem',
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#2c3e50',
    marginBottom: '0.5rem',
    letterSpacing: '-1px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#6c757d',
    margin: 0,
    marginBottom: '1rem',
    textAlign: 'center',
  },
  statsRight: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: '1.5rem',
  },
  statCard: {
    background: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '12px',
    textAlign: 'center',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  statNumber: {
    display: 'block',
    fontSize: '1.5rem',
    fontWeight: '700',
    color: '#28a745'
  },
  statLabel: {
    fontSize: '0.9rem',
    color: '#6c757d',
    fontWeight: '500'
  },
  ordersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '2rem'
  },
  orderCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  orderHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f1f3f4'
  },
  orderId: {
    display: 'flex',
    flexDirection: 'column'
  },
  orderIdLabel: {
    fontSize: '0.8rem',
    color: '#6c757d',
    fontWeight: '500'
  },
  orderIdValue: {
    fontSize: '1.1rem',
    fontWeight: '700',
    color: '#2c3e50'
  },
  statusBadge: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.85rem'
  },
  statusIcon: {
    marginRight: '0.5rem',
    fontSize: '1rem'
  },
  statusText: {
    textTransform: 'capitalize'
  },
  orderInfo: {
    marginBottom: '1.5rem'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  infoLabel: {
    fontSize: '0.9rem',
    color: '#6c757d',
    fontWeight: '500'
  },
  infoValue: {
    fontSize: '0.95rem',
    color: '#2c3e50',
    fontWeight: '600'
  },
  totalAmount: {
    fontSize: '1.1rem',
    color: '#28a745',
    fontWeight: '700'
  },
  orderItems: {
    marginBottom: '1.5rem',
    padding: '1rem',
    background: '#f8f9fa',
    borderRadius: '8px'
  },
  itemsLabel: {
    fontSize: '0.9rem',
    color: '#6c757d',
    fontWeight: '600',
    marginBottom: '0.5rem',
    display: 'block'
  },
  itemsList: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  item: {
    fontSize: '0.85rem',
    color: '#2c3e50',
    background: 'white',
    padding: '0.25rem 0.75rem',
    borderRadius: '15px',
    border: '1px solid #e9ecef'
  },
  moreItems: {
    fontSize: '0.85rem',
    color: '#6c757d',
    fontStyle: 'italic'
  },
  orderActions: {
    display: 'flex',
    justifyContent: 'center'
  },
  statusSelect: {
    width: '100%',
    padding: '0.75rem',
    borderRadius: '8px',
    border: '1px solid #e9ecef',
    background: 'white',
    fontSize: '0.95rem',
    fontWeight: '500',
    color: '#2c3e50',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
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
    color: '#6c757d'
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
  
  .admin-order-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  }
  
  .admin-status-select:focus {
    outline: none;
    border-color: #28a745;
    box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.1);
  }
`;
document.head.appendChild(styleSheet);

export default AdminOrderList; 