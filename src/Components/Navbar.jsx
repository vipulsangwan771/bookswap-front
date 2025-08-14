import { NavLink, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import AuthContext from '../AuthContext';
import { Menu, X } from 'lucide-react'; // optional icons for mobile menu

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const navLinkClass = ({ isActive }) =>
    `transition-colors hover:text-blue-200 ${isActive ? 'text-yellow-300 font-semibold' : ''
    }`;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120 }}
      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-lg sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <NavLink
          to="/"
          className="text-2xl font-bold tracking-tight"
          onClick={() => setMobileOpen(false)}
        >
          BookSwap
        </NavLink>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          {user ? (
            <>
              <NavLink to="/profile" className={navLinkClass}>
                Profile ({user.firstName})
              </NavLink>
              <NavLink to="/add-book" className={navLinkClass}>
                Add Book
              </NavLink>
              <button onClick={handleLogout} className="hover:text-blue-200">
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={navLinkClass}>
                Register
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-3 space-y-3 flex flex-col">
          {user ? (
            <>
              <NavLink
                to="/profile"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Profile ({user.firstName})
              </NavLink>
              <NavLink
                to="/add-book"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Add Book
              </NavLink>
              <button
                onClick={handleLogout}
                className="hover:text-blue-200 text-left"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Login
              </NavLink>
              <NavLink
                to="/register"
                className={navLinkClass}
                onClick={() => setMobileOpen(false)}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      )}
    </motion.nav>
  );
};

export default Navbar;
