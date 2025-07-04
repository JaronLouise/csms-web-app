import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAllProducts, getAllOrders, getAllUsers } from '../services/adminService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!document.getElementById('admin-dashboard-hover-effects')) {
      const styleSheet = document.createElement('style');
      styleSheet.id = 'admin-dashboard-hover-effects';
      styleSheet.textContent = `
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .admin-card {
          animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .admin-card:hover {
          transform: translateY(-8px) scale(1.02) !important;
          box-shadow: 0 12px 40px rgba(0,0,0,0.15) !important;
          border-color: rgba(40, 167, 69, 0.2) !important;
        }
        .admin-card:hover .card-icon {
          transform: scale(1.1) !important;
          color: #28a745 !important;
        }
        .admin-card:hover .card-title {
          color: #28a745 !important;
        }
        .admin-card:hover .card-count {
          transform: scale(1.05) !important;
        }
        .admin-card:hover .card-action {
          color: #1e7e34 !important;
          transform: translateX(4px) !important;
        }
        .admin-action-button {
          position: relative;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .admin-action-button:hover {
          background: #218838 !important;
          color: #fff !important;
          transform: translateY(-3px) scale(1.02) !important;
          box-shadow: 0 8px 25px rgba(40, 167, 69, 0.3) !important;
          border-color: #218838 !important;
        }
        .admin-action-button .action-icon {
          color: #fff !important;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .admin-action-button:hover .action-icon {
          transform: scale(1.2) rotate(5deg) !important;
          color: #fff !important;
        }
        .admin-section {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
        }
        .admin-section:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 8px 30px rgba(0,0,0,0.12) !important;
        }
        .admin-card:nth-child(1) { animation-delay: 0.1s; }
        .admin-card:nth-child(2) { animation-delay: 0.2s; }
        .admin-card:nth-child(3) { animation-delay: 0.3s; }
        @media (max-width: 768px) {
          .admin-card:hover {
            transform: translateY(-4px) scale(1.01) !important;
          }
          .admin-action-button:hover {
            transform: translateY(-2px) scale(1.01) !important;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [products, orders, users] = await Promise.all([
        getAllProducts(),
        getAllOrders(),
        getAllUsers()
      ]);
      setStats({
        products: products.length,
        orders: orders.length,
        users: users.length
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const dashboardCards = [
    {
      title: 'Products',
      count: stats.products,
      description: 'Manage your product catalog',
      link: '/admin/products',
      icon: 'inventory_2',
      color: '#28a745'
    },
    {
      title: 'Orders',
      count: stats.orders,
      description: 'Track and manage customer orders',
      link: '/admin/orders',
      icon: 'receipt_long',
      color: '#007bff'
    },
    {
      title: 'Users',
      count: stats.users,
      description: 'Manage user accounts and permissions',
      link: '/admin/users',
      icon: 'group',
      color: '#6f42c1'
    }
  ];

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>Welcome back! Here's an overview of your store.</p>
      </div>

      {/* Stats Cards */}
      <div style={styles.statsGrid}>
        {dashboardCards.map((card, index) => (
          <Link key={index} to={card.link} style={styles.cardLink}>
            <div style={styles.card} className="admin-card">
              <div style={styles.cardHeader}>
                <span style={styles.cardIcon} className="material-symbols-outlined card-icon">
                  {card.icon}
                </span>
                <div style={styles.cardInfo}>
                  <h3 style={styles.cardTitle} className="card-title">{card.title}</h3>
                  <p style={styles.cardDescription}>{card.description}</p>
                </div>
              </div>
              <div style={styles.cardFooter}>
                <span style={{ ...styles.cardCount, color: card.color }} className="card-count">
                  {card.count}
                </span>
                <span style={styles.cardAction} className="card-action">Manage →</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={styles.section} className="admin-section">
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.quickActions}>
          <Link to="/admin/products/new" style={styles.actionButton} className="admin-action-button">
            <span style={styles.actionIcon} className="material-symbols-outlined action-icon">add</span>
            Add New Product
          </Link>
          <Link to="/admin/orders" style={styles.actionButton} className="admin-action-button">
            <span style={styles.actionIcon} className="material-symbols-outlined action-icon">analytics</span>
            View Orders
          </Link>
          <Link to="/admin/users" style={styles.actionButton} className="admin-action-button">
            <span style={styles.actionIcon} className="material-symbols-outlined action-icon">person</span>
            Manage Users
          </Link>
        </div>
      </div>
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
    textAlign: 'center',
    marginBottom: '3rem'
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '2rem',
    marginBottom: '3rem'
  },
  cardLink: {
    textDecoration: 'none',
    color: 'inherit'
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid rgba(0,0,0,0.05)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  },
  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem'
  },
  cardIcon: {
    fontSize: '2.5rem',
    marginRight: '1rem',
    color: '#6c757d',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  cardInfo: {
    flex: 1
  },
  cardTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 0.5rem 0',
    transition: 'color 0.3s ease'
  },
  cardDescription: {
    fontSize: '0.95rem',
    color: '#6c757d',
    margin: 0,
    lineHeight: '1.4',
    transition: 'color 0.3s ease'
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: '1rem',
    borderTop: '1px solid #f1f3f4'
  },
  cardCount: {
    fontSize: '2rem',
    fontWeight: '700',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  cardAction: {
    fontSize: '0.9rem',
    color: '#28a745',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  },
  section: {
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  sectionTitle: {
    fontSize: '1.5rem',
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: '1.5rem'
  },
  quickActions: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem'
  },
  actionButton: {
    display: 'flex',
    alignItems: 'center',
    padding: '1rem 1.5rem',
    background: '#28a745',
    borderRadius: '12px',
    textDecoration: 'none',
    color: '#fff',
    fontWeight: '500',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '1px solid #28a745',
    position: 'relative',
    overflow: 'hidden'
  },
  actionIcon: {
    fontSize: '1.2rem',
    marginRight: '0.75rem',
    color: '#fff',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
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
  }
};

export default AdminDashboard; 