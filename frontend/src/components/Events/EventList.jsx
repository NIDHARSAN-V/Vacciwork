import EventCard from './EventCard'

const EventList = ({ events, onSetReminder, showReminderButton = false, onEventUpdated, onEventDeleted }) => {
  if (events.length === 0) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        🚫 No events found
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {events.map((event) => (
        <EventCard
          key={event._id}
          event={{ ...event, onEventUpdated, onEventDeleted }}
          onSetReminder={onSetReminder}
          showReminderButton={showReminderButton}
        />
      ))}
    </div>
  )
}

export default EventList
