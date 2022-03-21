const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Please enter name"]
        },
        email: {
            type: String,
            required: [true, "Please enter email"],
            unique: [true, "Email already exists"]
        },
        password: {
            type: String,
            required: [true, "Please enter password"],
            minlength: [6, "Password must be of minimum 6 characters"],
            select: false
        }
    },
    { timestamps: true }
)

module.exports = mongoose.model("User", userSchema);
