import mongoose from "mongoose";
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
    date: {
        type: Date,
        default: Date.now,
    },
    tasks: 
    {
        type: [Schema.Types.ObjectId],
        ref: "Task",
        default: [],
    },
    timestamps: true,
});

const User = model("User", userSchema);