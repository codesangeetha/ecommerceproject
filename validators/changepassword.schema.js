const Joi = require('joi');

const changepasswordSchema = Joi.object({
    newPassword: Joi.string()
        .label('New password')
        .min(6) // Add minimum length validation
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 6 characters long', // Custom message for length validation
        }),
    confirmNewPassword: Joi.string()
        .label('Confirm new password')
        .required()
        .valid(Joi.ref('newPassword')) // Ensure it matches the newPassword
        .messages({
            'any.only': 'Confirm password must match the new password', // Custom message for mismatch
        }),
});

module.exports = changepasswordSchema;
