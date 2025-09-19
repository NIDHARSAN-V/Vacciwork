import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser } = useAuth()

  if (!currentUser) {
    return <Navigate to="/login" />
  }

  if (!allowedRoles.includes(currentUser.role)) {
    return <Navigate to={currentUser.role === 'user' ? '/user' : '/incharge'} />
  }

  return children
}

export default ProtectedRoute