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
      case 'customer': return 'person';
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
        <div style={styles.loadingContainerUser}>
          <div style={styles.loadingSpinnerUser}></div>
          <p style={styles.loadingTextUser}>Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.errorContainerUser}>
          <span style={styles.errorIconUser} className="material-symbols-outlined">warning</span>
          <p style={styles.errorTextUser}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.headerOMatchTextBlock}>
        <h1 style={styles.headerTitleOMatch}>User Management</h1>
        <p style={styles.headerSubtitleOMatch}>Manage user accounts and roles</p>
      </div>
      <div style={styles.headerStatsOMatchBoxRight}>
        <div style={styles.headerStatBoxOMatch}>
          <span style={styles.headerStatNumberOMatch}>{users.filter(u => u.role === 'customer').length}</span>
          <span style={styles.headerStatLabelOMatch}>Total Users</span>
        </div>
        <div style={styles.headerStatBoxOMatch}>
          <span style={styles.headerStatNumberOMatch}>{users.filter(u => u.role === 'admin').length}</span>
          <span style={styles.headerStatLabelOMatch}>Admins</span>
        </div>
      </div>

      {/* Users Grid */}
      <div style={styles.usersGridUser}>
        {users.map((user) => (
          <div key={user._id} style={styles.userCardUser} className="admin-product-card">
            <div style={styles.userCardTopUser}>
              <div style={styles.userAvatarUser}>
                {user.profilePicture ? (
                  <img
                    src={`${user.profilePicture}${user.profilePicture.includes('?') ? '&' : '?'}t=${Date.now()}`}
                    alt={user.name || 'User'}
                    style={styles.avatarImgUser}
                  />
                ) : (
                  <span style={styles.avatarTextUser}>
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                )}
              </div>
              <div style={styles.userCardInfoUser}>
                <h3 style={styles.userNameUser}>{user.name}</h3>
                <p style={styles.userEmailUser}>{user.email}</p>
                <span style={{
                  ...styles.roleBadgeUser,
                  background: user.role === 'admin' ? '#16a34a' : '#22c55e',
                  color: '#fff',
                }}>
                  <span style={styles.roleIconUser} className="material-symbols-outlined">
                    {getRoleIcon(user.role)}
                  </span>
                  {user.role === 'customer' ? 'Customer' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                </span>
              </div>
            </div>
            <div style={styles.userStatsUser}>
              <div style={styles.statUser}><span style={styles.statLabelUser}>User ID:</span><span style={styles.statValueUser}>{user._id.slice(-8)}</span></div>
              <div style={styles.statUser}><span style={styles.statLabelUser}>Joined:</span><span style={styles.statValueUser}>{user.createdAt ? formatDate(user.createdAt) : 'N/A'}</span></div>
              <div style={styles.statUser}><span style={styles.statLabelUser}>Status:</span><span style={{...styles.statValueUser, color: user.isActive !== false ? '#28a745' : '#6c757d'}}>{user.isActive !== false ? 'Active' : 'Inactive'}</span></div>
            </div>
            <div style={styles.userActionsUser}>
              <Link 
                to={`/admin/users/edit/${user._id}`} 
                style={styles.editButtonUser}
                className="admin-edit-button"
              >
                <span style={styles.actionIconUser} className="material-symbols-outlined">edit</span>
                Edit
              </Link>
              <button 
                onClick={() => handleDelete(user._id)} 
                style={styles.deleteButtonUser}
                className="admin-delete-button"
                disabled={user.role === 'admin'}
              >
                <span style={styles.deleteIconUser} className="material-symbols-outlined">delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div style={styles.emptyStateUser}>
          <span style={styles.emptyIconUser} className="material-symbols-outlined">group</span>
          <h3 style={styles.emptyTitleUser}>No Users Yet</h3>
          <p style={styles.emptyTextUser}>Get started by adding your first user.</p>
          <Link to="new" style={styles.emptyButtonUser}>
            Add Your First User
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
  headerOMatchWrap: {
    position: 'relative',
    width: '100%',
    marginBottom: '3.5rem',
    minHeight: '110px',
  },
  headerOMatchTextBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    zIndex: 1,
    marginBottom: '2.5rem',
  },
  headerStatsOMatchBox: {
    position: 'absolute',
    top: '100%',
    right: '0',
    display: 'flex',
    flexDirection: 'row',
    gap: '1.5rem',
    marginTop: '0.5rem',
    zIndex: 2,
  },
  headerTitleOMatch: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: '#2c3e50',
    marginBottom: '0.4rem',
    letterSpacing: '-1px',
    textAlign: 'center',
  },
  headerSubtitleOMatch: {
    fontSize: '1rem',
    color: '#6c757d',
    margin: 0,
    textAlign: 'center',
    fontWeight: 400,
    marginBottom: '1.5rem',
  },
  headerStatBoxOMatch: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    padding: '0.7rem 1.3rem 0.5rem 1.3rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '90px',
    textAlign: 'center',
  },
  headerStatNumberOMatch: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#28a745',
    marginBottom: '0.15rem',
    letterSpacing: '-1px',
    lineHeight: 1.1,
  },
  headerStatLabelOMatch: {
    fontSize: '0.95rem',
    color: '#5a6a85',
    fontWeight: 500,
    marginTop: 0,
    letterSpacing: 0,
  },
  '@media (max-width: 700px)': {
    headerStatsOMatchBox: {
      position: 'static',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1rem',
      marginTop: '2.5rem',
    },
    headerOMatchTextBlock: {
      textAlign: 'center',
      marginBottom: '2.5rem',
    },
    headerOMatchWrap: {
      marginBottom: '2.5rem',
    },
  },
  usersGridUser: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '2rem',
  },
  userCardUser: {
    background: 'white',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '280px',
    position: 'relative',
    transition: undefined,
    animation: undefined,
    WebkitTransition: undefined,
    MozTransition: undefined,
    OTransition: undefined,
    msTransition: undefined,
  },
  userCardTopUser: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1.2rem',
    padding: '1.5rem 1.5rem 0.5rem 1.5rem',
  },
  userAvatarUser: {
    width: '56px',
    height: '56px',
    minWidth: '56px',
    minHeight: '56px',
    maxWidth: '56px',
    maxHeight: '56px',
    borderRadius: '50%',
    background: 'linear-gradient(to bottom, #fff 0%, #f3f4f6 100%)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#2c3e50',
  },
  avatarImgUser: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    display: 'block',
  },
  avatarTextUser: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#2c3e50',
    textAlign: 'center',
    width: '100%',
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  userCardInfoUser: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    flex: 1,
    minWidth: 0,
    alignItems: 'flex-start',
  },
  userNameUser: {
    fontSize: '1.15rem',
    fontWeight: 600,
    color: '#2c3e50',
    margin: 0,
    lineHeight: 1.3,
    wordBreak: 'break-word',
    textAlign: 'left',
  },
  userEmailUser: {
    fontSize: '0.95rem',
    color: '#6c757d',
    margin: 0,
    wordBreak: 'break-all',
    textAlign: 'left',
  },
  roleBadgeUser: {
    fontSize: '0.85rem',
    margin: '0.5rem 0 0 0',
    padding: '0.18rem 1.1rem',
    background: '#22c55e',
    borderRadius: '999px',
    display: 'inline-flex',
    alignItems: 'center',
    fontWeight: 600,
    gap: '0.4rem',
    letterSpacing: 0,
    justifyContent: 'center',
    minWidth: 'auto',
    maxWidth: '100%',
    alignSelf: 'flex-start',
  },
  roleIconUser: {
    fontSize: '1.1rem',
    marginRight: '0.3rem',
  },
  userStatsUser: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '0 1.5rem',
  },
  statUser: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabelUser: {
    fontSize: '0.9rem',
    color: '#6c757d',
    fontWeight: 500,
  },
  statValueUser: {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#2c3e50',
  },
  userActionsUser: {
    display: 'flex',
    gap: '0.5rem',
    padding: '0 1.5rem 1.5rem 1.5rem',
    marginTop: 'auto',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  editButtonUser: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem',
    background: '#000000',
    color: 'white',
    borderRadius: '8px',
    textDecoration: 'none',
    fontWeight: 500,
    transition: 'all 0.3s ease',
    border: 'none',
    fontSize: '1rem',
    cursor: 'pointer',
  },
  deleteButtonUser: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0.75rem',
    background: '#dc3545',
    color: 'white',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    width: '48px',
    height: '48px',
    minWidth: '48px',
    fontSize: '1.2rem',
  },
  actionIconUser: {
    fontSize: '1rem',
    marginRight: '0.5rem',
    color: 'white',
  },
  deleteIconUser: {
    fontSize: '1.2rem',
    color: 'white',
  },
  loadingContainerUser: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
  },
  loadingSpinnerUser: {
    width: '40px',
    height: '40px',
    border: '4px solid #f3f3f3',
    borderTop: '4px solid #28a745',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem',
  },
  loadingTextUser: {
    color: '#6c757d',
    fontSize: '1.1rem',
  },
  errorContainerUser: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '50vh',
    background: 'white',
    borderRadius: '16px',
    padding: '2rem',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  },
  errorIconUser: {
    fontSize: '3rem',
    marginBottom: '1rem',
    color: '#dc3545',
  },
  errorTextUser: {
    color: '#dc3545',
    fontSize: '1.1rem',
    textAlign: 'center',
  },
  emptyStateUser: {
    textAlign: 'center',
    padding: '4rem 2rem',
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
  },
  emptyIconUser: {
    fontSize: '4rem',
    marginBottom: '1rem',
    display: 'block',
    color: '#6c757d',
  },
  emptyTitleUser: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#2c3e50',
    marginBottom: '0.5rem',
  },
  emptyTextUser: {
    fontSize: '1rem',
    color: '#6c757d',
  },
  emptyButtonUser: {
    marginTop: '1.5rem',
    padding: '0.75rem 1.5rem',
    background: '#28a745',
    color: 'white',
    borderRadius: '12px',
    textDecoration: 'none',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(40, 167, 69, 0.3)',
    display: 'inline-block',
  },
  headerStatsOMatchBoxRight: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    gap: '1rem',
    margin: '-2.5rem 0 2.5rem 0',
    width: '100%',
    maxWidth: '100vw',
    position: 'relative',
    zIndex: 2,
    paddingRight: '1.2rem',
  },
  '@media (max-width: 900px)': {
    headerStatsOMatchBoxRight: {
      flexDirection: 'column',
      alignItems: 'flex-end',
      justifyContent: 'flex-end',
      gap: '0.7rem',
      margin: '0 0 2rem 0',
      paddingRight: '0.5rem',
      maxWidth: '100%',
    },
    headerStatBoxOMatch: {
      minWidth: '90px',
      padding: '0.7rem 1.1rem 0.5rem 1.1rem',
    },
  },
};

// Add CSS animations
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .admin-edit-button:hover {
    background: #2563eb;
  }
  .admin-delete-button:hover:not(:disabled) {
    background: #dc2626;
  }
  .admin-delete-button:disabled {
    background: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
`;
document.head.appendChild(styleSheet);

export default AdminUserList; 