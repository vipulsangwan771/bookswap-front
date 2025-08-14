import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';

const AddBook = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    condition: 'new',
    image: null,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.author.trim()) newErrors.author = 'Author is required';
    if (!formData.image) newErrors.image = 'Image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const data = new FormData();
    data.append('title', formData.title);
    data.append('author', formData.author);
    data.append('condition', formData.condition);
    data.append('image', formData.image);
    console.log('FormData:', formData);
    try {
      await axios.post('/books', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Book added successfully');
      navigate('/profile');
    } catch (err) {
      console.error('AddBook error:', err.response?.data);
      toast.error(err.response?.data?.errors?.[0]?.msg || err.response?.data?.error || 'Failed to add book');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 max-w-lg"
    >
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Add a New Book</h1>
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-xl">
        <div className="mb-5">
          <input
            name="title"
            placeholder="Book Title"
            value={formData.title}
            onChange={handleChange}
            className={`border p-3 w-full rounded-lg ${errors.title ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
        </div>
        <div className="mb-5">
          <input
            name="author"
            placeholder="Author"
            value={formData.author}
            onChange={handleChange}
            className={`border p-3 w-full rounded-lg ${errors.author ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
        </div>
        <div className="mb-5">
          <select
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            className="border p-3 w-full rounded-lg border-gray-300"
          >
            <option value="new">New</option>
            <option value="like-new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>
        <div className="mb-5">
          <input
            type="file"
            name="image"
            accept="image/jpeg,image/jpg,image/png"
            onChange={handleChange}
            className={`border p-3 w-full rounded-lg ${errors.image ? 'border-red-500' : 'border-gray-300'}`}
          />
          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-3 w-full rounded-lg hover:from-blue-700 hover:to-indigo-700"
        >
          Add Book
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddBook;