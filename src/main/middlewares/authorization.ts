import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import type { AuthUser, AuthRequest } from '../types'

export function requirePermissions(...permissions: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization
      
      if (!authHeader) {
        return res.status(401).json({
          success: false,
          message: 'Token não fornecido.'
        })
      }

      const token = authHeader.replace('Bearer ', '')
      const secret = process.env.JWT_SECRET
      
      if (!secret) {
        return res.status(500).json({
          success: false,
          message: 'Configuração do servidor incorreta.'
        })
      }

      const decoded = jwt.verify(token, secret) as any
      
      const user: AuthUser = {
        id: decoded.id,
        usuario: decoded.user,
        cargo: decoded.role || [],
        permissoes: decoded.perm || []
      }

      const hasPermission = permissions.some(permission => 
        user.permissoes.includes(permission)
      )

      if (!hasPermission) {
        return res.status(403).json({
          success: false,
          message: `Acesso negado. Permissão necessária: ${permissions.join(' ou ')}`
        })
      }

      req.user = user
      next()
      
    } catch (error: any) {
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({
          success: false,
          message: 'Token inválido.'
        })
      }
      
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          message: 'Token expirado.'
        })
      }

      return res.status(500).json({
        success: false,
        message: 'Erro ao validar token.'
      })
    }
  }
}