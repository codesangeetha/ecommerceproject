const Joi = require('joi');

const changepasswordSchema = Joi.object({
    newPassword: Joi.string()
        .label('New password')
        .required(),
    confirmNewPassword: Joi.string()
        .label('Confirm new password')
        .required(),
});
module.exports = changepasswordSchema;