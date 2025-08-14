import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { toast } from 'react-toastify';

const AuthContext = createContext();
// In AuthContext.js, add at the top of the file
axios.defaults.baseURL = 'http://localhost:5000';
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 < Date.now()) {
          logout();
        } else {
          if (storedUser) {
            setUser(JSON.parse(storedUser)); // ✅ Restore full user
          }
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
      } catch (err) {
        console.error('Token decode error:', err);
        logout();
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const res = await axios.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setUser(res.data.user);
      axios.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
      toast.success('Logged in successfully!');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      await axios.post('/auth/register', userData);
      toast.success('Registered successfully! Please login.');
    } catch (err) {
      toast.error(err.response?.data?.errors?.[0]?.msg || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
    localStorage.removeItem('user');
    toast.info('Logged out successfully');
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;