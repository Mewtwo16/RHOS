import { Request, Response } from 'express'
import roleService from '../services/roleService'

/**
 * Cria um novo cargo e, opcionalmente, associa permissões.
 * Body: { role_name, description?, permissions?: string[] }
 */
export async function addRoleRoute(req: Request, res: Response) {
    try {
        const roleData = req.body
        const roleResponse = await roleService.addRole(roleData);

        if (roleResponse.success) {
            res.json({
                success: true,
                message: roleResponse.message || 'Sucesso na criação do cargo.'
            })
        } else {
            res.status(400).json(roleResponse)
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error
        })
    }
}

/**
 * Retorna um cargo único com suas permissões.
 * Query (um parâmetro): id | role_name | description
 */
export async function getRoleRoute(req: Request, res: Response) {
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
            return res.status(400).json({ success: false, message: 'Informe id, role_name ou description como query.' })
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
        res.status(500).json({
            success: false,
            message: error
        })
    }
}