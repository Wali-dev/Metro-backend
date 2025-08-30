const mongoose = require('mongoose');
const { Schema } = mongoose;

const instructionSchema = new Schema(
    {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        title: { type: String, required: true, index: true },
        description: { type: String },
        format_type: { type: String, enum: ['blog', 'flowchart'], default: 'blog' },
        is_published: { type: Boolean, default: false, index: true },
        views_count: { type: Number, default: 0 },
        banner_image: { type: String },
        theme_settings: { type: Schema.Types.Mixed }, // JSONB equivalent
    },
    { timestamps: true }
);

instructionSchema.index({ user_id: 1, is_published: 1 });
instructionSchema.index({ title: 'text', description: 'text' }); // search
instructionSchema.index({ views_count: -1 }); // popular content

const Instruction = mongoose.model('Instruction', instructionSchema);

module.exports = { Instruction };