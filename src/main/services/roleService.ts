import logService from './logService'
import db from '../db/db'
import type { Role, addRole, AnyResponse } from '../types'

class RoleService {
  // Retorna todos os cargos (sem permissões agregadas)
  async getAllRoles(): Promise<Role[] | AnyResponse> {
    try {
      const roles = await db<Role>('roles').select('*')
      return roles
    } catch (error) {
      return { success: false, message: `Erro ao buscar cargos: ${error}` }
    }
  }

  // Cria cargo e relaciona permissões (upsert + vínculo)
  async addRole(roleData: addRole) {
    try {
      const result = await db.transaction(async (trx) => {
        const [roleId] = await trx('roles').insert({
          role_name: roleData.role_name,
          description: roleData.description || null
        })

        const permissions = Array.isArray(roleData.permissions) ? roleData.permissions : []
        const assigned: string[] = []

        if (permissions.length > 0) {
          for (const perm of permissions) {
            const existing = await trx('allowed').where({ permission_name: perm }).first()
            let allowedId: number
            if (!existing) {
              const [newId] = await trx('allowed').insert({ permission_name: perm })
              allowedId = newId
            } else {
              allowedId = existing.id
            }
            const rel = await trx('roles_allowed').where({ roles_id: roleId, allowed_id: allowedId }).first()
            if (!rel) {
              await trx('roles_allowed').insert({ roles_id: roleId, allowed_id: allowedId })
            }
            assigned.push(perm)
          }
        }

        return { roleId, assigned }
      })

      await logService.writeLogs({
        user_id: null,
        username: null,
        action: 'create',
        resource: 'roles',
        resource_id: result.roleId,
        details: `Criado cargo ${roleData.role_name} com permissões: ${result.assigned.join(', ') || 'nenhuma'}`
      })
      return {
        success: true,
        message: `Sucesso no cadastro de cargo com ${result.assigned.length} permissões`,
      }
    } catch (error) {
      return {
        success: false,
        message: `[RoleService ERROR] Falha ao adicionar cargo! ${error}`
      }
    }
  }

  // Busca um cargo único e agrega suas permissões
  async searchRoles(options?: { id?: number; role_name?: string; description?: string }){
    try {
      if (!options) {
        return { success: false, message: 'Nenhum parâmetro de busca fornecido.' }
      }

      if (typeof options.id === 'number') {
        const role = await db<Role>('roles as r').select('r.id','r.role_name','r.description').where('r.id', options.id).first()
        if (!role) return { success: true, data: null }
        const permissions = await db('allowed as a')
          .join('roles_allowed as ra', 'ra.allowed_id', 'a.id')
          .where('ra.roles_id', role.id)
          .distinct('a.permission_name')
          .pluck('permission_name') as string[]
        return { success: true, data: { ...role, permissions } }
      }

      if (typeof options.role_name === 'string' && options.role_name.length > 0) {
        const val = `%${options.role_name}%`
        const role = await db<Role>('roles as r').select('r.id','r.role_name','r.description').where('r.role_name', 'like', val).first()
        if (!role) return { success: true, data: null }
        const permissions = await db('allowed as a')
          .join('roles_allowed as ra', 'ra.allowed_id', 'a.id')
          .where('ra.roles_id', role.id)
          .distinct('a.permission_name')
          .pluck('permission_name') as string[]
        return { success: true, data: { ...role, permissions } }
      }

      if (typeof options.description === 'string' && options.description.length > 0) {
        const val = `%${options.description}%`
        const role = await db<Role>('roles as r').select('r.id','r.role_name','r.description').where('r.description', 'like', val).first()
        if (!role) return { success: true, data: null }
        const permissions = await db('allowed as a')
          .join('roles_allowed as ra', 'ra.allowed_id', 'a.id')
          .where('ra.roles_id', role.id)
          .distinct('a.permission_name')
          .pluck('permission_name') as string[]
        return { success: true, data: { ...role, permissions } }
      }

      return { success: false, message: 'Parâmetros inválidos para busca.' }
    } catch (error) {
      console.error('[RoleService.searchRoles] ', error)
      return { success: false, message: `[RoleService ERROR] Falha ao buscar cargo: ${error}` }
    }
  }
}

export default new RoleService()
