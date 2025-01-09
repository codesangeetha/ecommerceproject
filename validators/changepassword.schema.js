const Joi = require('joi');

const changepasswordSchema = Joi.object({
    newPassword: Joi.string()
        .label('New password')
        .required()
        .messages({
             'string.empty': 'Password is required',
            'string.pattern.base': 'Password must be a 6-digit number',
        }),
    confirmNewPassword: Joi.string()
        .label('Confirm new password')
        .required(),
});
module.exports = changepasswordSchema;