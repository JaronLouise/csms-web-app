import { createContext, useContext, useState, useEffect } from 'react';
import { getProfile, updateProfile } from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  useEffect(() => {
    if (token) {
      getProfile(token)
        .then(data => setUser(data))
        .catch(() => {
          setUser(null);
          setToken('');
          localStorage.removeItem('token');
        });
    }
  }, [token]);

  const login = (data) => {
    setToken(data.token);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
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
