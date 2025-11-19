import db from '../db/db'

interface CargoCLT {
  id_cargo?: number
  nome_cargo: string
  descricao?: string
  salario_base: number
  carga_horaria_semanal?: number
  nivel?: string
  departamento?: string
  ativo?: boolean
}

class CargoService {
  async listarCargos(apenasAtivos: boolean = true): Promise<CargoCLT[]> {
    const query = db('cargos_clt').orderBy('nome_cargo')
    
    if (apenasAtivos) {
      query.where('ativo', 1)
    }
    
    return await query
  }

  async buscarCargoPorId(id: number): Promise<CargoCLT | null> {
    const cargo = await db('cargos_clt')
      .where('id_cargo', id)
      .first()
    
    return cargo || null
  }

  async criarCargo(cargo: CargoCLT): Promise<number> {
    const [id] = await db('cargos_clt').insert({
      nome_cargo: cargo.nome_cargo,
      descricao: cargo.descricao || null,
      salario_base: cargo.salario_base,
      carga_horaria_semanal: cargo.carga_horaria_semanal || 44,
      nivel: cargo.nivel || null,
      departamento: cargo.departamento || null,
      ativo: cargo.ativo !== false ? 1 : 0
    })
    
    return id
  }

  async atualizarCargo(id: number, cargo: Partial<CargoCLT>): Promise<boolean> {
    const dadosAtualizacao: any = {}

    if (cargo.nome_cargo !== undefined) dadosAtualizacao.nome_cargo = cargo.nome_cargo
    if (cargo.descricao !== undefined) dadosAtualizacao.descricao = cargo.descricao
    if (cargo.salario_base !== undefined) dadosAtualizacao.salario_base = cargo.salario_base
    if (cargo.carga_horaria_semanal !== undefined) dadosAtualizacao.carga_horaria_semanal = cargo.carga_horaria_semanal
    if (cargo.nivel !== undefined) dadosAtualizacao.nivel = cargo.nivel
    if (cargo.departamento !== undefined) dadosAtualizacao.departamento = cargo.departamento
    if (cargo.ativo !== undefined) dadosAtualizacao.ativo = cargo.ativo ? 1 : 0

    if (Object.keys(dadosAtualizacao).length === 0) {
      return false
    }

    const result = await db('cargos_clt')
      .where('id_cargo', id)
      .update(dadosAtualizacao)
    
    return result > 0
  }

  async deletarCargo(id: number): Promise<boolean> {
    const result = await db('cargos_clt')
      .where('id_cargo', id)
      .update({ ativo: 0 })
    
    return result > 0
  }

  async cargoEmUso(id: number): Promise<boolean> {
    const count = await db('funcionarios')
      .where('id_cargo', id)
      .where('status', 'ativo')
      .count('* as count')
      .first()
    
    return (count?.count as number) > 0
  }
}

export default new CargoService()
