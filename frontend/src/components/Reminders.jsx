import { useState, useEffect } from 'react'
import API from '../services/api'

const Reminders = () => {
  const [reminders, setReminders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editId, setEditId] = useState(null)
  const [editEventId, setEditEventId] = useState('')

  useEffect(() => {
    fetchReminders()
  }, [])

  const fetchReminders = async () => {
    try {
      const response = await API.get('/reminders')
      setReminders(response.data.data.reminders)
    } catch (error) {
      setError('Failed to fetch reminders')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this reminder?')) return
    try {
      await API.delete(`/reminders/${id}`)
      setReminders(reminders.filter((r) => r._id !== id))
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete reminder')
    }
  }

  const handleEdit = (id, eventId) => {
    setEditId(id)
    setEditEventId(eventId)
  }

  const handleUpdate = async () => {
    try {
      await API.patch(`/reminders/${editId}`, { eventId: editEventId })
      setEditId(null)
      setEditEventId('')
      fetchReminders()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update reminder')
    }
  }

  if (loading) return <div className="text-center py-10 text-gray-500">⏳ Loading...</div>
  if (error) return <div className="text-red-500 text-center py-4">{error}</div>

  return (
    <div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-lg rounded-2xl">
      <h2 className="text-2xl font-bold text-gray-700 mb-6">📌 Your Reminders</h2>

      {reminders.length === 0 ? (
        <div className="text-gray-500 text-center py-6">No reminders found</div>
      ) : (
        <ul className="space-y-4">
          {reminders.map((reminder) => (
            <li
              key={reminder._id}
              className="flex items-center justify-between bg-gray-50 p-4 rounded-xl shadow-sm"
            >
              {editId === reminder._id ? (
                <div className="flex items-center gap-2 w-full">
                  <input
                    type="text"
                    value={editEventId}
                    onChange={(e) => setEditEventId(e.target.value)}
                    placeholder="Event ID"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-400"
                  />
                  <button
                    onClick={handleUpdate}
                    className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-gray-800 font-medium">
                    {reminder.event?.title || reminder.event}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        handleEdit(reminder._id, reminder.event?._id || reminder.event)
                      }
                      className="px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(reminder._id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Reminders
