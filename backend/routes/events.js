const express = require('express');
const { createEvent, getEvents, getEvent } = require('../controllers/eventController');
const { protect, restrictTo } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router.route('/')
  .get(getEvents)
  .post(restrictTo('incharge'), createEvent);

router.route('/:id')
  .get(getEvent);

module.exports = router;