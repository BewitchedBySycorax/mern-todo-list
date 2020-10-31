/* eslint-disable no-useless-escape */
const Joi = require('joi')

const schema = Joi.object({
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'ru'] } })
    .min(10)
    .max(100)
    .required(),

  password: Joi.string()
    .min(3)
    .max(8)
    .required(),

  repassword: Joi.any()
    .valid(Joi.ref('password'))
    .required()
})
  .with('password', 'repassword')

module.exports = schema
