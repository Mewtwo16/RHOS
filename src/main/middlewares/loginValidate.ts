import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

// Esquema de validação para login
const loginSchema = Joi.object({
  usuario: Joi.string().required(),
  senha: Joi.string().required()
})

// Middleware de validação de payload com Joi (login)
function loginIsValid(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body)
    if (error)
      return res.status(400).json({
        success: false,
        message: `[LoginValidate ERROR]: Erro de validação ${error.message}`
      })
    next()
  }
}

export { loginSchema, loginIsValid }
