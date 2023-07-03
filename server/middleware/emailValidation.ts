const Joi = require('joi');
import { BadRequest } from "./errorHandler";
import { Request, Response, NextFunction } from 'express';

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

const emailValidation = (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;
  const result = emailValidationSchema.validate({ email });
  if (result.error) {
    throw new BadRequest(result.error.message);
  }
  next();
};

module.exports = emailValidation;
