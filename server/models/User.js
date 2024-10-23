const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    username: {
        type: String,
        required: true,
    },
    firstName : {
        type: String,
        required: true,
    },
    lastName : {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now,
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user",
    },
    tasks: 
    {
        type: [Schema.Types.ObjectId],
        ref: "Task",
        default: [],
    },
    projects: [{
        id: {
            type: Schema.Types.ObjectId,
            ref: 'Project',
            default: null,
            unique: true,
          },
          name: {
            type: String,
            default: 'SELF',
          }
        }
    ]
});

module.exports = model("User", userSchema);