import EventActions from './EventActions'

const EventCard = ({ event, onSetReminder, showReminderButton }) => {
  const eventDate = new Date(event.date)

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 hover:shadow-lg transition duration-200">
      {/* Title */}
      <h3 className="text-xl font-semibold text-indigo-700 mb-2">
        {event.title}
      </h3>

      {/* Description */}
      {event.description && (
        <p className="text-gray-600 mb-4">{event.description}</p>
      )}

      {/* Details Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-700 mb-4">
        <p>
          <span className="font-medium">📅 Date:</span>{' '}
          {eventDate.toLocaleString()}
        </p>
        <p>
          <span className="font-medium">📍 Address:</span> {event.address}
        </p>
        <p>
          <span className="font-medium">🏢 District:</span> {event.district}
        </p>
        <p>
          <span className="font-medium">🌐 State:</span> {event.state}
        </p>
        <p className="sm:col-span-2">
          <span className="font-medium">👤 Organizer:</span>{' '}
          {event.createdBy?.name || 'N/A'}
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        {/* Reminder Button (User Only) */}
        {showReminderButton && (
          <button
            onClick={() => onSetReminder(event._id)}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition"
          >
            Set Reminder
          </button>
        )}

        {/* Edit/Delete (Incharge Only) */}
        {event.canEdit && (
          <EventActions
            event={event}
            onEventUpdated={event.onEventUpdated}
            onEventDeleted={event.onEventDeleted}
          />
        )}
      </div>
    </div>
  )
}

export default EventCard
