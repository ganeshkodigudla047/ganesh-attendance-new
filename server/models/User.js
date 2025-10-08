const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Login user
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Create JWT token with id, role, and name
        const token = jwt.sign(
            { id: user._id, role: user.role, name: user.name },  // name included!
            process.env.JWT_SECRET || 'secretkey',
            { expiresIn: '1d' }
        );

        // Send token and user info to frontend
        res.status(200).json({
            token: token,
            role: user.role,
            name: user.name,
            message: 'Login successful'
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// facial data

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, required: true, enum: ['Student', 'Incharge', 'Admin'] },
    faceData: { type: String } // base64 string of facial image
});

module.exports = mongoose.model('User', userSchema);
