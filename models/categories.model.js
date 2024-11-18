const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: String,
    description: String,
    isdeleted: Boolean,
    editUser: String,
    status:Boolean
},
    {
        timestamps: true
    });
const Category = mongoose.model('categories', categorySchema);
module.exports = Category;