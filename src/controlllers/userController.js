const { User } = require('../models/userModel');
const bcrypt = require('bcrypt');

const hashPassword = async (password) => {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
};

exports.createUser = async (req, res) => {
    try {
        const { auth_provider, provider_id, name, email, password_hash, profile_picture, bio, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'User with this email already exists' });
        }

        let hashedPassword = undefined;
        if (auth_provider === 'local' && password_hash) {
            hashedPassword = await hashPassword(password_hash);
        }

        const user = new User({
            auth_provider,
            provider_id,
            name,
            email,
            password_hash: hashedPassword,
            profile_picture,
            bio,
            role,
        });

        await user.save();

        // Convert user to plain object and remove password_hash
        const userObj = user.toObject();
        delete userObj.password_hash;

        return res.status(201).json({
            success: true,
            message: 'User created successfully',
            user: userObj,
        });
    } catch (err) {
        console.error('Error creating user:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = { ...req.body };

        if (updates.auth_provider === 'local' && updates.password_hash) {
            updates.password_hash = await hashPassword(updates.password_hash);
        }

        const user = await User.findByIdAndUpdate(id, updates, {
            new: true,
            runValidators: true,
        });

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Convert user to plain object and remove password_hash
        const userObj = user.toObject();
        delete userObj.password_hash;

        return res.status(200).json({
            success: true,
            message: 'User updated successfully',
            userObj,
        });
    } catch (err) {
        console.error('Error updating user:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        return res.status(200).json({
            success: true,
            message: 'User deleted successfully',
        });
    } catch (err) {
        console.error('Error deleting user:', err);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};