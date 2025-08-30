const mongoose = require('mongoose');
const { Schema } = mongoose;


const analyticsSchema = new Schema(
    {
        instruction_id: { type: Schema.Types.ObjectId, ref: 'Instruction', required: true, index: true },
        user_id: { type: Schema.Types.ObjectId, ref: 'User', index: true },
        event_type: {
            type: String,
            enum: ['view', 'share', 'like', 'step_complete'],
            required: true,
            index: true,
        },
        step_id: { type: Schema.Types.ObjectId, ref: 'Step', index: true },
    },
    { timestamps: { createdAt: true, updatedAt: false } }
);

analyticsSchema.index({ instruction_id: 1, event_type: 1 });
analyticsSchema.index({ user_id: 1, event_type: 1 });
analyticsSchema.index({ step_id: 1, event_type: 1 });
analyticsSchema.index({ createdAt: -1 }); // latest events fast lookup

const Analytics = mongoose.model('Analytics', analyticsSchema);


module.exports = { Analytics }