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
            setReminders(reminders.filter(r => r._id !== id))
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

    if (loading) return <div>Loading...</div>
    if (error) return <div className="error-message">{error}</div>

    return (
        <div className="reminders-list">
            <h2>Your Reminders</h2>
            {reminders.length === 0 ? <div>No reminders found</div> : (
                <ul>
                    {reminders.map(reminder => (
                        <li key={reminder._id}>
                            {editId === reminder._id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editEventId}
                                        onChange={e => setEditEventId(e.target.value)}
                                        placeholder="Event ID"
                                    />
                                    <button onClick={handleUpdate}>Save</button>
                                    <button onClick={() => setEditId(null)}>Cancel</button>
                                </>
                            ) : (
                                <>
                                    <span>{reminder.event?.title || reminder.event}</span>
                                    <button onClick={() => handleEdit(reminder._id, reminder.event?._id || reminder.event)}>Edit</button>
                                    <button onClick={() => handleDelete(reminder._id)}>Delete</button>
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
