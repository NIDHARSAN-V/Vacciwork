const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

exports.register = async (req, res) => {
    try {
        console.log('Register request body:', req.body);
        const { name, email, password, role, district, state } = req.body;

        if (!name || !email || !password || !role || !district || !state) {
            console.log('Missing fields:', { name, email, password, role, district, state });
            return res.status(400).json({ message: 'All fields are required' });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            console.log('User already exists:', email);
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            district,
            state
        });

        const token = signToken(user._id);

        console.log('User registered:', user);
        res.status(201).json({
            status: 'success',
            token,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    district: user.district,
                    state: user.state
                }
            }
        });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        console.log('Login request body:', req.body);
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Missing email or password:', { email, password });
            return res.status(400).json({ message: 'Please provide email and password' });
        }

        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        const isPasswordCorrect = await user.correctPassword(password, user.password);
        if (!isPasswordCorrect) {
            console.log('Incorrect password for user:', email);
            return res.status(401).json({ message: 'Incorrect email or password' });
        }

        // Remove password from user object before sending
        user.password = undefined;

        const token = signToken(user._id);
        console.log('User logged in:', user);
        res.status(200).json({
            status: 'success',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                district: user.district,
                state: user.state
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
};