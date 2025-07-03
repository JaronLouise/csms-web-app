import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllUsers, deleteUser } from '../../services/adminService';

const AdminUserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      setUsers(data);
    } catch (err) {
      setError('Failed to load users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        fetchUsers(); // Refresh the list
      } catch (err) {
        setError('Failed to delete user.');
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#dc3545';
      case 'user': return '#28a745';
      default: return '#6c757d';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin': return 'admin_panel_settings';
      case 'user': return 'person';
      default: return 'help';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p style={styles.loadingText}>Loading users...</p>
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
          <h1 style={styles.title}>User Management</h1>
          <p style={styles.subtitle}>Manage user accounts and permissions</p>
        </div>
        <div style={styles.stats}>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>{users.length}</span>
            <span style={styles.statLabel}>Total Users</span>
          </div>
          <div style={styles.statCard}>
            <span style={styles.statNumber}>
              {users.filter(user => user.role === 'admin').length}
            </span>
            <span style={styles.statLabel}>Admins</span>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div style={styles.usersGrid}>
        {users.map((user) => (
          <div key={user._id} style={styles.userCard}>
            <div style={styles.userHeader}>
              <div style={styles.userAvatar}>
                <span style={styles.avatarText}>
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </div>
              <div style={styles.userInfo}>
                <h3 style={styles.userName}>{user.name}</h3>
                <p style={styles.userEmail}>{user.email}</p>
              </div>
              <div style={{
                ...styles.roleBadge,
                backgroundColor: getRoleColor(user.role)
              }}>
                <span style={styles.roleIcon} className="material-symbols-outlined">
                  {getRoleIcon(user.role)}
                </span>
                <span style={styles.roleText}>{user.role.toUpperCase()}</span>
              </div>
            </div>

            <div style={styles.userDetails}>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>User ID:</span>
                <span style={styles.detailValue}>{user._id.slice(-8)}</span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Joined:</span>
                <span style={styles.detailValue}>
                  {user.createdAt ? formatDate(user.createdAt) : 'N/A'}
                </span>
              </div>
              <div style={styles.detailRow}>
                <span style={styles.detailLabel}>Status:</span>
                <span style={{
                  ...styles.statusIndicator,
                  color: user.isActive !== false ? '#28a745' : '#dc3545'
                }}>
                  {user.isActive !== false ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div style={styles.userActions}>
              <Link 
                to={`/admin/users/edit/${user._id}`} 
                style={styles.editButton}
              >
                <span style={styles.actionIcon} className="material-symbols-outlined">edit</span>
                Edit
              </Link>
              <button 
                onClick={() => handleDelete(user._id)} 
                style={styles.deleteButton}
                disabled={user.role === 'admin'}
              >
                <span style={styles.actionIcon} className="material-symbols-outlined">delete</span>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div style={styles.emptyState}>
          <span style={styles.emptyIcon} className="material-symbols-outlined">group</span>
          <h3 style={styles.emptyTitle}>No Users Found</h3>
          <p style={styles.emptyText}>User accounts will appear here once they register.</p>
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
  stats: {
    display: 'flex',
    gap: '1rem'
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
  usersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
    gap: '2rem'
  },
  userCard: {
    background: 'white',
    borderRadius: '16px',
    padding: '1.5rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    transition: 'all 0.3s ease',
    border: '1px solid rgba(0,0,0,0.05)'
  },
  userHeader: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1.5rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #f1f3f4'
  },
  userAvatar: {
    width: '60px',
    height: '60px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '1rem'
  },
  avatarText: {
    fontSize: '1.5rem',
    fontWeight: '700',
    color: 'white'
  },
  userInfo: {
    flex: 1
  },
  userName: {
    fontSize: '1.25rem',
    fontWeight: '600',
    color: '#2c3e50',
    margin: '0 0 0.25rem 0'
  },
  userEmail: {
    fontSize: '0.9rem',
    color: '#6c757d',
    margin: 0
  },
  roleBadge: {
    display: 'flex',
    alignItems: 'center',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    color: 'white',
    fontWeight: '600',
    fontSize: '0.85rem'
  },
  roleIcon: {
    marginRight: '0.5rem',
    fontSize: '1rem'
  },
  roleText: {
    textTransform: 'capitalize'
  },
  userDetails: {
    marginBottom: '1.5rem'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  detailLabel: {
    fontSize: '0.9rem',
    color: '#6c757d',
    fontWeight: '500'
  },
  detailValue: {
    fontSize: '0.95rem',
    color: '#2c3e50',
    fontWeight: '600'
  },
  statusIndicator: {
    fontSize: '0.9rem',
    fontWeight: '600'
  },
  userActions: {
    display: 'flex',
    gap: '0.5rem'
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
  
  .admin-user-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 30px rgba(0,0,0,0.12);
  }
  
  .admin-edit-button:hover {
    background: #0056b3;
    transform: translateY(-1px);
  }
  
  .admin-delete-button:hover:not(:disabled) {
    background: #c82333;
    transform: translateY(-1px);
  }
  
  .admin-delete-button:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
document.head.appendChild(styleSheet);

export default AdminUserList; 