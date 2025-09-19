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
      district: district,
      state: state 
    });


    console.log("Users to notify:******** ", users.length);


    
    for (const user of users) {
      await sendEventNotification(user.email, event);
    }
    
    res.status(201).json({
      status: 'success',
      data: {
        event
      }
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
      data: {
        events
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name');
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({
      status: 'success',
      data: {
        event
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};