const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema(
    {
        auth_provider: {
            type: String,
            enum: ['local', 'clerk', 'google'],
            default: 'local',
            index: true,
        },
        provider_id: { type: String, index: true },
        name: { type: String, trim: true, index: true },
        email: { type: String, unique: true, required: true, lowercase: true },
        password_hash: { type: String },
        profile_picture: { type: String },
        bio: { type: String },
        role: { type: String, enum: ['user', 'admin'], default: 'user', index: true },
    },
    { timestamps: true }
);

// userSchema.index({ email: 1 });
userSchema.index({ name: 'text', bio: 'text' }); // full-text search

const User = mongoose.model('User', userSchema);


module.exports = { User };