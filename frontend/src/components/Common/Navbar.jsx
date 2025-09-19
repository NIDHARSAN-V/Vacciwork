import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="bg-indigo-600 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link to="/" className="text-white text-lg font-bold tracking-wide hover:text-gray-200">
            Vaccination Reminder
          </Link>

          {/* Links */}
          <div className="flex items-center space-x-6">
            {currentUser ? (
              <>
                <span className="text-white hidden sm:inline">
                  Welcome, <span className="font-semibold">{currentUser.name}</span>
                </span>
                <Link
                  to={currentUser.role === 'user' ? '/user' : '/incharge'}
                  className="text-white hover:text-gray-200 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-white text-indigo-600 px-3 py-1 rounded-md font-medium hover:bg-gray-100 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-gray-200 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-indigo-600 px-3 py-1 rounded-md font-medium hover:bg-gray-100 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
