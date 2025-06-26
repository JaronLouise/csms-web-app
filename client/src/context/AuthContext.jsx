import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  console.log('=== AUTH CONTEXT ===');
  console.log('Current token state:', token ? 'EXISTS' : 'NOT SET');
  console.log('Current user state:', user ? 'EXISTS' : 'NOT SET');

  useEffect(() => {
    if (token) {
      console.log('=== AUTH CONTEXT: GETTING PROFILE ===');
      console.log('Token exists, calling getProfile...');
      getProfile()
        .then(data => {
          console.log('Profile data received:', data);
          setUser(data.user);
        })
        .catch((error) => {
          console.error('Profile fetch failed:', error);
          setUser(null);
          setToken('');
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const login = (data) => {
    console.log('=== AUTH CONTEXT: LOGIN ===');
    console.log('Login data received:', data);
    console.log('Token from login:', data.token);
    
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
    
    console.log('Token stored in localStorage:', localStorage.getItem('token'));
  };

  const logout = () => {
    console.log('=== AUTH CONTEXT: LOGOUT ===');
    setToken('');
    localStorage.removeItem('token');
    setUser(null);
  };

  const updateUserProfile = async (profileData) => {
    try {
      const updatedUser = await updateProfile(profileData);
      setUser(updatedUser.user);
      return updatedUser;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUserProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
