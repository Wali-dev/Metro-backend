const { Step } = require('../models/stepModel');

exports.createStep = async (req, res) => {
    try {
        const { instruction_id, step_order, title, description, image_url, video_url } = req.body;

        const step = new Step({
            instruction_id,
            step_order,
            title,
            description,
            image_url,
            video_url,
        });

        await step.save();

        return res.status(201).json({
            success: true,
            message: 'Step created successfully',
            step,
        });
    } catch (err) {
        console.error('Error creating step:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateStep = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        if (updates.step_order !== undefined) {
            // Check for duplicate step_order for the same instruction
            const existingStep = await Step.findOne({
                instruction_id: updates.instruction_id, // required in request body
                step_order: updates.step_order,
                _id: { $ne: id } // exclude current step
            });

            if (existingStep) {
                return res.status(400).json({
                    success: false,
                    message: `Step order ${updates.step_order} already exists for this instruction`
                });
            }
        }

        const step = await Step.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!step) {
            return res.status(404).json({ success: false, message: 'Step not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Step updated successfully',
            step,
        });
    } catch (err) {
        console.error('Error updating step:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.deleteStep = async (req, res) => {
    try {
        const { id } = req.params;

        const step = await Step.findByIdAndDelete(id);

        if (!step) {
            return res.status(404).json({ success: false, message: 'Step not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Step deleted successfully',
        });
    } catch (err) {
        console.error('Error deleting step:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};
