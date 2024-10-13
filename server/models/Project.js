const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const projectSchema = new Schema({
    projectName: {
        type: String,
        required: true,
        unique: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active',
    },
    created_by: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    created_at : {
        type: Date,
        default: () => {
            const currentDate = new Date();
            return currentDate.toISOString();
        },
    },
    users: {
        type: [Schema.Types.ObjectId],
        ref: 'User',
        default: [],
    },
    tasks: {
        type: [Schema.Types.ObjectId],
        ref: 'Task',
        default: [],
    },
});

module.exports = model('Project', projectSchema);