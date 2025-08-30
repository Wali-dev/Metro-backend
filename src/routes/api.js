const express = require('express');
const router = express.Router();
const usersRoute = require('./usersRoute');
const instructionsRoute = require('./instructionsRoute');
const stepsRoute = require('./stepRoute');
const subscriptionsRoute = require('./subscriptionsRoute');
const analyticsRoute = require('./analyticsRoute');

router.get("", (req, res) => {
    res.send("This is the start of an epic journey.")
})


router.use('/user', usersRoute);
router.use('/instruction', instructionsRoute);
router.use('/step', stepsRoute);
router.use('/subscription', subscriptionsRoute);
router.use('/analytics', analyticsRoute);


module.exports = router
