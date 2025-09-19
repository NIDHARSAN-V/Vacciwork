import EventCard from './EventCard'

const EventList = ({ events, onSetReminder, showReminderButton = false }) => {
  if (events.length === 0) {
    return <div>No events found</div>
  }

  return (
    <div className="event-list">
      {events.map(event => (
        <EventCard 
          key={event._id} 
          event={event} 
          onSetReminder={onSetReminder}
          showReminderButton={showReminderButton}
        />
      ))}
    </div>
  )
}

export default EventList