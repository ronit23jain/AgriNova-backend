import {Request, Response, NextFunction} from 'express';
import Joi from 'joi';

const registerSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('farmer', 'customer').required(),
  name:Joi.string().required(),
  address:Joi.string().required(),
  phone_no:Joi.string().pattern(/^[0-9]{10}$/).required(),
  gender:Joi.string().valid('male', 'female', 'other').required(),
  dob:Joi.date().less('now').required(),
  farm_name:Joi.string().when('role', { is: 'farmer', then: Joi.required(), otherwise: Joi.optional().allow(null) }),
  farmer_registration_no:Joi.string().when('role', { is: 'farmer', then: Joi.required(), otherwise: Joi.optional().allow(null)    }), 
});

const loginSchema = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(6).required(),
});

export const validateRegister = (req: Request, res: Response, next: NextFunction) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};

export const validateLogin  = (req: Request, res: Response, next: NextFunction) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  next();
};