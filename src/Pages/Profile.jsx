import { useEffect, useState, useContext } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { toast } from 'react-toastify';
import AuthContext from '../AuthContext';

import backendURL from "../config";

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [myBooks, setMyBooks] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      toast.error('Please log in to view your profile');
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const [booksRes, myRequestsRes, incomingRequestsRes] = await Promise.all([
          axios.get('/books/my', config),
          axios.get('/requests/my', config),
          axios.get('/requests/incoming', config),
        ]);
        setMyBooks(booksRes.data);
        setMyRequests(myRequestsRes.data);
        setIncomingRequests(incomingRequestsRes.data);
      } catch (err) { // Debug log
        toast.error(err.response?.data?.error || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/books/${id}`);
      setMyBooks(myBooks.filter(book => book._id !== id));
      toast.success('Book deleted successfully');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to delete book');
    }
  };

  const handleUpdateRequest = async (id, status) => {
    try {
      await axios.put(`/requests/${id}`, { status });
      const res = await axios.get('/requests/incoming');
      setIncomingRequests(res.data);
      toast.success(`Request ${status}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to update request');
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

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto p-6 text-center text-gray-600"
      >
        Please log in to view your profile.
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
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">My Profile</h1>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Books</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
        {myBooks.length === 0 ? (
          <p className="text-gray-600 col-span-full text-center">No books added yet.</p>
        ) : (
          myBooks.map(book => (
            <motion.div
              key={book._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white border rounded-lg shadow-lg overflow-hidden hover:shadow-xl"
            >
              {book?.image && (
                <img
                  src={`${backendURL}/uploads/${book.image}`}
                  alt={book.title}
                  className="w-full h-48 object-cover"
                />
              )}


              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-800">{book.title}</h3>
                <p className="text-gray-600">Author: {book.author}</p>
                <p className="text-gray-600">Condition: {book.condition}</p>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDelete(book._id)}
                  className="bg-red-600 text-white p-2 mt-3 w-full rounded-lg hover:bg-red-700"
                >
                  Delete
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700">My Requests</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
        {myRequests.length === 0 ? (
          <p className="text-gray-600">No requests sent yet.</p>
        ) : (
          <ul>
            {myRequests.map(req => (
              <motion.li
                key={req._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border-b py-3 last:border-b-0 flex justify-between items-center"
              >
                <span>{req.book?.title} - Status: <span className={`capitalize ${req.status === 'accepted' ? 'text-green-600' : req.status === 'declined' ? 'text-red-600' : 'text-yellow-600'}`}>{req.status}</span></span>
              </motion.li>
            ))}
          </ul>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Incoming Requests</h2>
      <div className="bg-white p-6 rounded-lg shadow-lg">
        {incomingRequests.length === 0 ? (
          <p className="text-gray-600">No incoming requests.</p>
        ) : (
          <ul>
            {incomingRequests.map(req => (
              <motion.li
                key={req._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="border-b py-3 last:border-b-0 flex justify-between items-center"
              >
                <span>{req.requester?.email} wants {req.book?.title} - Status: <span className={`capitalize ${req.status === 'accepted' ? 'text-green-600' : req.status === 'declined' ? 'text-red-600' : 'text-yellow-600'}`}>{req.status}</span></span>
                {req.status === 'pending' && (
                  <div className="space-x-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUpdateRequest(req._id, 'accepted')}
                      className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
                    >
                      Accept
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleUpdateRequest(req._id, 'declined')}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700"
                    >
                      Decline
                    </motion.button>
                  </div>
                )}
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </motion.div>
  );
};

export default Profile;