import mongoose from 'mongoose';
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
        enum: ['Backlog', 'InProgress', 'Completed'],
        default: 'Backlog',
    },
    createAt : {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    category: {
        type: String,
        required: true,
        enum: ['Personal', 'Work', 'Study'],
    },
    priority: {
        type: String,
        required: true,
        enum: ['Low', 'Medium', 'High'],
    },
    timestamps: true,
});

const Task = model('Task', taskSchema);