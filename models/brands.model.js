const mongoose = require('mongoose');

const brandSchema = new mongoose.Schema({
    name: String,
    description: String,
    isdeleted: Boolean,
    editUser: String,
    status:Boolean
},
    {
        timestamps: true
    });
const Brand = mongoose.model('brands', brandSchema);
module.exports = Brand;