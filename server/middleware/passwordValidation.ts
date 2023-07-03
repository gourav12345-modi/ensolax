import { BadRequest } from "./errorHandler";
import { Request, Response, NextFunction } from 'express';

const passwordValidation = (req: Request, res: Response, next: NextFunction) => {
  const { password, confirmPassword } = req.body;
  const capital = new RegExp('(?=.*[A-Z])');
  const lower = new RegExp('(?=.*[a-z])');
  const number = new RegExp('(?=.*[0-9])');
  const special = new RegExp('(?=.*[!@#$%^&*])');
  if (!capital.test(password)) {
    throw new BadRequest('Password should contain atleast one uppercase letter.');
  }
  if (!lower.test(password)) {
    throw new BadRequest('Password must contain atleast one lowercase letter.');
  }
  if (!number.test(password)) {
    throw new BadRequest('Password must contain atleast one number.');
  }
  if (!special.test(password)) {
    throw new BadRequest('Password must contain atleast one of the following characters !, @, #, $, %, ^, &, *');
  }
  if (password !== confirmPassword) {
    throw new BadRequest('Password do not match with confirm password.');
  }
  next();
};

module.exports = passwordValidation;
