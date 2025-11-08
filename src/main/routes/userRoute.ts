import { Request, Response } from 'express'
import userService from '../services/userService'


/**
 * Cria um novo usuário e vincula o cargo informado.
 * Body: { full_name, email, user, password, cpf, birth_date, role, status }
 * Respostas: 200 sucesso | 400 validação/negócio | 500 erro interno
 */
export async function addUserRoute(req: Request, res: Response) {
  try {
    const userData = req.body;
    const userResponse = await userService.addUser(userData);

    if(userResponse.success){
      res.json({
        success: true,
        message: `Sucesso na criação do usuario!`
      })
    } else {
      res.status(400).json(userResponse)
    }
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || error })
  }
}

/**
 * Consulta um usuário por um único critério (id, full_name, email, login, cpf ou role).
 * Query: ?id= | ?full_name= | ?email= | ?login= | ?cpf= | ?role=
 */
export async function getUserRoute(req: Request, res: Response) {
  try {
    const { id, full_name, email, login, cpf, role } = req.query

    const provided = [id, full_name, email, login, cpf, role].filter(v => v !== undefined)
    if (provided.length === 0) {
      return res.status(400).json({ success: false, message: 'Informe um parâmetro de busca: id, full_name, email, login, cpf ou role.' })
    }
    if (provided.length > 1) {
      return res.status(400).json({ success: false, message: 'Informe apenas um parâmetro de busca por requisição.' })
    }

    const opts: any = {}
    if (id && !isNaN(Number(id))) opts.id = Number(id)
    else if (typeof full_name === 'string') opts.full_name = full_name
    else if (typeof email === 'string') opts.email = email
    else if (typeof login === 'string') opts.login = login
    else if (typeof cpf === 'string') opts.cpf = cpf
    else if (typeof role === 'string') opts.role = role

    const user = await userService.searchUser(opts)
    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado.' })
    res.json({ success: true, data: user })
  } catch (error: any) {
    res.status(500).json({ success: false, message: error?.message || error })
  }
}
