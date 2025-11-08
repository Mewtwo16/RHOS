import bcrypt from 'bcrypt'
import db from '../db/db'
import logService from './logService'
import { addUser } from '../types'

class UserService {
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
        message: `[UserService:addUser ERROR] Erro na criação de usuario: ${error}`
      }
    }
    return {success: true, message: `[addUser] Susscesso na criação de usuario`}
  }

  async searchUser(options?: { id?: number; full_name?: string; email?: string; login?: string; cpf?: string; role?: string }) {
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
