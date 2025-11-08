import type { LoginResponse } from '../types'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import db from '../db/db'

class AuthService {
  // Autentica usuário por login/senha, gera JWT com cargos e permissões agregadas
  async login(usuario: string, senha: string): Promise<LoginResponse> {
    try {
      const user = await db('users').where({ login: usuario }).first()
      if (!user) return { success: false, message: 'Usuário inválido ou inexistente' }
      if (user.status !== 1) return { success: false, message: 'Usuário desativado' }
      const senhaOk = await bcrypt.compare(senha, user.password_hash)
      if (!senhaOk) return { success: false, message: 'Senha inválida' }

      const permissions = await this.getUserPermissions(user.id)
      const roles = await this.getUserRoles(user.id)
      const secret = process.env.JWT_SECRET
      if (!secret) return { success: false, message: 'Configuração interna ausente (JWT_SECRET)' }

      const token = jwt.sign(
        { id: user.id, user: user.login, role: roles, perm: permissions },
        secret,
        { expiresIn: '8h' }
      )
      return { success: true, message: 'Login bem-sucedido', token }
    } catch (error) {
      return { success: false, message: 'Falha interna ao autenticar' }
    }
  }

  // Agrega permissões via junções N:N (roles_allowed + role_users)
  private async getUserPermissions(userId: number): Promise<string[]> {
    try {
      const permissions = await db('allowed')
        .join('roles_allowed', 'allowed.id', '=', 'roles_allowed.allowed_id')
        .join('role_users', 'roles_allowed.roles_id', '=', 'role_users.roles_id')
        .where('role_users.users_id', userId)
        .distinct('allowed.permission_name')
        .pluck('permission_name') as string[]
      return permissions
    } catch {
      return []
    }
  }

  // Lista cargos associados ao usuário
  private async getUserRoles(userId: number): Promise<string[]> {
    try {
      const roles = await db('roles')
        .join('role_users', 'roles.id', '=', 'role_users.roles_id')
        .where('role_users.users_id', userId)
        .distinct('roles.role_name')
        .pluck('role_name') as string[]
      return roles
    } catch {
      return []
    }
  }
}

export default new AuthService()
