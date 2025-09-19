const express = require('express');
const { createReminder, getUserReminders, deleteReminder } = require('../controllers/reminderController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
    .get(getUserReminders)
    .post(createReminder);

router.route('/:id')
    .patch(require('../controllers/reminderController').updateReminder)
    .delete(deleteReminder);

module.exports = router;