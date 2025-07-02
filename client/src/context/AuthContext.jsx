import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  console.log('=== AUTH CONTEXT ===');
  console.log('Current token state:', token ? 'EXISTS' : 'NOT SET');
  console.log('Current user state:', user ? 'EXISTS' : 'NOT SET');

  const fetchUserProfile = async () => {
    if (token) {
      console.log('=== AUTH CONTEXT: GETTING PROFILE ===');
      console.log('Token exists, calling getProfile...');
      try {
        const data = await getProfile();
        console.log('Profile data received:', data);
        setUser(data.user);
        return data;
      } catch (error) {
        console.error('Profile fetch failed:', error);
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
        throw error;
      }
    }
  };

  useEffect(() => {
    fetchUserProfile();
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

  const refreshUser = async () => {
    console.log('=== AUTH CONTEXT: REFRESHING USER ===');
    try {
      await fetchUserProfile();
    } catch (error) {
      console.error('Failed to refresh user:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUserProfile, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
