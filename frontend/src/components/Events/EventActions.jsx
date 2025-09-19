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

    const handleChange = e => {
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

    if (!editing) {
        return (
            <div className="event-actions">
                <button onClick={() => setEditing(true)}>Edit</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        )
    }

    return (
        <div className="event-edit-form">
            <input name="title" value={form.title} onChange={handleChange} />
            <input name="description" value={form.description} onChange={handleChange} />
            <input name="address" value={form.address} onChange={handleChange} />
            <input name="district" value={form.district} onChange={handleChange} />
            <input name="state" value={form.state} onChange={handleChange} />
            <input name="date" type="datetime-local" value={form.date} onChange={handleChange} />
            <button onClick={handleUpdate}>Save</button>
            <button onClick={() => setEditing(false)}>Cancel</button>
        </div>
    )
}

export default EventActions
