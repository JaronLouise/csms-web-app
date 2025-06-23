import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px', textAlign: 'center' }}>
      <section style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '20px' }}>Welcome to RESET Corp.</h1>
        <p style={{ fontSize: '1.1rem', marginBottom: '10px', color: '#666' }}>Renewable Energy and Sustainable Emerging Technologies Corporation</p>
        <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
          Your trusted partner for renewable energy solutions and sustainable emerging technologies. Browse our innovative products and professional services!
        </p>
        <Link to="/products">
          <button style={{ padding: '15px 40px', fontSize: '1.1rem', background: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '15px' }}>
            Shop Now
          </button>
        </Link>
        <Link to="/register">
          <button style={{ padding: '15px 40px', fontSize: '1.1rem', background: '#28a745', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', marginRight: '15px' }}>
            Register
          </button>
        </Link>
        <Link to="/login">
          <button style={{ padding: '15px 40px', fontSize: '1.1rem', background: '#6c757d', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>
            Login
          </button>
        </Link>
      </section>
      <section style={{ marginBottom: '40px' }}>
        <h2>Why Choose RESET Corp.?</h2>
        <ul style={{ listStyle: 'none', padding: 0, fontSize: '1.1rem', margin: '20px 0' }}>
          <li>🌞 Renewable energy products and solutions</li>
          <li>🛒 Easy online shopping and customization</li>
          <li>🔒 Secure checkout and order tracking</li>
          <li>💬 Responsive support and expert advice</li>
        </ul>
      </section>
      <footer style={{ marginTop: '60px', color: '#888' }}>
        <p>Made with ❤️ for renewable energy and sustainable technologies</p>
      </footer>
    </div>
  );
};

export default Home; 