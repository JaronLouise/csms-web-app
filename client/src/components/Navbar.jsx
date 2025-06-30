import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Add Material Icons font import for SSR/CSR
if (typeof document !== 'undefined') {
  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght@400;700&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

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
  const [activeSection, setActiveSection] = useState('home');
  const scrollListenerRef = useRef(null);

  // Handle scroll after navigation to home
  useEffect(() => {
    if (pendingScroll && location.pathname === '/') {
      scrollToSection(pendingScroll);
      setPendingScroll(null);
    }
  }, [location, pendingScroll]);

  // Scroll spy effect for homepage
  useEffect(() => {
    if (location.pathname !== '/') {
      setActiveSection('');
      if (scrollListenerRef.current) {
        window.removeEventListener('scroll', scrollListenerRef.current);
        scrollListenerRef.current = null;
      }
      return;
    }
    function onScroll() {
      const home = document.getElementById('home');
      const services = document.getElementById('services');
      const about = document.getElementById('about');
      const scrollY = window.scrollY || window.pageYOffset;
      const buffer = 80; // px offset for navbar height
      if (home && services && about) {
        const homeTop = home.offsetTop - buffer;
        const servicesTop = services.offsetTop - buffer;
        const aboutTop = about.offsetTop - buffer;
        const aboutBottom = aboutTop + about.offsetHeight;
        if (scrollY >= aboutTop) {
          setActiveSection('about');
        } else if (scrollY >= servicesTop) {
          setActiveSection('services');
        } else {
          setActiveSection('home');
        }
      }
    }
    window.addEventListener('scroll', onScroll);
    scrollListenerRef.current = onScroll;
    onScroll();
    return () => {
      if (scrollListenerRef.current) {
        window.removeEventListener('scroll', scrollListenerRef.current);
        scrollListenerRef.current = null;
      }
    };
  }, [location.pathname]);

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
            <button className={`nav-link${(location.pathname === '/' && activeSection === 'home') ? ' active' : ''}`} onClick={() => handleScrollNav('home')}>Home</button>
            <button className={`nav-link${(location.pathname === '/' && activeSection === 'services') ? ' active' : ''}`} onClick={() => handleScrollNav('services')}>Services</button>
            <button className={`nav-link${(location.pathname === '/' && activeSection === 'about') ? ' active' : ''}`} onClick={() => handleScrollNav('about')}>About Us</button>
            <button className={`nav-link${location.pathname === '/products' ? ' active' : ''}`} onClick={() => handleRoute('/products')}>Products</button>
          </div>
          {/* Centered brand/logo */}
          <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 64, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <span style={{ fontWeight: 'bold', fontSize: '1.3rem', letterSpacing: 1, background: '#fff', padding: '0 1rem', pointerEvents: 'auto' }}>RESET CORP.</span>
          </div>
          {/* Right links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flex: 1, justifyContent: 'flex-end' }}>
            <button className={`nav-link${location.pathname === '/contact' ? ' active' : ''}`} onClick={() => handleRoute('/contact')}>Contacts</button>
            {user ? (
              <>
                <button onClick={() => handleRoute('/profile')} style={{ background: 'none', border: '1px solid #222', color: '#222', borderRadius: '1.5rem', padding: '0.5rem 1.5rem', fontWeight: 500, cursor: 'pointer', fontSize: '1rem', minWidth: 80 }}>Profile</button>
                <button onClick={handleLogout} style={{ background: '#f44336', color: '#fff', border: 'none', borderRadius: '1.5rem', padding: '0.5rem 1.5rem', fontWeight: 500, cursor: 'pointer', fontSize: '1rem', minWidth: 80 }}>Logout</button>
              </>
            ) : (
              <button onClick={() => handleRoute('/login')} style={{ background: '#000', color: '#fff', border: 'none', borderRadius: '1.5rem', padding: '0.5rem 1.5rem', fontWeight: 500, cursor: 'pointer', fontSize: '1rem', minWidth: 80 }}>Login</button>
            )}
            <button onClick={() => handleRoute('/cart')} style={{ background: 'none', border: 'none', color: '#222', fontSize: '1.5rem', position: 'relative', cursor: 'pointer', minWidth: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '1.6rem', verticalAlign: 'middle' }}>shopping_cart</span>
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
          <span className="material-symbols-outlined" style={{ fontSize: '1.6rem', verticalAlign: 'middle' }}>shopping_cart</span>
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
        .nav-link {
          position: relative;
          background: none;
          border: none;
          color: #222;
          font-weight: 500;
          cursor: pointer;
          padding: 0.5rem 1.2rem 0.3rem 1.2rem;
          font-size: 1rem;
          min-width: 80px;
          outline: none;
          transition: color 0.18s;
        }
        .nav-link:hover, .nav-link.active {
          color: #0099ff;
        }
        .nav-link::before {
          content: '';
          display: block;
          position: absolute;
          left: 20%;
          right: 20%;
          top: 0;
          height: 3px;
          border-radius: 2px;
          background: transparent;
          transition: background 0.18s;
        }
        .nav-link:hover::before, .nav-link.active::before {
          background: #0099ff;
        }
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined', sans-serif;
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-size: 1.6rem;
          vertical-align: middle;
          color: #222;
          transition: color 0.18s;
        }
        .nav-link:active, .nav-link:focus {
          outline: none;
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 