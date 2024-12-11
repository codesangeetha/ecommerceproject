const Joi = require('joi');

const updatesizeschema = Joi.object({
    size: Joi.string()
        .label('size')
        .required(),
    productId: Joi.string()
        .label('productId')
        .required(),
});
module.exports = updatesizeschema;