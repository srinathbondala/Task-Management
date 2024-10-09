const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    try{
        const exestingUser = await User.findOne({ email });
        if(exestingUser){
            return res.status(400).json({ message: 'User already exists!' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ username, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User created successfully!' });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try{
        const user = await User.findOne({ email });
        if(!user){
            return res.status(400).json({ message: 'User not found!' });
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if(!isPasswordMatch){
            return res.status(400).json({ message: 'Invalid credentials!' });
        }
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '4h' });
        res.status(200).json({ token, user: {
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            createdAt: user.date,
            tasks: user.tasks,
            role: user.role
        } });
    }
    catch(err){
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};