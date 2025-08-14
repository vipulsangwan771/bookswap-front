import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../AuthContext';
import backendURL from "../config";

const BookDetails = () => {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await axios.get(`/books/${id}`);
        setBook(res.data);
      } catch (err) {
        toast.error('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [id]);

  const handleRequest = async () => {
    try {
      await axios.post('/requests', { bookId: id });
      toast.success('Request sent successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send request');
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center p-6"
      >
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
      </motion.div>
    );
  }

  if (!book) return <div className="text-center p-6 text-gray-600">Book not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 max-w-2xl"
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl">
        <img
           src={`${backendURL}/uploads/${book.image}`}
          alt={book.title}
          className="w-full h-80 object-cover mb-6 rounded-lg"
        />
        <h1 className="text-3xl font-bold mb-3 text-gray-800">{book.title}</h1>
        <p className="text-gray-700 mb-2">Author: {book.author}</p>
        <p className="text-gray-700 mb-2">Condition: <span className="capitalize">{book.condition}</span></p>
        <p className="text-gray-700 mb-6">Owner: {book.owner.firstName} ({book.owner.email})</p>
        {user && book.owner._id !== user.id && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleRequest}
            className="bg-gradient-to-r from-green-600 to-teal-600 text-white p-3 w-full rounded-lg hover:from-green-700 hover:to-teal-700"
          >
            Request Book
          </motion.button>
        )}
      </div>
    </motion.div>
  );
};

export default BookDetails;