const Joi = require('joi');
import { BadRequest } from "./errorHandler";
import { Request, Response, NextFunction } from 'express';

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

const registerValidation = (req: Request, res: Response, next: NextFunction) => {
  const { name } = req.body;
  const result = registerValidationSchema.validate({ name });
  if (result.error) {
    throw new BadRequest(result.error.message);
  }
  next();
};

export default registerValidation;
