import API from '../../services/api'
import { useState } from 'react'

const EventActions = ({ event, onEventUpdated, onEventDeleted }) => {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    title: event.title,
    description: event.description,
    address: event.address,
    district: event.district,
    state: event.state,
    date: event.date
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleUpdate = async () => {
    try {
      await API.patch(`/events/${event._id}`, form)
      setEditing(false)
      onEventUpdated && onEventUpdated()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update event')
    }
  }

  const handleDelete = async () => {
    if (!window.confirm('Delete this event?')) return
    try {
      await API.delete(`/events/${event._id}`)
      onEventDeleted && onEventDeleted()
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete event')
    }
  }

  // Normal Mode → Edit/Delete buttons
  if (!editing) {
    return (
      <div className="flex gap-3 mt-3">
        <button
          onClick={() => setEditing(true)}
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    )
  }

  // Edit Mode → Form
  return (
    <div className="mt-4 p-4 border border-gray-300 rounded-lg bg-gray-50 shadow-sm space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Event Title"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
        <input
          name="district"
          value={form.district}
          onChange={handleChange}
          placeholder="District"
          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        rows="2"
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />

      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />

      <input
        name="state"
        value={form.state}
        onChange={handleChange}
        placeholder="State"
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />

      <input
        name="date"
        type="datetime-local"
        value={form.date}
        onChange={handleChange}
        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
      />

      <div className="flex justify-end gap-3 pt-2">
        <button
          onClick={handleUpdate}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
        >
          Save
        </button>
        <button
          onClick={() => setEditing(false)}
          className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default EventActions
