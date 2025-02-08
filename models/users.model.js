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
        pincode: String,
        phone:String
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date,
    googleId: String,
    fbId: String,
    role: { type: String, default: 'client' },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]

},
    {
        timestamps: true
    }
);
const Users = mongoose.model('users', usersSchema);
module.exports = Users;