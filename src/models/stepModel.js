const mongoose = require('mongoose');
const { Schema } = mongoose;


const stepSchema = new Schema(
    {
        instruction_id: { type: Schema.Types.ObjectId, ref: 'Instruction', required: true, index: true },
        step_order: { type: Number, required: true, index: true },
        title: { type: String, index: true },
        description: { type: String },
        image_url: { type: String },
        video_url: { type: String },
    },
    { timestamps: true }
);

stepSchema.index({ instruction_id: 1, step_order: 1 }, { unique: true });

const Step = mongoose.model('Step', stepSchema);

module.exports = { Step }