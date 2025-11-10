import bcrypt from 'bcrypt'
import db from '../db/db'
import logService from './logService'
import { addUser, AnyResponse, User } from '../types'

class UserService {
  // Create
  async addUser(userData: addUser) {
    const saltRounds = 10
    const senhaHash = await bcrypt.hash(userData.password, saltRounds)
    try {
      await db.transaction(async (trx) => {
        const [newUserID] = await trx('users').insert({
          full_name: userData.full_name,
          email: userData.email,
          cpf: userData.cpf,
          birth_date: userData.birth_date,
          login: userData.user,
          password_hash: senhaHash,
          status: userData.status,
          creation_date: new Date()
        })

        const role = await trx('roles').where({ role_name: userData.role }).first()

        if (!role) {
          return { succes: false, message: `O cargo '${userData.role}' não foi encontrado.` }
        }
        await trx('role_users').insert({
          users_id: newUserID,
          roles_id: role.id
        })
        try {
          await logService.writeLogs(
            {
              user_id: newUserID,
              username: userData.user,
              action: 'create',
              resource: 'users',
              resource_id: newUserID,
              details: `Criado usuário ${userData.user} com role ${userData.role}`
            },
            trx
          )
        } catch (error) {
          return {
            success: false,
            message: `[LogService Error] Erro ao gravar logs ${error}`
          }
        }
      })
    } catch (error) {
      return {
        success: false,
        message: `[addUser ERROR] Erro na criação de usuario: ${error}`
      }
    }
    return { success: true, message: `[addUser] Sucesso na criação de usuario` }
  }

  // Update
 async updateUser(id: number, changes: Partial<addUser>) {
  try {
    return await db.transaction(async (trx) => {
      const currentUser = await trx('users as u')
        .leftJoin('role_users as ru', 'ru.users_id', 'u.id')
        .leftJoin('roles as r', 'r.id', 'ru.roles_id')
        .select(
          'u.id',
          'u.full_name',
          'u.email',
          'u.login',
          'u.cpf',
          'u.birth_date',
          'u.status',
          'r.role_name as role'
        )
        .where('u.id', id)
        .first()

      if (!currentUser) {
        return { success: false, message: 'Usuário não encontrado.' }
      }

      const updateData: Record<string, any> = {}
      const diffFields: string[] = []

      // Mapeamento de campos simples
      const mapping: Record<string, keyof addUser | 'login'> = {
        full_name: 'full_name',
        email: 'email',
        cpf: 'cpf',
        birth_date: 'birth_date',
        status: 'status',
        user: 'user' // será login na tabela
      }

      for (const [dbField, inputField] of Object.entries(mapping)) {
        const value = (changes as any)[inputField]
        if (value !== undefined && value !== (currentUser as any)[dbField === 'user' ? 'login' : dbField]) {
          updateData[dbField === 'user' ? 'login' : dbField] = value
          diffFields.push(dbField === 'user' ? 'login' : dbField)
        }
      }

      // Senha
      if (changes.password) {
        const senhaHash = await bcrypt.hash(changes.password, 10)
        updateData.password_hash = senhaHash
        diffFields.push('password')
      }

      // Unicidade (só se alterou)
      if (updateData.email) {
        const existEmail = await trx('users').where({ email: updateData.email }).whereNot({ id }).first()
        if (existEmail) return { success: false, message: 'Email já utilizado.' }
      }
      if (updateData.cpf) {
        const existCpf = await trx('users').where({ cpf: updateData.cpf }).whereNot({ id }).first()
        if (existCpf) return { success: false, message: 'CPF já utilizado.' }
      }
      if (updateData.login) {
        const existLogin = await trx('users').where({ login: updateData.login }).whereNot({ id }).first()
        if (existLogin) return { success: false, message: 'Login já utilizado.' }
      }

      // Role (pivot)
      if (changes.role && changes.role !== currentUser.role) {
        const newRole = await trx('roles').where({ role_name: changes.role }).first()
        if (!newRole) return { success: false, message: 'Nova role não encontrada.' }

        const pivot = await trx('role_users').where({ users_id: id }).first()
        if (pivot) {
          await trx('role_users').where({ users_id: id }).update({ roles_id: newRole.id })
        } else {
          await trx('role_users').insert({ users_id: id, roles_id: newRole.id })
        }
        diffFields.push('role')
      }

      if (Object.keys(updateData).length === 0 && !diffFields.includes('role')) {
        return { success: false, message: 'Nenhuma alteração detectada.' }
      }

      // Execução do update principal
      if (Object.keys(updateData).length > 0) {
        await trx('users').where({ id }).update(updateData)
      }

      // Log detalhado
      try {
        await logService.writeLogs(
          {
            user_id: id,
            username: currentUser.login,
            action: 'update',
            resource: 'users',
            resource_id: id,
            details: `Campos alterados: ${diffFields.join(', ')}`
          },
          trx
        )
      } catch (e) {
        return { success: false, message: 'Atualizado, mas falhou ao gravar log.' }
      }

      return { success: true, message: 'Usuário atualizado com sucesso.' }
    })
  } catch (error) {
    return { success: false, message: `[updateUser ERROR] ${error}` }
  }
}

  // Get Users
  async getUsers(): Promise<AnyResponse> {
    try {
      const users = await db('users').select('*')
      return { success: true, message: '[getUsers] Sucesso ao buscar usuarios', data: users }
    } catch (error) {
      return { success: false, message: `[getUsers ERROR] Erro ao buscar usuarios: ${error}` }
    }
  }

  // Delete


  // Show user
  async showUser(options?: {
    id?: number
    full_name?: string
    email?: string
    login?: string
    cpf?: string
    role?: string
  }) {
    try {
      if (!options) return null
      const q = db('users as u')
        .leftJoin('role_users as ru', 'ru.users_id', 'u.id')
        .leftJoin('roles as r', 'r.id', 'ru.roles_id')
        .select(
          'u.id',
          'u.full_name',
          'u.email',
          'u.login',
          'u.cpf',
          'u.birth_date',
          'u.status',
          db.raw('COALESCE(r.role_name, ?) as role', [''])
        )
        .orderBy('u.full_name', 'asc')

      if (typeof options.id === 'number') {
        q.where('u.id', options.id)
      } else if (options.full_name) {
        q.where('u.full_name', 'like', `%${options.full_name}%`)
      } else if (options.email) {
        q.where('u.email', 'like', `%${options.email}%`)
      } else if (options.login) {
        q.where('u.login', 'like', `%${options.login}%`)
      } else if (options.cpf) {
        q.where('u.cpf', 'like', options.cpf.replace(/\D+/g, '') + '%')
      } else if (options.role) {
        q.where('r.role_name', 'like', `%${options.role}%`)
      } else {
        return null
      }

      const row = await q.first()
      if (!row) return null
      return {
        id: row.id,
        full_name: row.full_name,
        email: row.email,
        login: row.login,
        cpf: row.cpf,
        birth_date: row.birth_date,
        status: row.status,
        role: row.role
      }
    } catch (error) {
      console.error('[UserService.searchUser] ', error)
      throw new Error('Falha ao buscar usuário')
    }
  }
}

export default new UserService()
