import { useState } from 'react';
import { register } from '../services/authService';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, message: '' };

    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[@$!%*?&]/.test(password)) strength++;

    const messages = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    return { strength, message: messages[strength] || 'Strong' };
  };

  const passwordStrength = getPasswordStrength(form.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
    if (!passwordRegex.test(form.password)) {
      setError("Password must contain uppercase, lowercase, number and special character");
      return;
    }

    try {
      await register({ name: form.name, email: form.email, password: form.password });
      setSuccess(true);
      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response?.data?.errors) {
        // Handle validation errors
        const errorMessages = err.response.data.errors.map(error => 
          `${error.field}: ${error.message}`
        ).join(', ');
        setError(errorMessages);
      } else {
        const message = err.response?.data?.message || 'Registration failed';
        setError(message);
      }
    }
  };

  if (success) {
    return (
      <div style={{ padding: 32, textAlign: 'center' }}>
        <h2>Registration Successful!</h2>
        <p>You can now log in with your credentials.</p>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      width: '100vw',
      background: 'linear-gradient(135deg, #b2f0e6 0%, #d0f7c6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
      margin: 0,
    }}>
      <div className="login-split-card" style={{
        width: '92vw',
        maxWidth: 800,
        minHeight: 500,
        background: '#fff',
        borderRadius: 18,
        boxShadow: '0 4px 24px rgba(0,0,0,0.10)',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
        alignItems: 'stretch',
        height: 'auto',
      }}>
        {/* Left side: Welcome message */}
        <div style={{
          flex: 1,
          minWidth: 0,
          background: 'linear-gradient(135deg, #0fd850 0%, #00f2fe 100%)',
          position: 'relative',
          height: 'auto',
          minHeight: '100%',
          display: 'block',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            width: '100%',
            transform: 'translateY(-50%)',
            textAlign: 'center',
            color: '#fff',
            textShadow: '0 2px 8px rgba(0,0,0,0.18)',
            padding: '0 10px',
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 400, marginBottom: 8 }}>Welcome!</div>
            <div style={{ fontSize: '2.2rem', fontWeight: 700, letterSpacing: '-1px' }}>Create Account</div>
          </div>
        </div>
        {/* Right side: Registration form */}
        <div style={{
          flex: 1,
          minWidth: 0,
          background: '#fff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          height: 'auto',
          minHeight: '100%',
        }}>
          <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 320, display: 'flex', flexDirection: 'column', gap: 18 }}>
            <h2 style={{ textAlign: 'center', fontWeight: 600, fontSize: '1.5rem', marginBottom: 12 }}>Register</h2>
            {error && <p style={{ color: 'red', textAlign: 'center', margin: 0 }}>{error}</p>}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label htmlFor="name" style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>Name</label>
              <input
                id="name"
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #bbb',
                  borderRadius: 6,
                  fontSize: 15,
                  outline: 'none',
                  marginBottom: 0,
                  width: '100%',
                  height: 40,
                  background: '#c3c9d1',
                  color: '#222',
                  boxSizing: 'border-box',
                }}
                autoComplete="name"
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <label htmlFor="email" style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>Email address</label>
              <input
                id="email"
                type="email"
                placeholder="Email address"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #bbb',
                  borderRadius: 6,
                  fontSize: 15,
                  outline: 'none',
                  marginBottom: 0,
                  width: '100%',
                  height: 40,
                  background: '#c3c9d1',
                  color: '#222',
                  boxSizing: 'border-box',
                }}
                autoComplete="email"
                required
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="password" style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>Password</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  style={{
                    padding: '10px 38px 10px 12px',
                    border: '1px solid #bbb',
                    borderRadius: 6,
                    fontSize: 15,
                    outline: 'none',
                    width: '100%',
                    height: 40,
                    background: '#c3c9d1',
                    color: '#222',
                    boxSizing: 'border-box',
                  }}
                  autoComplete="new-password"
                  required
                />
                <span
                  onClick={() => setShowPassword(v => !v)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#000',
                    fontSize: 22,
                    userSelect: 'none',
                    fontFamily: 'Material Icons',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    lineHeight: 1,
                    letterSpacing: 'normal',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    wordWrap: 'normal',
                    direction: 'ltr',
                    WebkitFontFeatureSettings: '"liga"',
                    WebkitFontSmoothing: 'antialiased',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                  role="button"
                >
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label htmlFor="confirmPassword" style={{ fontWeight: 500, fontSize: 14, marginBottom: 2 }}>Confirm Password</label>
              <div style={{ position: 'relative', width: '100%' }}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={form.confirmPassword}
                  onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                  style={{
                    padding: '10px 38px 10px 12px',
                    border: '1px solid #bbb',
                    borderRadius: 6,
                    fontSize: 15,
                    outline: 'none',
                    width: '100%',
                    height: 40,
                    background: '#c3c9d1',
                    color: '#222',
                    boxSizing: 'border-box',
                  }}
                  autoComplete="new-password"
                  required
                />
                <span
                  onClick={() => setShowConfirmPassword(v => !v)}
                  style={{
                    position: 'absolute',
                    right: 12,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    cursor: 'pointer',
                    color: '#000',
                    fontSize: 22,
                    userSelect: 'none',
                    fontFamily: 'Material Icons',
                    fontWeight: 'normal',
                    fontStyle: 'normal',
                    lineHeight: 1,
                    letterSpacing: 'normal',
                    textTransform: 'none',
                    whiteSpace: 'nowrap',
                    wordWrap: 'normal',
                    direction: 'ltr',
                    WebkitFontFeatureSettings: '"liga"',
                    WebkitFontSmoothing: 'antialiased',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                  role="button"
                >
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </div>
            </div>
            <button
              type="submit"
              style={{
                width: '100%',
                background: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                padding: '11px 0',
                fontWeight: 600,
                fontSize: 17,
                marginTop: 8,
                boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                cursor: 'pointer',
                transition: 'background 0.18s',
              }}
              onMouseOver={e => e.currentTarget.style.background = '#333'}
              onMouseOut={e => e.currentTarget.style.background = '#111'}
            >
              Register
            </button>
            <div style={{ textAlign: 'center', marginTop: 10, fontSize: 15 }}>
              Already have an account?{' '}
              <span onClick={() => navigate('/login')} style={{ color: '#0099ff', textDecoration: 'underline', fontWeight: 500, cursor: 'pointer' }}>
                Login
              </span>
            </div>
          </form>
        </div>
      </div>
      <style>{`
        @import url('https://fonts.googleapis.com/icon?family=Material+Icons');
        @media (max-width: 800px) {
          .login-split-card {
            flex-direction: column !important;
            width: 96vw !important;
            max-width: 96vw !important;
            min-height: auto !important;
            border-radius: 12px !important;
          }
          .login-split-card > div {
            width: 100% !important;
            padding: 28px 6vw !important;
          }
        }
        @media (max-width: 480px) {
          .login-split-card > div {
            padding: 20px 4vw !important;
          }
          form h2 {
            font-size: 1.25rem !important;
          }
          form button {
            font-size: 1rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default Register; 