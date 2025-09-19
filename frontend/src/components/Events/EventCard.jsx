const EventCard = ({ event, onSetReminder, showReminderButton }) => {
  const eventDate = new Date(event.date)
  
  return (
    <div className="event-card">
      <h3>{event.title}</h3>
      <p>{event.description}</p>
      <div className="event-details">
        <p><strong>Date:</strong> {eventDate.toLocaleString()}</p>
        <p><strong>Address:</strong> {event.address}</p>
        <p><strong>District:</strong> {event.district}</p>
        <p><strong>State:</strong> {event.state}</p>
        <p><strong>Organizer:</strong> {event.createdBy?.name}</p>
      </div>
      {showReminderButton && (
        <button 
          onClick={() => onSetReminder(event._id)}
          className="btn-secondary"
        >
          Set Reminder
        </button>
      )}
    </div>
  )
}

export default EventCard