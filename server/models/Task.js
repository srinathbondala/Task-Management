const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const taskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId || null,
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
        default: 'backlog',
    },
    created_at : {
        type: Date,
        default: () => {
            const currentDate = new Date();
            return currentDate.toISOString();
        },
    },
    updated_at: {
        type: Date,
        default: () => {
            const currentDate = new Date();
            return currentDate.toISOString();
        }
    },
    due_date: {
        type: Date,
        required: true
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
    },
    project: {
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            default: null,
          },
          name: {
            type: String,
            default: 'SELF',
          }
    },
    assigned_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    }
});

module.exports = model('Task', taskSchema);