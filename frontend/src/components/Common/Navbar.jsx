import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          Vaccination Reminder
        </Link>
        
        <div className="nav-links">
          {currentUser ? (
            <>
              <span>Welcome, {currentUser.name}</span>
              <Link to={currentUser.role === 'user' ? '/user' : '/incharge'}>
                Dashboard
              </Link>
              <button onClick={handleLogout} className="btn-link">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar