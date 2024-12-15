const Joi = require('joi');

const signupSchema = Joi.object({
    name: Joi.string()
        .required()
        .label('Name')
        .messages({ 'string.empty': 'Name is required' }),

    username: Joi.string()
        .required()
        .label('Username')
        .messages({ 'string.empty': 'username is required' }),

    email: Joi.string()
        .pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .required()
        .label('Email')
        .messages({ 'string.empty': 'Email is required' }),

    password: Joi.string()
        .required()
        .label('Password')
        .messages({ 'string.empty': 'Password is required' }),

    cpassword: Joi.string()
        .required()
        .label('Confirm password')
        .messages({ 'string.empty': 'Confirm password is required' }),

    houseNo: Joi.string()
        .required()
        .label('House Number')
        .messages({ 'string.empty': 'House Name is required' }),
    city: Joi.string()

        .required()
        .label('City')
        .messages({
            'string.empty': 'City is required',
        }),
    state: Joi.string()

        .required()
        .label('State')
        .messages({
            'string.empty': 'State is required',
        }),
    pincode: Joi.string()
        .pattern(/^[0-9]{6}$/)
        .required()
        .label('Pincode')
        .messages({
            'string.empty': 'Pincode is required',
            'string.pattern.base': 'Pincode must be a 6-digit number',
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

module.exports = signupSchema;
