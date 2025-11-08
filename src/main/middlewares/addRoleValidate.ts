import { Request, Response, NextFunction } from 'express'
import Joi from 'joi'

// Padrão permissões: recurso:acao (minúsculas, dígitos, ., -, _)
const permissionPattern = /^[a-z0-9._-]+:[a-z0-9._-]+$/

// Esquema de validação para criação de cargo + permissões
export const addRoleSchema = Joi.object({
  role_name: Joi.string().min(3).max(100).required(),
  description: Joi.string().allow(null, '').max(255),
  permissions: Joi.array()
    .items(Joi.string().pattern(permissionPattern))
    .max(200)
    .default([])
})

// Middleware de validação para cargo
export function roleIsValid(schema: Joi.ObjectSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false })
    if (error) {
      return res.status(400).json({
        success: false,
        message: `[RoleValidate ERROR] Falha de validação: ${error.message}`
      })
    }
    if (Array.isArray(value.permissions)) {
      const unique = Array.from(new Set(value.permissions.map((p: string) => p.trim()))).filter(Boolean)
      value.permissions = unique
    }
    req.body = value
    next()
  }
}
