const mongoose = require('mongoose');

const usersSchema = new mongoose.Schema({
    name : String,
    email : String,
    password : String,
    address : Object
});
const Users = mongoose.model('users',usersSchema);
module.exports = Users;