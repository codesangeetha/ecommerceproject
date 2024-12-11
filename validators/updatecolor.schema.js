const Joi = require('joi');

const updatecolorschema = Joi.object({
    color: Joi.string()
        .label('color')
        .required(),
    productId: Joi.string()
        .label('productId')
        .required(),
});
module.exports = updatecolorschema;