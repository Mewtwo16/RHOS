import type { LoginResponse } from '../types'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../db/db'
import logService from './logService'

class AuthService {
  async login(usuario: string, senha: string): Promise<LoginResponse> {
    try {
      const user = await db('users').where({ login: usuario }).first()
      if (!user) {
        await logService.write({
          user_id: null,
          who: usuario,
          where: 'auth',
          what: 'Login failed: user not found'
        })
        return { success: false, message: 'Usuário inválido ou inexistente' }
      }
      if (user.status !== 1) {
        await logService.write({
          user_id: user.id,
          who: usuario,
          where: 'auth',
          what: 'Login failed: user inactive'
        })
        return { success: false, message: 'Usuário desativado' }
      }
      
      const senhaOk = await bcrypt.compare(senha, user.password_hash)
      if (!senhaOk) {
        await logService.write({
          user_id: user.id,
          who: usuario,
          where: 'auth',
          what: 'Login failed: invalid password'
        })
        return { success: false, message: 'Senha inválida' }
      }

      const permissions = await this.getUserPermissions(user.id)
      const roles = await this.getUserRoles(user.id)
      const secret = process.env.JWT_SECRET
      
      if (!secret) return { success: false, message: 'Configuração interna ausente (JWT_SECRET)' }

      const token = jwt.sign(
        { id: user.id, user: user.login, role: roles, perm: permissions },
        secret,
        { expiresIn: '8h' }
      )
      
      await logService.write({
        user_id: user.id,
        who: usuario,
        where: 'auth',
        what: 'Login successful'
      })
      
      return { success: true, message: 'Login bem-sucedido', token }
    } catch (error) {
      return { success: false, message: 'Falha interna ao autenticar' }
    }
  }

  private async getUserPermissions(userId: number): Promise<string[]> {
    try {
      const permissions = (await db('allowed')
        .join('roles_allowed', 'allowed.id', '=', 'roles_allowed.allowed_id')
        .join('role_users', 'roles_allowed.roles_id', '=', 'role_users.roles_id')
        .where('role_users.users_id', userId)
        .distinct('allowed.permission_name')
        .pluck('permission_name')) as string[]
      return permissions
    } catch {
      return []
    }
  }

  private async getUserRoles(userId: number): Promise<string[]> {
    try {
      const roles = (await db('roles')
        .join('role_users', 'roles.id', '=', 'role_users.roles_id')
        .where('role_users.users_id', userId)
        .distinct('roles.role_name')
        .pluck('role_name')) as string[]
      return roles
    } catch {
      return []
    }
  }
}

export default new AuthService()
