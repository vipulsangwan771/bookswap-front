import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AuthContext from '../AuthContext';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = 'Invalid email';
    if (!formData.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      // Error handled by toast in AuthContext
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 max-w-lg"
    >
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Login to BookSwap</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="mb-5">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className={`border p-3 w-full rounded-lg ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>
        <div className="mb-5">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className={`border p-3 w-full rounded-lg ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 w-full rounded-lg hover:from-blue-700 hover:to-indigo-700"
        >
          Login
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Login;