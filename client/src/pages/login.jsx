import { useState } from 'react';
import { login } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const { login: loginUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const data = await login(form);
      loginUser(data);
      alert('Login successful');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        placeholder="Email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <button type="submit">Log In</button>
    </form>
  );
};

export default Login;
