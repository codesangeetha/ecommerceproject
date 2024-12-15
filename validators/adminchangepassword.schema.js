const Joi = require('joi');

const adminchangepasswordSchema = Joi.object({
    newPassword: Joi.string()
        .label('New password')
        .required(),
    confirmNewPassword: Joi.string()
        .label('Confirm new password')
        .required(),
});
module.exports = adminchangepasswordSchema;  