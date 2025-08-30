const express = require('express');
const router = express.Router();
const subscriptionController = require('../controlllers/subscriptionController');

// Create a subscription
router.post('/', subscriptionController.createSubscription);

// Get all subscriptions (admin usage)
router.get('/', subscriptionController.getAllSubscriptions);

router.get('/user/:userId', subscriptionController.getSubscriptionByUser);

// Update subscription (e.g. upgrade/downgrade/cancel)
router.put('/:id', subscriptionController.updateSubscription);

// Delete subscription (rarely used)
router.delete('/:id', subscriptionController.deleteSubscription);

module.exports = router;
