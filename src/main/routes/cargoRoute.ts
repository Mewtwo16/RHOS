import { Router, Response } from 'express'
import cargoService from '../services/cargoService'
import logService from '../services/logService'
import { AuthRequest } from '../types'

const router = Router()

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const apenasAtivos = req.query.ativos !== 'false'
    const cargos = await cargoService.listarCargos(apenasAtivos)
    
    res.json({
      success: true,
      data: cargos
    })
  } catch (error) {
    console.error('Erro ao listar cargos:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao listar cargos'
    })
  }
})

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const cargo = await cargoService.buscarCargoPorId(id)
    
    if (!cargo) {
      return res.status(404).json({
        success: false,
        message: 'Cargo não encontrado'
      })
    }
    
    res.json({
      success: true,
      data: cargo
    })
  } catch (error) {
    console.error('Erro ao buscar cargo:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar cargo'
    })
  }
})

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { nome_cargo, descricao, salario_base, carga_horaria_semanal, nivel, departamento } = req.body
    
    if (!nome_cargo || !salario_base) {
      return res.status(400).json({
        success: false,
        message: 'Nome do cargo e salário base são obrigatórios'
      })
    }
    
    const id = await cargoService.criarCargo(req.body)
    
    await logService.write({
      user_id: req.user?.id,
      who: req.user?.usuario || 'Sistema',
      where: 'Cargos CLT',
      what: `Criou o cargo: ${nome_cargo}`
    })
    
    res.status(201).json({
      success: true,
      message: 'Cargo criado com sucesso',
      data: { id }
    })
  } catch (error) {
    console.error('Erro ao criar cargo:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao criar cargo'
    })
  }
})

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const cargo = await cargoService.buscarCargoPorId(id)
    
    if (!cargo) {
      return res.status(404).json({
        success: false,
        message: 'Cargo não encontrado'
      })
    }
    
    const sucesso = await cargoService.atualizarCargo(id, req.body)
    
    if (sucesso) {
      await logService.write({
        user_id: req.user?.id,
        who: req.user?.usuario || 'Sistema',
        where: 'Cargos CLT',
        what: `Atualizou o cargo: ${cargo.nome_cargo}`
      })
      
      res.json({
        success: true,
        message: 'Cargo atualizado com sucesso'
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Nenhuma alteração realizada'
      })
    }
  } catch (error) {
    console.error('Erro ao atualizar cargo:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar cargo'
    })
  }
})

router.delete('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const cargo = await cargoService.buscarCargoPorId(id)
    
    if (!cargo) {
      return res.status(404).json({
        success: false,
        message: 'Cargo não encontrado'
      })
    }
    
    const emUso = await cargoService.cargoEmUso(id)
    if (emUso) {
      return res.status(400).json({
        success: false,
        message: 'Não é possível deletar. Cargo está vinculado a funcionários ativos'
      })
    }
    
    const sucesso = await cargoService.deletarCargo(id)
    
    if (sucesso) {
      await logService.write({
        user_id: req.user?.id,
        who: req.user?.usuario || 'Sistema',
        where: 'Cargos CLT',
        what: `Deletou o cargo: ${cargo.nome_cargo}`
      })
      
      res.json({
        success: true,
        message: 'Cargo deletado com sucesso'
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Erro ao deletar cargo'
      })
    }
  } catch (error) {
    console.error('Erro ao deletar cargo:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao deletar cargo'
    })
  }
})

export default router
