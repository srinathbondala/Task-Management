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
            required:true,
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
            trim: true,
            default: '',
        },
    },
    {
        timestamps: true,
    }
);

timelogSchema.pre('save', function (next) {
  if (this.start_time && this.end_time) {
    const diffMs = this.end_time - this.start_time;
    this.duration = Math.max(Math.round(diffMs / 60000), 0);
  }
  next();
});

module.exports = model('Timelogs', timelogSchema);