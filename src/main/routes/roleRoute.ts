import { Response } from 'express'
import { AuthRequest } from '../types'
import roleService from '../services/roleService'

export async function addRoleRoute(req: AuthRequest, res: Response) {
  try {
    const roleData = req.body
    const loggedUser = req.user
    
    const roleResponse = await roleService.addRole(roleData, loggedUser)

    if (roleResponse.success) {
      res.json({
        success: true,
        message: roleResponse.message || 'Sucesso na criação do cargo.'
      })
    } else {
      res.status(400).json(roleResponse)
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
}

export async function getRoleRoute(req: AuthRequest, res: Response) {
  try {
    const { id, role_name, description } = req.query

    const opts: any = {}
    if (id && !isNaN(Number(id))) {
      opts.id = Number(id)
    } else if (role_name && typeof role_name === 'string') {
      opts.role_name = role_name
    } else if (description && typeof description === 'string') {
      opts.description = description
    } else {
      return res.status(400).json({ 
        success: false, 
        message: 'Informe id, role_name ou description como query.' 
      })
    }
    
    const roleResponse = await roleService.searchRoles(opts)
    
    if (roleResponse.success && roleResponse.data) {
      res.json({ success: true, data: roleResponse.data })
    } else if (roleResponse.success && !roleResponse.data) {
      res.status(404).json({ success: false, message: 'Cargo não encontrado.' })
    } else {
      res.status(500).json(roleResponse)
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
}

export async function listRolesRoute(req: AuthRequest, res: Response) {
  try {
    const roleResponse = await roleService.listAllRoles()
    
    if (roleResponse.success) {
      res.json({ success: true, data: roleResponse.data })
    } else {
      res.status(500).json(roleResponse)
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
}

export async function updateRoleRoute(req: AuthRequest, res: Response) {
  try {
    const roleId = parseInt(req.params.id, 10)
    if (isNaN(roleId)) {
      return res.status(400).json({ success: false, message: 'ID inválido' })
    }

    const roleData = req.body
    const loggedUser = req.user
    
    const roleResponse = await roleService.updateRole(roleId, roleData, loggedUser)

    if (roleResponse.success) {
      res.json({
        success: true,
        message: roleResponse.message || 'Cargo atualizado com sucesso.'
      })
    } else {
      res.status(400).json(roleResponse)
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error })
  }
}
