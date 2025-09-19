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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg font-medium text-gray-600 animate-pulse">
          Loading...
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
        Vaccination Incharge Dashboard
      </h1>

      {/* Toggle Create Event */}
      <button
        onClick={() => setShowCreateForm(!showCreateForm)}
        className="mb-6 px-5 py-2 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
      >
        {showCreateForm ? 'Cancel' : 'Create New Event'}
      </button>

      {/* Event Form */}
      {showCreateForm && (
        <div className="mb-8 p-6 bg-white shadow-md rounded-lg border">
          <CreateEvent onEventCreated={handleEventCreated} />
        </div>
      )}

      {/* Event List */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Your Events</h2>
      <div className="bg-white shadow-md rounded-lg border p-4">
        {events.length > 0 ? (
          <EventList events={events} />
        ) : (
          <p className="text-gray-500 italic">No events created yet.</p>
        )}
      </div>
    </div>
  )
}

export default InchargeDashboard
