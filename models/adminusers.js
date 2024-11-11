const mongoose = require('mongoose');

const adminusersSchema = new mongoose.Schema({
    name: String,
    username:String,
    email: String,
    password: String,
    status: Boolean,
    address: Object
});
const Adminusers = mongoose.model('adminusers', adminusersSchema);
module.exports = Adminusers;