const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');

exports.register = async (req, res) => {
    try {
        const { username, email, password, first_name, last_name, user_type ,bio} = req.body;

        // Check if user already exists
        if (!user_type) {
            return res.status(402).json({ message: 'user_type is required' });
        }
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const userId = await User.create({
            username,
            email,
            password: hashedPassword,
            first_name,
            last_name,
            user_type,
            bio
        });

        // Create JWT token
        const token = jwt.sign({ userId: userId, email: email, user_type: user_type }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.status(201).json({ userId, token, message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password_hash);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Create JWT token
        const token = jwt.sign({ userId: user.user_id, email: user.email, user_type: user.user_type }, process.env.JWT_SECRET, { expiresIn: '2h' });

        res.json({ userId: user.user_id, token, user_type: user.user_type });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};