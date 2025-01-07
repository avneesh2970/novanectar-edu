import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../assets/nav-logo.png";

const Layout = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

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
    { to: "/session-book", label: "Book" },
  ];

  return (
    <>
      {/* Gradient background container */}
      <div className="fixed top-0 left-0 right-0 h-24 z-40" />

      {/* Header with navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 px-4 py-2">
        <nav className="max-w-6xl mx-auto">
          {/* White container with shadow */}
          <div className="bg-white rounded-lg shadow-[2px_2px_10px_rgba(0,0,0,0.1)] border border-gray-100">
            <div className="flex justify-between items-center px-6 py-3">
              {/* Logo */}
              <motion.div
                className="flex items-center"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <img src={logo} alt="logo" className="w-40" />
              </motion.div>

              {/* Desktop Menu */}
              <div className="hidden md:flex items-center space-x-1">
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

              {/* Hamburger Menu for Mobile */}
              <motion.button
                className="md:hidden text-gray-700 focus:outline-none"
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

            {/* Mobile Menu */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  className="md:hidden"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                >
                  <div className="flex flex-col space-y-1 p-4 border-t border-gray-100">
                    {navItems.map((item) => (
                      <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) =>
                          `px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${
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
