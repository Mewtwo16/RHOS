import jwt from 'jsonwebtoken'
import { Response, NextFunction } from 'express'
import type { AuthUser, AuthRequest } from '../types'

/**
 * Middleware para verificar o JWT e anexar o usuário à requisição.
 * Use este middleware antes de rotas que exigem autenticação.
 */
export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token não fornecido' })
  }

  const secret = process.env.JWT_SECRET
  if (!secret) {
    return res.status(500).json({ success: false, message: 'Erro de configuração do servidor' })
  }

  try {
    const decoded = jwt.verify(token, secret) as any
    req.user = {
      id: decoded.id,
      usuario: decoded.user,
      cargo: decoded.role,
      permissoes: decoded.perm
    }
    next()
  } catch (error) {
    return res.status(403).json({ success: false, message: 'Token inválido ou expirado' })
  }
}

/**
 * Middleware para verificar se o usuário possui as permissões necessárias.
 * Use após o authenticateToken.
 * 
 * Exemplo: requirePermissions('users:create', 'users:update')
 */
export function requirePermissions(...perms: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user

    if (!user) {
      return res.status(401).json({ success: false, message: 'Não autenticado' })
    }

    const hasAllPermissions = perms.every(perm => user.permissoes.includes(perm))
    
    if (!hasAllPermissions) {
      return res.status(403).json({ success: false, message: 'Permissão negada' })
    }

    next()
  }
}

/**
 * Middleware para verificar se o usuário possui um dos cargos necessários.
 * Use após o authenticateToken.
 * 
 * Exemplo: requireRoles('admin', 'manager')
 */
export function requireRoles(...roles: string[]) {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const user = req.user

    if (!user) {
      return res.status(401).json({ success: false, message: 'Não autenticado' })
    }

    const hasRole = roles.some(role => user.cargo.includes(role))
    
    if (!hasRole) {
      return res.status(403).json({ success: false, message: 'Cargo insuficiente' })
    }

    next()
  }
}