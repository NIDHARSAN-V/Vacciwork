import { useState, useEffect } from 'react'
import API from '../../services/api'
import EventList from '../Events/EventList'

const UserDashboard = () => {
  const [events, setEvents] = useState([])
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

  const handleSetReminder = async (eventId) => {
    try {
      await API.post('/reminders', { eventId })
      alert('Reminder set successfully! You will receive daily emails about this event.')
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to set reminder')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div className="error-message">{error}</div>

  return (
    <div className="dashboard">
      <h1>Vaccination Events in Your Area</h1>
      <EventList 
        events={events} 
        onSetReminder={handleSetReminder}
        showReminderButton={true}
      />
    </div>
  )
}

export default UserDashboard