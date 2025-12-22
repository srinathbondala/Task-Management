const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const timelogSchema = new Schema({
    task: {
        type: Schema.Types.ObjectId,
        ref: 'Task',
        required: true,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    start_time: {
        type: Date,
        default: () => new Date(),
    },
    end_time: {
        type: Date,
    },
    duration: {
        type: Number,
    },
    note: {
        type: String,
        default: '',
    }
});

module.exports = model('Timelogs', timelogSchema);