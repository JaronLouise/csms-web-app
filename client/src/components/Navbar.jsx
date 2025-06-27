import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const scrollToSection = (sectionId) => {
  setTimeout(() => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100); // Delay to ensure DOM is rendered
};

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const cartItemCount = 0; // Placeholder for cart count, set to 0 for logged out/empty cart
  const [pendingScroll, setPendingScroll] = useState(null);

  // Handle scroll after navigation to home
  useEffect(() => {
    if (pendingScroll && location.pathname === '/') {
      scrollToSection(pendingScroll);
      setPendingScroll(null);
    }
  }, [location, pendingScroll]);

  const handleRoute = (route) => {
    setDrawerOpen(false);
    navigate(route);
  };

  const handleLogout = () => {
    logout();
    setDrawerOpen(false);
    navigate('/');
  };

  const handleScrollNav = (sectionId) => {
    setDrawerOpen(false);
    if (location.pathname === '/') {
      scrollToSection(sectionId);
    } else {
      setPendingScroll(sectionId);
      navigate('/');
    }
  };

  return (
    <nav style={{ position: 'sticky', top: 0, left: 0, width: '100vw', background: '#fff', color: '#222', zIndex: 1000, borderBottom: '1px solid #ddd', minHeight: 64, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
      {/* Desktop/Tablet Navbar */}
      <div className="navbar-desktop" style={{ display: 'flex', minHeight: 64, width: '100vw' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100vw',
          height: 64,
          position: 'relative',
        }}>
          {/* Left links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, justifyContent: 'flex-start' }}>
            <button onClick={() => handleScrollNav('home')} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 500, cursor: 'pointer', padding: '0.5rem 1.2rem', fontSize: '1rem', minWidth: 80 }}>Home</button>
            <button onClick={() => handleRoute('/products')} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 500, cursor: 'pointer', padding: '0.5rem 1.2rem', fontSize: '1rem', minWidth: 80 }}>Products</button>
            <button onClick={() => handleScrollNav('services')} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 500, cursor: 'pointer', padding: '0.5rem 1.2rem', fontSize: '1rem', minWidth: 80 }}>Services</button>
            <button onClick={() => handleScrollNav('about')} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 500, cursor: 'pointer', padding: '0.5rem 1.2rem', fontSize: '1rem', minWidth: 80 }}>About Us</button>
          </div>
          {/* Centered brand/logo */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.3rem', letterSpacing: 1, background: '#fff', padding: '0 1rem', pointerEvents: 'auto' }}>RESET CORP.</span>
          </div>
          {/* Right links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, justifyContent: 'flex-end' }}>
            <button onClick={() => handleRoute('/contact')} style={{ background: 'none', border: 'none', color: '#222', fontWeight: 500, cursor: 'pointer', padding: '0.5rem 1.2rem', fontSize: '1rem', minWidth: 80 }}>Contacts</button>
            {user ? (
              <>
                <button onClick={() => handleRoute('/profile')} style={{ background: 'none', border: '1px solid #222', color: '#222', borderRadius: '1.5rem', padding: '0.5rem 1.5rem', fontWeight: 500, cursor: 'pointer', fontSize: '1rem', minWidth: 80 }}>Profile</button>
                <button onClick={handleLogout} style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: '1.5rem', padding: '0.5rem 1.5rem', fontWeight: 500, cursor: 'pointer', fontSize: '1rem', minWidth: 80 }}>Logout</button>
              </>
            ) : (
              <button onClick={() => handleRoute('/login')} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '1.5rem', padding: '0.5rem 1.5rem', fontWeight: 500, cursor: 'pointer', fontSize: '1rem', minWidth: 80 }}>Login</button>
            )}
            <button onClick={() => handleRoute('/cart')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.5rem', position: 'relative', cursor: 'pointer', minWidth: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span role="img" aria-label="cart">🛒</span>
              {cartItemCount > 0 && (
                <span style={{ position: 'absolute', top: 8, right: 8, background: '#000', color: '#fff', borderRadius: '50%', fontSize: '0.8rem', padding: '0.1rem 0.4rem', minWidth: 18, textAlign: 'center' }}>{cartItemCount}</span>
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navbar */}
      <div className="navbar-mobile" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 1rem', minHeight: 64, width: '100vw' }}>
        <span style={{ fontWeight: 'bold', fontSize: '1.2rem' }}>RESET CORP.</span>
        <button
          aria-label="Open navigation menu"
          onClick={() => setDrawerOpen(true)}
          style={{ background: 'none', border: 'none', color: '#222', fontSize: '2rem', cursor: 'pointer', minWidth: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          &#9776;
        </button>
      </div>
      {/* Side Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: drawerOpen ? 0 : '-80vw',
          width: '80vw',
          maxWidth: 320,
          height: '100vh',
          background: '#fff',
          color: '#222',
          transition: 'left 0.3s',
          zIndex: 2000,
          display: 'flex',
          flexDirection: 'column',
          paddingTop: '2rem',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)'
        }}
      >
        <button
          aria-label="Close navigation menu"
          onClick={() => setDrawerOpen(false)}
          style={{ alignSelf: 'flex-end', marginRight: '1.5rem', background: 'none', border: 'none', color: '#222', fontSize: '2rem', cursor: 'pointer', minWidth: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          &times;
        </button>
        <button onClick={() => handleScrollNav('home')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.1rem', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%' }}>Home</button>
        <button onClick={() => handleRoute('/products')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.1rem', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%' }}>Products</button>
        <button onClick={() => handleScrollNav('services')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.1rem', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%' }}>Services</button>
        <button onClick={() => handleScrollNav('about')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.1rem', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%' }}>About Us</button>
        <button onClick={() => handleRoute('/contact')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.1rem', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%' }}>Contacts</button>
        {user ? (
          <>
            <button onClick={() => handleRoute('/profile')} style={{ background: 'none', border: '1px solid #222', color: '#222', borderRadius: '1.5rem', padding: '0.7rem 2rem', fontWeight: 500, margin: '1rem 2rem', cursor: 'pointer', fontSize: '1.1rem', width: 'calc(100% - 4rem)' }}>Profile</button>
            <button onClick={handleLogout} style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: '1.5rem', padding: '0.7rem 2rem', fontWeight: 500, margin: '0 2rem 1rem 2rem', cursor: 'pointer', fontSize: '1.1rem', width: 'calc(100% - 4rem)' }}>Logout</button>
          </>
        ) : (
          <button onClick={() => handleRoute('/login')} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '1.5rem', padding: '0.7rem 2rem', fontWeight: 500, margin: '1rem 2rem', cursor: 'pointer', fontSize: '1.1rem', width: 'calc(100% - 4rem)' }}>Login</button>
        )}
        <button onClick={() => handleRoute('/cart')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.5rem', position: 'relative', textAlign: 'left', padding: '1rem 2rem', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center' }}>
          <span role="img" aria-label="cart">🛒</span>
          {cartItemCount > 0 && (
            <span style={{ marginLeft: 8, background: '#000', color: '#fff', borderRadius: '50%', fontSize: '0.8rem', padding: '0.1rem 0.4rem', minWidth: 18, textAlign: 'center' }}>{cartItemCount}</span>
          )}
        </button>
      </div>
      {/* Overlay */}
      {drawerOpen && (
        <div
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1500,
          }}
        />
      )}
      {/* Responsive styles */}
      <style>{`
        @media (min-width: 900px) {
          .navbar-desktop { display: flex !important; }
          .navbar-mobile { display: none !important; }
        }
        @media (max-width: 899px) {
          .navbar-desktop { display: none !important; }
          .navbar-mobile { display: flex !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 