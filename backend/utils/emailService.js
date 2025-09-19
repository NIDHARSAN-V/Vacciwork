const emailjs = require('@emailjs/nodejs');

emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
});

const sendEventNotification = async (email, event, action = 'create') => {
  try {
    if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID_EVENT) {
      throw new Error("EmailJS service not configured for events");
    }

    let actionText = "New Event Created";
    if (action === 'update') actionText = "Event Updated";
    if (action === 'delete') actionText = "Event Cancelled";

    const templateParams = {
      to_email: email,
      event_action: actionText,
      event_title: event.title,
      event_date: event.date ? new Date(event.date).toDateString() : '',
      event_address: event.address || '',
      event_district: event.district || '',
      event_state: event.state || '',
      app_name: process.env.APP_NAME || "Vaccination Reminder"
    };

    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID_EVENT,
      templateParams
    );

    console.log(`Event ${action} notification sent to ${email}, response:`, response);
    return true;
  } catch (error) {
    console.error(`Failed to send ${action} event notification:`, error);
    return false;
  }
};

const sendReminderEmail = async (email, event, maxRetries = 2) => {
  let attempts = 0;
  while (attempts <= maxRetries) {
    try {
      if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID_REMINDER) {
        throw new Error("EmailJS service not configured for reminders");
      }

      const templateParams = {
        to_email: email,
        event_title: event.title,
        event_date: new Date(event.date).toDateString(),
        event_address: event.address,
        event_district: event.district,
        event_state: event.state,
        app_name: process.env.APP_NAME || "Vaccination Reminder"
      };

      const response = await emailjs.send(
        process.env.EMAILJS_SERVICE_ID,
        process.env.EMAILJS_TEMPLATE_ID_REMINDER,
        templateParams
      );

      console.log(`Reminder email sent to ${email}, response:`, response);
      return true;
    } catch (error) {
      attempts++;
      console.error(`Attempt ${attempts} failed to send reminder:`, error);
      if (attempts > maxRetries) return false;
    }
  }
};

module.exports = { sendEventNotification, sendReminderEmail };
