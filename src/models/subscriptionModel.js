const mongoose = require('mongoose');
const { Schema } = mongoose;


const subscriptionSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        plan_type: {
            type: String,
            enum: ['free', 'creator', 'pro', 'enterprise'],
            default: 'free',
            index: true,
        },
        status: {
            type: String,
            enum: ['active', 'canceled', 'past_due'],
            default: 'active',
            index: true,
        },
        current_period_start: { type: Date, index: true },
        current_period_end: { type: Date, index: true },
    },
    { timestamps: true }
);

subscriptionSchema.index({ user_id: 1, status: 1 });
subscriptionSchema.index({ plan_type: 1, status: 1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = { Subscription }