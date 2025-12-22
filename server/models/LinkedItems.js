const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const linkedItemSchema = new Schema({
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        enum: ['task', 'project', 'document', 'other'], // whatever you want to link
        default: 'task',
    },
    link: {
        type: String,
        default: '',
    },
    created_at: {
        type: Date,
        default: () => new Date(),
    }
});

module.exports = model('LinkedItems', linkedItemSchema);
