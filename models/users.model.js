const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    status: Boolean,
    address: {
        houseNo: String,
        city: String,
        state: String,
        pincode: String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
},
    {
        timestamps: true
    }
);
const Users = mongoose.model('users', usersSchema);
module.exports = Users;