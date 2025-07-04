import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserById, updateUser } from '../../services/adminService';

const AdminUserForm = () => {
  const [user, setUser] = useState({ name: '', email: '', role: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    setLoading(true);
    getUserById(id)
      .then((data) => {
        setUser({
          name: data.name,
          email: data.email,
          role: data.role,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to load user.');
        setLoading(false);
      });
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateUser(id, user);
      navigate('/admin/users');
    } catch (err) {
      setError('Failed to update user.');
    }
  };

  if (loading) return <p>Loading user...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  // Optionally, mock user ID and joined date for visual
  const userId = id ? id.slice(-8) : '--------';
  const joined = user.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A';

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #b2f0e6 0%, #d0f7c6 70%)',
      padding: '2rem',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <div style={styles.card}>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleInputChange}
              style={{ ...styles.nameInput, background: '#fff' }}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              style={{ ...styles.emailInput, background: '#fff' }}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Role</label>
            <div style={styles.roleDropdownWrap}>
              <span style={{...styles.roleIcon, color: '#fff'}} className="material-symbols-outlined">{user.role === 'admin' ? 'admin_panel_settings' : 'person'}</span>
              <select name="role" value={user.role} onChange={handleInputChange} style={styles.roleDropdown}>
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>
          <div style={styles.extraInfoRow}>
            <div style={styles.extraInfo}><span style={styles.extraLabel}>User ID:</span> <span style={styles.extraValue}>{userId}</span></div>
            <div style={styles.extraInfo}><span style={styles.extraLabel}>Joined:</span> <span style={styles.extraValue}>{joined}</span></div>
          </div>
          <div style={styles.buttonRow}>
            <button type="submit" style={styles.updateButton}>Update User</button>
            <button type="button" style={styles.cancelButton} onClick={() => navigate('/admin/users')}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles = {
  card: {
    background: '#fff',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
    border: '1px solid rgba(0,0,0,0.05)',
    maxWidth: '400px',
    margin: '2.5rem auto',
    padding: '2.5rem 2rem 2rem 2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2rem',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.3rem',
    width: '100%',
  },
  label: {
    fontSize: '0.95rem',
    color: '#6c757d',
    fontWeight: 500,
    marginBottom: '0.1rem',
    textAlign: 'center',
    width: '100%',
  },
  nameInput: {
    fontSize: '1.15rem',
    fontWeight: 600,
    color: '#2c3e50',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '0.7rem 1rem',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  },
  emailInput: {
    fontSize: '0.95rem',
    color: '#2c3e50',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    padding: '0.7rem 1rem',
    outline: 'none',
    boxShadow: '0 1px 2px rgba(0,0,0,0.03)',
  },
  roleDropdownWrap: {
    display: 'flex',
    alignItems: 'center',
    background: '#22c55e',
    borderRadius: '999px',
    padding: '0.18rem 1.1rem',
    gap: '0.4rem',
    width: 'fit-content',
    marginTop: '0.2rem',
    marginLeft: 'auto',
    marginRight: 'auto',
    color: '#fff',
  },
  roleIcon: {
    fontSize: '1.1rem',
    marginRight: '0.2rem',
    color: '#fff',
  },
  roleDropdown: {
    border: 'none',
    background: 'transparent',
    color: '#fff',
    fontWeight: 600,
    fontSize: '0.95rem',
    outline: 'none',
    padding: '0.2rem 0.5rem',
    borderRadius: '999px',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    cursor: 'pointer',
  },
  extraInfoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '1.5rem',
    margin: '0.5rem 0 0.2rem 0',
  },
  extraInfo: {
    display: 'flex',
    gap: '0.3rem',
    fontSize: '0.93rem',
    color: '#6c757d',
    alignItems: 'center',
  },
  extraLabel: {
    fontWeight: 500,
    color: '#6c757d',
  },
  extraValue: {
    fontWeight: 600,
    color: '#2c3e50',
    fontSize: '0.97rem',
  },
  buttonRow: {
    display: 'flex',
    gap: '1rem',
    marginTop: '1.5rem',
    justifyContent: 'flex-end',
  },
  updateButton: {
    background: '#111',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    padding: '0.75rem 2.2rem',
    fontWeight: 600,
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: 'none',
    transition: 'background 0.2s',
  },
  cancelButton: {
    background: '#dc3545',
    color: '#fff',
    border: 'none',
    borderRadius: '999px',
    padding: '0.75rem 1.7rem',
    fontWeight: 600,
    fontSize: '1.1rem',
    cursor: 'pointer',
    boxShadow: 'none',
    transition: 'background 0.2s',
  },
};

/* Add custom styles for the select dropdown options */
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  select[name="role"] option {
    color: #222;
    background: #fff;
  }
  select[name="role"] option:checked, select[name="role"] option:focus, select[name="role"] option:hover {
    background: #22c55e !important;
    color: #fff !important;
  }
`;
document.head.appendChild(styleSheet);

export default AdminUserForm; 