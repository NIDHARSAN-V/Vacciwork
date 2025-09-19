import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Login from './components/Auth/Login'
import Register from './components/Auth/Register'
import UserDashboard from './components/Dashboard/UserDashboard'
import InchargeDashboard from './components/Dashboard/InchargeDashboard'
import ProtectedRoute from './components/Common/ProtectedRoute'
import Navbar from './components/Common/Navbar'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/user" element={
              <ProtectedRoute allowedRoles={['user']}>
                <UserDashboard />
              </ProtectedRoute>
            } />
            <Route path="/incharge" element={
              <ProtectedRoute allowedRoles={['incharge']}>
                <InchargeDashboard />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App