const emailjs = require('@emailjs/nodejs');

// Initialize EmailJS with your credentials
emailjs.init({
  publicKey: process.env.EMAILJS_PUBLIC_KEY,
  privateKey: process.env.EMAILJS_PRIVATE_KEY,
});

const sendEventNotification = async (email, event) => {
  try {
    if (!process.env.EMAILJS_SERVICE_ID || !process.env.EMAILJS_TEMPLATE_ID_EVENT) {
      throw new Error("EmailJS service not configured for events");
    }

    const templateParams = {
      to_email: email,
      event_title: event.title,
      event_date: event.date.toDateString(),
      event_address: event.address,
      event_district: event.district,
      event_state: event.state,
      app_name: process.env.APP_NAME || "Vaccination Reminder"
    };
    console.log("called email service")
    const response = await emailjs.send(
      process.env.EMAILJS_SERVICE_ID,
      process.env.EMAILJS_TEMPLATE_ID_EVENT,
      templateParams
    );

    console.log(`Event notification sent to ${email}, response:`, response);
    return true;
  } catch (error) {
    console.error('Failed to send event notification:', error);
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
        event_date: event.date.toDateString(),
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
      if (attempts > maxRetries) {
        return false;
      }
    }
  }
};

module.exports = { sendEventNotification, sendReminderEmail };