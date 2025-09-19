const cron = require('node-cron');
const Reminder = require('../models/Reminder');
const Event = require('../models/Event');
const User = require('../models/User');
const { sendReminderEmail } = require('./emailService');

// Run every day at 8 AM
cron.schedule('0 8 * * *', async () => {
  try {
    console.log('Running daily reminder job...');
    
    // Get all active reminders
    const reminders = await Reminder.find({ active: true })
      .populate('user')
      .populate('event');
    
    const today = new Date();
    
    for (const reminder of reminders) {
      const eventDate = new Date(reminder.event.date);
      const daysUntilEvent = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
      
      // Only send reminders for events happening in the next 7 days
      if (daysUntilEvent >= 0 && daysUntilEvent <= 7) {
        await sendReminderEmail(reminder.user.email, reminder.event);
      }
      
      // Deactivate reminders for past events
      if (daysUntilEvent < 0) {
        reminder.active = false;
        await reminder.save();
      }
    }
    
    console.log('Daily reminder job completed');
  } catch (error) {
    console.error('Error in daily reminder job:', error);
  }
});