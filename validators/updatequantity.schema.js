const Joi = require('joi');

const updatequantityschema = Joi.object({
    change: Joi.number()
        .label('change')
        .required(),
    productId: Joi.string()
        .label('productId')
        .required(),
});
module.exports = updatequantityschema;