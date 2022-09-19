const Joi = require('joi');
const { BadRequest } = require('./errorHandler');

const registerValidationSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .required()
    .messages({
      'string.base': 'name must be string.',
      'string.min': 'name should have atleast 3 characters.',
      'string.empty': 'name is required.',
    }),
});

const registerValidation = (req, res, next) => {
  const { name } = req.body;
  const result = registerValidationSchema.validate({ name });
  if (result.error) {
    throw new BadRequest(result.error.message);
  }
  next();
};

module.exports = registerValidation;
