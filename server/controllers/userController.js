const User = require('../models/User');
const Task = require('../models/Task');
const jwt = require('jsonwebtoken');
// const getUserPage = async (req, res) => {
//     res.send('Welcome to the User Page');
// };

const getUserProfile = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const user = await User.findById(userId).populate('tasks');
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getUserTasks = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const tasks = await Task.find({ user: userId });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getUserTaskById = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        if (!task) {
            return res.status(404).send('Task not found');
        }
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const createUserTask = async (req, res) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const taskData = { ...req.body, user: userId };
        const newTask = await Task.create(taskData);
        await User.findByIdAndUpdate(userId, { $push: { tasks: newTask._id } });
        res.status(201).json(newTask._id);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateUserTask = async (req, res) => {
    try {
        const { id } = req.params;
        req.body.updated_at = new Date().toISOString().split('T')[0];
        const updatedTask = await Task.findByIdAndUpdate(id, req.body);
        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }
        res.json(updatedTask);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const deleteUserTask = async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(404).send('Task not found');
        }
        await User.findByIdAndUpdate(task.user, { $pull: { tasks: id } });
        res.status(204).send();
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const userLogout = (req, res) => {
    res.send('Welcome to the User Logout Page');
};

const updateTaskStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(id, { status, updated_at: new Date().toISOString().split('T')[0] }, { new: true }); // Update status and updatedAt
        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }
        res.status(200).json(updatedTask);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const updateTaskPriority = async (req, res) => {
    try {
        const { id } = req.params;
        const { priority } = req.body;
        const updatedTask = await Task.findByIdAndUpdate(id, { priority, updatedAt: new Date() }, { new: true }); // Update priority and updatedAt
        if (!updatedTask) {
            return res.status(404).send('Task not found');
        }
        res.json(updatedTask);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

const getUserTasksPriority = async (req, res) => {
    try {
        const userId = req.user._id;
        const tasks = await Task.find({ user: userId }).sort({ priority: 1 });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
};

module.exports = {
    // getUserPage,
    getUserProfile,
    getUserTasks,
    getUserTaskById,
    createUserTask,
    updateUserTask,
    deleteUserTask,
    userLogout,
    getUserTasksPriority,
    updateTaskStatus,
    updateTaskPriority
};