const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    status: Boolean,
    address: Object
},
    {
        timestamps: true
    }
);
const Users = mongoose.model('users', usersSchema);
module.exports = Users;