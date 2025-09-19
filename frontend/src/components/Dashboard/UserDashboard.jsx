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
      alert('✅ Reminder set successfully! You will receive daily emails about this event.')
    } catch (error) {
      alert(error.response?.data?.message || '❌ Failed to set reminder')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-medium text-gray-600 animate-pulse">
          Loading events...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="p-4 text-red-700 bg-red-100 border border-red-300 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Vaccination Events in Your Area
      </h1>

      <div className="bg-white shadow-md rounded-lg border p-4">
        {events.length > 0 ? (
          <EventList
            events={events}
            onSetReminder={handleSetReminder}
            showReminderButton={true}
          />
        ) : (
          <p className="text-gray-500 italic">No vaccination events available in your area.</p>
        )}
      </div>
    </div>
  )
}

export default UserDashboard
