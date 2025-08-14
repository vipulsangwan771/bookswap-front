import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import { dummyBooks } from '../dummyData';
import backendURL from "../config";

const Home = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get(`/books?page=${page}&limit=8`);
        setBooks(res.data.books);
        setTotalPages(res.data.pages);
      } catch (err) {
        toast.error('Failed to load books, showing sample data');
        setBooks(dummyBooks);
      } finally {
        setLoading(false);
      }
    };
    fetchBooks();
  }, [page]);

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6"
    >
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">Discover Books to Swap</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map(book => (
          <motion.div
            key={book._id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white border rounded-lg shadow-lg overflow-hidden hover:shadow-xl"
          >
            <img  src={`${backendURL}/uploads/${book.image}`} alt={book.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">{book.title}</h2>
              <p className="text-gray-600">Author: {book.author}</p>
              <p className="text-gray-600">Condition: {book.condition}</p>
              <Link
                to={`/book/${book._id}`}
                className="text-blue-600 hover:underline mt-3 block font-medium"
              >
                View Details
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="flex justify-center mt-8 space-x-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage(prev => Math.max(prev - 1, 1))}
          disabled={page === 1}
          className="bg-blue-600 text-white p-2 rounded-lg disabled:bg-gray-400"
        >
          Previous
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setPage(prev => prev + 1)}
          disabled={page === totalPages}
          className="bg-blue-600 text-white p-2 rounded-lg disabled:bg-gray-400"
        >
          Next
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Home;