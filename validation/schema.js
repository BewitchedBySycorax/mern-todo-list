/* eslint-disable no-useless-escape */
const Joi = require('joi')

const schema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'ru'] } })
    .min(10)
    .max(100)
    .required(),

  password: Joi.string()
    // Minimum 8 characters, at least 1 letter, 1 number and 1 special character
    .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$')),

  repeat_password: Joi.ref('password')
})
  .with('password', 'repeat_password')

module.exports = schema
