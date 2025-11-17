import logService from './logService'
import db from '../db/db'
import type { Role, addRole, AnyResponse, AuthUser } from '../types'

class RoleService {
  async addRole(roleData: addRole, loggedUser?: AuthUser): Promise<AnyResponse> {
    try {
      const result = await db.transaction(async (trx) => {
        const [roleId] = await trx('roles').insert({
          role_name: roleData.role_name,
          description: roleData.description || null
        })

        const permissions = roleData.permissions || []
        const assigned: string[] = []

        for (const perm of permissions) {
          let allowed = await trx('allowed').where({ permission_name: perm }).first()
          
          if (!allowed) {
            const [newId] = await trx('allowed').insert({ permission_name: perm })
            allowed = { id: newId, permission_name: perm }
          }

          const exists = await trx('roles_allowed')
            .where({ roles_id: roleId, allowed_id: allowed.id })
            .first()

          if (!exists) {
            await trx('roles_allowed').insert({ 
              roles_id: roleId, 
              allowed_id: allowed.id 
            })
            assigned.push(perm)
          }
        }

        await logService.write({
          user_id: loggedUser?.id || null,
          who: loggedUser?.usuario || 'system',
          where: 'roles',
          what: `Criou cargo ${roleData.role_name} com ${assigned.length} permissões`
        }, trx)

        return { roleId, assigned }
      })

      return {
        success: true,
        message: `Cargo criado com ${result.assigned.length} permissões`
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao criar cargo'
      }
    }
  }

  async searchRoles(options: { 
    id?: number
    role_name?: string
    description?: string 
  }): Promise<AnyResponse> {
    try {
      const query = db('roles as r')
        .select('r.id', 'r.role_name', 'r.description')

      if (options.id) {
        query.where('r.id', options.id)
      } else if (options.role_name) {
        query.where('r.role_name', 'like', `%${options.role_name}%`)
      } else if (options.description) {
        query.where('r.description', 'like', `%${options.description}%`)
      } else {
        return { success: false, message: 'Parâmetro de busca inválido' }
      }

      const role = await query.first()
      if (!role) return { success: true, data: null }

      const permissions = await db('allowed as a')
        .join('roles_allowed as ra', 'ra.allowed_id', 'a.id')
        .where('ra.roles_id', role.id)
        .distinct('a.permission_name')
        .pluck('permission_name')

      return { 
        success: true, 
        data: { ...role, permissions } 
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao buscar cargo'
      }
    }
  }

  async listAllRoles(): Promise<AnyResponse> {
    try {
      const roles = await db('roles')
        .select('id', 'role_name', 'description')
        .orderBy('role_name', 'asc')

      const rolesWithPermissions = await Promise.all(
        roles.map(async (role) => {
          const permissions = await db('allowed as a')
            .join('roles_allowed as ra', 'ra.allowed_id', 'a.id')
            .where('ra.roles_id', role.id)
            .distinct('a.permission_name')
            .pluck('permission_name')
          
          return { ...role, permissions }
        })
      )

      return { success: true, data: rolesWithPermissions }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao listar cargos'
      }
    }
  }

  async updateRole(roleId: number, roleData: Partial<addRole>, loggedUser?: AuthUser): Promise<AnyResponse> {
    try {
      const result = await db.transaction(async (trx) => {
        const existingRole = await trx('roles').where({ id: roleId }).first()
        if (!existingRole) {
          throw new Error('Cargo não encontrado')
        }

        if (roleData.description !== undefined) {
          await trx('roles')
            .where({ id: roleId })
            .update({ description: roleData.description })
        }

        let assigned: string[] = []
        if (roleData.permissions) {
          await trx('roles_allowed').where({ roles_id: roleId }).delete()

          for (const perm of roleData.permissions) {
            let allowed = await trx('allowed').where({ permission_name: perm }).first()
            
            if (!allowed) {
              const [newId] = await trx('allowed').insert({ permission_name: perm })
              allowed = { id: newId, permission_name: perm }
            }

            await trx('roles_allowed').insert({ 
              roles_id: roleId, 
              allowed_id: allowed.id 
            })
            assigned.push(perm)
          }
        }

        await logService.write({
          user_id: loggedUser?.id || null,
          who: loggedUser?.usuario || 'system',
          where: 'roles',
          what: `Atualizou cargo ${existingRole.role_name} com ${assigned.length} permissões`
        }, trx)

        return { assigned }
      })

      return {
        success: true,
        message: `Cargo atualizado com sucesso`
      }
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Erro ao atualizar cargo'
      }
    }
  }
}

export default new RoleService()
