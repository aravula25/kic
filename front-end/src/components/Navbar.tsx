import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUserStore } from '@/store/useUserStore';
import { HiMenu, HiX } from 'react-icons/hi';

export default function Navbar() {
  const { user, logout } = useUserStore();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Links visible based on login
  const links = [
    { to: '/', label: 'Feed', visible: true },
    { to: '/create', label: 'Create Post', visible: !!user },
    { to: '/profile', label: 'Profile', visible: !!user },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <h1 className="text-xl font-bold text-green-600">Keep India Clean</h1>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4 items-center">
            {links.map(
              (link) =>
                link.visible && (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`font-medium ${
                      location.pathname === link.to
                        ? 'text-green-600'
                        : 'text-gray-600 hover:text-green-600'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
            )}

            {!user && (
              <>
                <Link
                  to="/login"
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700"
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <button
                onClick={logout}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="text-gray-700 hover:text-green-600 focus:outline-none"
            >
              {mobileOpen ? <HiX className="w-6 h-6" /> : <HiMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white shadow-md">
          <div className="px-2 pt-2 pb-3 space-y-1 flex flex-col">
            {links.map(
              (link) =>
                link.visible && (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`block px-3 py-2 rounded-md font-medium ${
                      location.pathname === link.to
                        ? 'text-green-600'
                        : 'text-gray-700 hover:text-green-600'
                    }`}
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                )
            )}

            {!user && (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block px-3 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </Link>
              </>
            )}

            {user && (
              <button
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="block w-full text-left px-3 py-2 rounded-md bg-red-500 text-white hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}