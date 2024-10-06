const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const taskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ['backlog', 'in progress', 'completed'],
        default: 'Backlog',
    },
    created_at : {
        type: Date,
        default: () => {
            const currentDate = new Date();
            return currentDate.toISOString().split('T')[0];
        },
    },
    updated_at: {
        type: Date,
        default: () => {
            const currentDate = new Date();
            return currentDate.toISOString().split('T')[0];
        }
    },
    category: {
        type: String,
        required: true,
        enum: ['personal', 'work', 'study'],
    },
    priority: {
        type: String,
        required: true,
        enum: ['low', 'medium', 'high'],
    }
});

module.exports = model('Task', taskSchema);