const { Instruction } = require('../models/instructionModel');
const mongoose = require("mongoose");

exports.createInstruction = async (req, res) => {
    try {
        const { user_id, title, description, format_type, is_published, banner_image, theme_settings } = req.body;

        const instruction = new Instruction({
            user_id,
            title,
            description,
            format_type,
            is_published,
            banner_image,
            theme_settings,
        });

        await instruction.save();

        return res.status(201).json({
            success: true,
            message: 'Instruction created successfully',
            instruction,
        });
    } catch (err) {
        console.error('Error creating instruction:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.updateInstruction = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        const instruction = await Instruction.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!instruction) {
            return res.status(404).json({ success: false, message: 'Instruction not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Instruction updated successfully',
            instruction,
        });
    } catch (err) {
        console.error('Error updating instruction:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

exports.deleteInstruction = async (req, res) => {
    try {
        const { id } = req.params;

        const instruction = await Instruction.findByIdAndDelete(id);

        if (!instruction) {
            return res.status(404).json({ success: false, message: 'Instruction not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'Instruction deleted successfully',
        });
    } catch (err) {
        console.error('Error deleting instruction:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.getInstructionsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        console.log(userId)

        const instructions = await Instruction.aggregate([
            {
                $match: { user_id: new mongoose.Types.ObjectId(userId) }
            },
            { $sort: { createdAt: -1 } },
            {
                $lookup: {
                    from: "steps",
                    localField: "_id",
                    foreignField: "instruction_id",
                    as: "steps"
                }
            },
            {
                $addFields: {
                    steps: {
                        $sortArray: { input: "$steps", sortBy: { step_order: 1 } }
                    }
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            message: "Instructions with steps fetched successfully",
            instructions
        });
    } catch (err) {
        console.error("Error fetching instructions:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};