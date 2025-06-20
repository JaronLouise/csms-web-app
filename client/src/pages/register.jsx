import { useState } from 'react';
import { register } from '../services/authService';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      setSuccess(true);
      alert('Registration successful! Please log in.');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      console.error(err);
    }
  };

  if (success) {
    return (
        <div>
            <h2>Registration Successful!</h2>
            <p>You can now log in with your credentials.</p>
        </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Register</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        placeholder="Name"
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Email"
        type="email"
        value={form.email}
        onChange={e => setForm({ ...form, email: e.target.value })}
      />
      <input
        placeholder="Password"
        type="password"
        value={form.password}
        onChange={e => setForm({ ...form, password: e.target.value })}
      />
      <input
        placeholder="Confirm Password"
        type="password"
        value={form.confirmPassword}
        onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
      />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register; 