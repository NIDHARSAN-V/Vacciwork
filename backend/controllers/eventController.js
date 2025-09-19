const Event = require('../models/Event');
const User = require('../models/User');
const { sendEventNotification } = require('../utils/emailService');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, address, district, state, date } = req.body;

    const event = await Event.create({
      title,
      description,
      address,
      district,
      state,
      date,
      createdBy: req.user.id
    });

    console.log("Event created: ", event);

    // Send notifications to all users in the same district and state
    const users = await User.find({
      role: 'user',
      district,
      state
    });

    for (const user of users) {
      await sendEventNotification(user.email, event, 'create');
    }

    res.status(201).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Only creator can edit
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to edit this event' });
    }

    const { title, description, address, district, state, date } = req.body;
    if (title) event.title = title;
    if (description) event.description = description;
    if (address) event.address = address;
    if (district) event.district = district;
    if (state) event.state = state;
    if (date) event.date = date;

    await event.save();

    // Notify users in that district/state
    const users = await User.find({
      role: 'user',
      district: event.district,
      state: event.state
    });

    for (const user of users) {
      await sendEventNotification(user.email, event, 'update');
    }

    res.status(200).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    // Only creator can delete
    if (event.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);

    // Notify users in that district/state
    const users = await User.find({
      role: 'user',
      district: event.district,
      state: event.state
    });

    for (const user of users) {
      await sendEventNotification(user.email, event, 'delete');
    }

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const { district, state } = req.user;
    const events = await Event.find({ district, state }).populate('createdBy', 'name');
    res.status(200).json({
      status: 'success',
      results: events.length,
      data: { events }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name');
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.status(200).json({
      status: 'success',
      data: { event }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
