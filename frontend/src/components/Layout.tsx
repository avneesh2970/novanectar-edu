import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/nav-logo.png";
import { useAuth } from "../hooks/useAuth";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();
  console.log("isAuthenticated: ", isAuthenticated);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  const navItems = [
    { to: "/", label: "Home" },
    { to: "/courses", label: "Courses" },
    { to: "/internships", label: "Internships" },
    { to: "/contact-us", label: "Contact Us" },
    { to: "/about-us", label: "About Us" },
    { to: "/session-book", label: "Books" },
  ];

  return (
    <>
      {/* Gradient background container */}
      <div className="fixed top-0 left-0 right-0 h-24 z-40" />

      {/* Header with navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4">
        <nav className="max-w-6xl mx-auto">
          {/* White container with shadow */}
          <div className="bg-white rounded-lg shadow-[2px_2px_10px_rgba(0,0,0,0.1)] border border-gray-100 px-6 py-3">
            {/* Desktop view */}
            {/* <div className="flex gap-8 items-center px-6 py-3"> */}
            {/* Logo */}

            {/* Desktop Menu */}
            <div className="hidden lg:flex lg:flex-grow items-center justify-between space-x-1">
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src={logo} alt="logo" className="w-40" />
              </motion.div>
              <div className="">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `px-4 py-2 text-base font-medium rounded-md transition-colors duration-200 ${
                        isActive
                          ? "text-blue-600 bg-blue-50"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              {isAuthenticated ? (
                <Link to="/profile">
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
                    alt="profile"
                    className="w-10 h-10"
                  />
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-base font-medium text-blue-600 border border-blue-600 rounded-md transition-colors duration-200 hover:bg-blue-600 hover:text-white"
                  >
                    Sign Up
                  </Link>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-base font-medium text-gray-600 border border-gray-300 rounded-md transition-colors duration-200 hover:bg-gray-300 hover:text-gray-900"
                  >
                    Log In
                  </Link>
                </div>
              )}
            </div>

            {/* Hamburger Menu for Mobile */}
            <div className="flex justify-between items-center">
              <motion.div
                className="lg:hidden flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src={logo} alt="logo" className="w-40" />
              </motion.div>
              <motion.button
                className="lg:hidden text-gray-700 focus:outline-none"
                onClick={toggleMenu}
                whileTap={{ scale: 0.95 }}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <motion.path
                    d={
                      isMenuOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                    variants={{
                      closed: { d: "M4 6h16M4 12h16M4 18h16" },
                      open: { d: "M6 18L18 6M6 6l12 12" },
                    }}
                    initial="closed"
                    animate={isMenuOpen ? "open" : "closed"}
                    transition={{ duration: 0.3 }}
                  />
                </svg>
              </motion.button>
            </div>
            {/* </div> */}

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="lg:hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <div className="flex flex-col items-center space-y-4 p-4 border-t border-gray-100">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `w-full px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ease-in-out transform ${
                            isActive
                              ? "text-blue-700 bg-blue-100 shadow-md"
                              : "text-gray-600 hover:text-blue-700 hover:bg-blue-50 hover:shadow-md"
                          }`
                        }
                      >
                        {item.label}
                      </NavLink>
                    ))}

                    <div className="flex justify-between w-full space-x-4 mt-4">
                      {isAuthenticated ? (
                        <>
                          <button
                            className="px-4 py-2 text-base font-medium rounded-md transition-colors duration-200 text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                            onClick={logout}
                          >
                            LOGOUT
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/signup"
                            className="flex-1 text-center px-6 py-2 text-sm font-semibold rounded-lg 
      bg-blue-500 text-white 
      hover:bg-blue-600 hover:shadow-lg 
      transition-all duration-300 ease-in-out 
      transform hover:-translate-y-1 
      focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
                          >
                            Sign Up
                          </Link>

                          <Link
                            to="/login"
                            className="flex-1 text-center px-6 py-2 text-sm font-semibold rounded-lg 
      border-2 border-gray-400 text-gray-600 
      hover:bg-gray-500 hover:text-white hover:border-transparent hover:shadow-lg 
      transition-all duration-300 ease-in-out 
      transform hover:-translate-y-1 
      focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-75"
                          >
                            Log In
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </nav>
      </header>
      <main className="flex-grow w-full">
        <Outlet />
      </main>
    </>
  );
};

export default Layout;
