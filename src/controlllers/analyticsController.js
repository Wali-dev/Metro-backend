const { Analytics } = require("../models/analyticsModel");

exports.createEvent = async (req, res) => {
    try {
        const { instruction_id, user_id, event_type, step_id } = req.body;

        if (!instruction_id || !event_type) {
            return res.status(400).json({ success: false, message: "instruction_id and event_type are required" });
        }

        const event = await Analytics.create({ instruction_id, user_id, event_type, step_id });

        res.status(201).json({ success: true, message: "Event created", data: event });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};


exports.getEvents = async (req, res) => {
    try {
        const { event_type, user_id, instruction_id } = req.query;

        const filter = {};
        if (event_type) filter.event_type = event_type;
        if (user_id) filter.user_id = user_id;
        if (instruction_id) filter.instruction_id = instruction_id;

        const events = await Analytics.find(filter).sort({ createdAt: -1 });

        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};


exports.getByInstruction = async (req, res) => {
    try {
        const events = await Analytics.find({ instruction_id: req.params.instruction_id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};


exports.getByUser = async (req, res) => {
    try {
        const events = await Analytics.find({ user_id: req.params.user_id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: events.length, data: events });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};


exports.getInstructionStats = async (req, res) => {
    try {
        const instruction_id = req.params.instruction_id;

        const stats = await Analytics.aggregate([
            { $match: { instruction_id } },
            {
                $group: {
                    _id: "$event_type",
                    count: { $sum: 1 }
                }
            }
        ]);

        // Transform into object { view: x, like: y, ... }
        const formatted = stats.reduce((acc, s) => {
            acc[s._id] = s.count;
            return acc;
        }, {});

        res.status(200).json({ success: true, data: formatted });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error", error: err.message });
    }
};
