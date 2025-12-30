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
        id:{
            type: Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        name:{
            type: String,
            default: null
        }
    },
    linked_items : [
        {
            linked_id : {
                type: Schema.Types.ObjectId,
                ref: 'Task'
            },
            relation : {
                type: String,
                required: true,
                enum: ['Dependent On', 'Done Before', 'Blocked By', 'Done After'],
            }
        }
    ],
    attachments: [
        {
            type: {
                type: String,
                required: true,
            },
            ref_id: {
                type: Schema.Types.ObjectId,
                ref: 'LinkedItems'
            },
            title: {
                type: String,
            }
        },
    ],
    time_logs: {
        logs: [{
            type: Schema.Types.ObjectId,
            ref: 'Timelogs',
        }],
        default: [],
    }
});

module.exports = model('Task', taskSchema);