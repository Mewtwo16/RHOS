import { Router, Response } from 'express'
import funcionarioService from '../services/funcionarioService'
import logService from '../services/logService'
import { AuthRequest } from '../types'

const router = Router()

router.get('/', async (req: AuthRequest, res: Response) => {
  try {
    const status = req.query.status as string | undefined
    const funcionarios = await funcionarioService.listarFuncionarios(status)
    
    res.json({
      success: true,
      data: funcionarios
    })
  } catch (error) {
    console.error('Erro ao listar funcionários:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao listar funcionários'
    })
  }
})

router.get('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const funcionario = await funcionarioService.buscarFuncionarioPorId(id)
    
    if (!funcionario) {
      return res.status(404).json({
        success: false,
        message: 'Funcionário não encontrado'
      })
    }
    
    res.json({
      success: true,
      data: funcionario
    })
  } catch (error) {
    console.error('Erro ao buscar funcionário:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao buscar funcionário'
    })
  }
})

router.post('/', async (req: AuthRequest, res: Response) => {
  try {
    const { nome_completo, cpf, salario_atual, id_cargo, data_admissao } = req.body
    
    if (!nome_completo || !cpf || !salario_atual || !id_cargo || !data_admissao) {
      return res.status(400).json({
        success: false,
        message: 'Campos obrigatórios: nome_completo, cpf, salario_atual, id_cargo, data_admissao'
      })
    }
    
    const existente = await funcionarioService.buscarFuncionarioPorCPF(cpf)
    if (existente) {
      return res.status(400).json({
        success: false,
        message: 'CPF já cadastrado'
      })
    }
    
    const id = await funcionarioService.criarFuncionario(req.body)
    
    await logService.write({
      user_id: req.user?.id,
      who: req.user?.usuario || 'Sistema',
      where: 'Funcionários',
      what: `Cadastrou o funcionário: ${nome_completo}`
    })
    
    res.status(201).json({
      success: true,
      message: 'Funcionário cadastrado com sucesso',
      data: { id }
    })
  } catch (error) {
    console.error('Erro ao criar funcionário:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao criar funcionário'
    })
  }
})

router.put('/:id', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const funcionario = await funcionarioService.buscarFuncionarioPorId(id)
    
    if (!funcionario) {
      return res.status(404).json({
        success: false,
        message: 'Funcionário não encontrado'
      })
    }
    
    const sucesso = await funcionarioService.atualizarFuncionario(id, req.body)
    
    if (sucesso) {
      await logService.write({
        user_id: req.user?.id,
        who: req.user?.usuario || 'Sistema',
        where: 'Funcionários',
        what: `Atualizou o funcionário: ${funcionario.nome_completo}`
      })
      
      res.json({
        success: true,
        message: 'Funcionário atualizado com sucesso'
      })
    } else {
      res.status(400).json({
        success: false,
        message: 'Nenhuma alteração realizada'
      })
    }
  } catch (error) {
    console.error('Erro ao atualizar funcionário:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao atualizar funcionário'
    })
  }
})

router.get('/:id/calcular', async (req: AuthRequest, res: Response) => {
  try {
    const id = parseInt(req.params.id)
    const calculo = await funcionarioService.calcularFolhaPagamento(id)
    
    res.json({
      success: true,
      data: calculo
    })
  } catch (error) {
    console.error('Erro ao calcular folha:', error)
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Erro ao calcular folha'
    })
  }
})

router.get('/stats/geral', async (req: AuthRequest, res: Response) => {
  try {
    const stats = await funcionarioService.obterEstatisticas()
    
    res.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('Erro ao obter estatísticas:', error)
    res.status(500).json({
      success: false,
      message: 'Erro ao obter estatísticas'
    })
  }
})

export default router
