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

  return (
    <div>
      <h3>Edit User</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={user.name}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={user.email}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Role</label>
          <select name="role" value={user.role} onChange={handleInputChange}>
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <button type="submit">Update User</button>
      </form>
    </div>
  );
};

export default AdminUserForm; 