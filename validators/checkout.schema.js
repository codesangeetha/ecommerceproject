const Joi = require('joi');

const checkoutSchema = Joi.object({
    total: Joi.number()
    .required()
    .label('Total'),
   
    name: Joi.string()
        .required()
        .label('Full Name')
        .messages({ 'string.empty': 'Name is required' }),

    houseNo: Joi.string()
        .required()
        .label('House Number')
        .messages({ 'string.empty': 'House Number is required' }),
    city: Joi.string()
        .min(2)
        .max(50)
        .required()
        .label('City')
        .messages({
            'string.empty': 'City is required',
            'string.min': 'City must be at least 2 characters',
            'string.max': 'City must be at most 50 characters',
        }),
    state: Joi.string()
        .min(2)
        .max(50)
        .required()
        .label('State')
        .messages({
            'string.empty': 'State is required',
            'string.min': 'State must be at least 2 characters',
            'string.max': 'State must be at most 50 characters',
        }),
    pincode: Joi.string()
        .pattern(/^[0-9]{6}$/)
        .required()
        .label('Pincode')
        .messages({
            'string.empty': 'Pincode is required',
            'string.pattern.base': 'Pincode must be a 6-digit number',
        }),

    email: Joi.string()
        /* .pattern(/^[0-9]{6}$/) */
        .required()
        .label('Email')
        .messages({
            'string.empty': 'Email is required',
        }),

    phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .label('Phone Number')
        .messages({
            'string.empty': 'Phone Number is required',
            'string.pattern.base': 'Phone Number must be a 10-digit number',
        }),
});

module.exports = checkoutSchema;
