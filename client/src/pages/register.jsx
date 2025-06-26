import { useState } from 'react';
import { register } from '../services/authService';

const Register = () => {
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  // Password strength checker
  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, message: '' };
    
    let strength = 0;
    let message = '';
    
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;
    
    if (strength === 0) message = 'Very Weak';
    else if (strength <= 2) message = 'Weak';
    else if (strength <= 3) message = 'Fair';
    else if (strength <= 4) message = 'Good';
    else message = 'Strong';
    
    return { strength, message };
  };

  const passwordStrength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    
    // Client-side validation
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    // Check password requirements
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(form.password)) {
      setError("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character (@$!%*?&)");
      return;
    }
    
    try {
      await register({ name: form.name, email: form.email, password: form.password });
      setSuccess(true);
      alert('Registration successful! Please log in.');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = err.response.data.errors.map(error => 
          `${error.field}: ${error.message}`
        ).join(', ');
        setError(errorMessages);
      } else {
        setError(err.response?.data?.message || 'Registration failed');
      }
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
    <div style={{ 
      maxWidth: '400px', 
      margin: '0 auto', 
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Register</h2>
        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
        <input
          placeholder="Name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <input
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        {form.password && (
          <div style={{ 
            fontSize: '12px', 
            marginBottom: '10px',
            color: passwordStrength.strength >= 5 ? '#28a745' : 
                   passwordStrength.strength >= 3 ? '#ffc107' : '#dc3545'
          }}>
            Password strength: {passwordStrength.message} ({passwordStrength.strength}/5)
          </div>
        )}
        <div style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
          Password must contain: uppercase letter, lowercase letter, number, and special character (@$!%*?&)
        </div>
        <input
          placeholder="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid #ddd' }}
        />
        <button 
          type="submit"
          style={{ 
            padding: '12px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '16px'
          }}
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default Register; 