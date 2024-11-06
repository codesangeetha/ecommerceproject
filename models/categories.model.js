const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name : String,
    description : String,
    created_at : Date,
    updated_at : Date
});
const Category = mongoose.model('categories',categorySchema);
module.exports = Category;