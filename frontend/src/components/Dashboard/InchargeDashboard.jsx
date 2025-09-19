import { useState, useEffect } from 'react'
import API from '../../services/api'
import CreateEvent from '../Events/CreateEvent'
import EventList from '../Events/EventList'

const InchargeDashboard = () => {
  const [events, setEvents] = useState([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await API.get('/events')
      setEvents(response.data.data.events)
    } catch (error) {
      setError('Failed to fetch events')
    } finally {
      setLoading(false)
    }
  }

  const handleEventCreated = () => {
    setShowCreateForm(false)
    fetchEvents()
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="dashboard">
      <h1>Vaccination Incharge Dashboard</h1>
      
      <button 
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="btn-primary"
      >
        {showCreateForm ? 'Cancel' : 'Create New Event'}
      </button>
      
      {showCreateForm && (
        <CreateEvent onEventCreated={handleEventCreated} />
      )}
      
      <h2>Your Events</h2>
      <EventList events={events} />
    </div>
  )
}

export default InchargeDashboard