const Reminder = require('../models/Reminder');
const Event = require('../models/Event');

exports.createReminder = async (req, res) => {
  try {
    const { eventId } = req.body;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if reminder already exists
    const existingReminder = await Reminder.findOne({
      user: req.user.id,
      event: eventId
    });

    if (existingReminder) {
      return res.status(400).json({ message: 'Reminder already set for this event' });
    }

    const reminder = await Reminder.create({
      user: req.user.id,
      event: eventId
    });

    res.status(201).json({
      status: 'success',
      data: {
        reminder
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserReminders = async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id })
      .populate('event')
      .populate('user', 'name email');

    res.status(200).json({
      status: 'success',
      results: reminders.length,
      data: {
        reminders
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    // Check if the reminder belongs to the user
    if (reminder.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this reminder' });
    }
    // Only allow updating event for now
    const { eventId } = req.body;
    if (eventId) {
      const event = await Event.findById(eventId);
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      reminder.event = eventId;
    }
    await reminder.save();
    res.status(200).json({
      status: 'success',
      data: { reminder }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteReminder = async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    // Check if the reminder belongs to the user
    if (reminder.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this reminder' });
    }

    await Reminder.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};