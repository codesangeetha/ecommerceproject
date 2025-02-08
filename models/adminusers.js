const mongoose = require('mongoose');

const adminusersSchema = new mongoose.Schema({
    name: String,
    username:String,
    email: String,
    password: String,
    status: Boolean,
    address: Object,
    role: { type: String, default: 'admin' }
});
const Adminusers = mongoose.model('adminusers', adminusersSchema);
module.exports = Adminusers;