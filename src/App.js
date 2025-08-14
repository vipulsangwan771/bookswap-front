
import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Profile from './Pages/Profile';
import AddBook from './Pages/AddBook';
import BookDetails from './Pages/BookDetails';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function App() {
  return (
    <>
    <Router>
      <Navbar />
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/add-book" element={<AddBook />} />
          <Route path="/book/:id" element={<BookDetails />} />
        </Routes>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </Router>
    </>
  );
}

export default App;
