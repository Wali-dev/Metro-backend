const { Subscription } = require('../models/subscriptionModel');


exports.createSubscription = async (req, res) => {
    try {
        const subscription = new Subscription(req.body);
        await subscription.save();

        return res.status(201).json({
            success: true,
            message: 'Subscription created successfully',
            subscription,
        });
    } catch (err) {
        console.error('Error creating subscription:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            message: 'Subscriptions fetched successfully',
            subscriptions,
        });
    } catch (err) {
        console.error('Error fetching subscriptions:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.getSubscriptionByUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const subscription = await Subscription.findOne({ user_id: userId })
            .sort({ createdAt: -1 });

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'No subscription found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Subscription fetched successfully',
            subscription,
        });
    } catch (err) {
        console.error('Error fetching subscription:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// Update subscription (change plan, status, or period)
exports.updateSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findByIdAndUpdate(
            id,
            { $set: req.body },
            { new: true }
        );

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Subscription updated successfully',
            subscription,
        });
    } catch (err) {
        console.error('Error updating subscription:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findByIdAndDelete(id);

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Subscription deleted successfully',
        });
    } catch (err) {
        console.error('Error deleting subscription:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
