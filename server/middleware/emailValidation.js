const Joi = require('joi');
const { BadRequest } = require('./errorHandler');

const emailValidationSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email must be string.',
      'string.empty': 'Email is required.',
      'string.email': 'Email is not valid.',
    }),
});

const emailValidation = (req, res, next) => {
  const { email } = req.body;
  const result = emailValidationSchema.validate({ email });
  if (result.error) {
    throw new BadRequest(result.error.message);
  }
  next();
};

module.exports = emailValidation;
