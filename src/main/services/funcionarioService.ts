import db from '../db/db'

interface Funcionario {
  id_funcionario?: number
  nome_completo: string
  cpf: string
  rg?: string
  data_nascimento: string
  sexo?: string
  estado_civil?: string
  nacionalidade?: string
  telefone?: string
  email?: string
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  id_cargo: number
  data_admissao: string
  data_demissao?: string
  status?: string
  tipo_contrato?: string
  banco?: string
  agencia?: string
  conta?: string
  tipo_conta?: string
  salario_atual: number
  vale_transporte?: boolean
  vale_alimentacao?: number
  plano_saude?: boolean
  plano_odonto?: boolean
  numero_dependentes?: number
  ctps_numero?: string
  ctps_serie?: string
  ctps_uf?: string
  pis_pasep?: string
  titulo_eleitor?: string
  observacoes?: string
}

interface CalculoFolha {
  salarioBruto: number
  inss: number
  irrf: number
  valeTransporteDesc: number
  totalDescontos: number
  salarioLiquido: number
  fgts: number
  inssPatronal: number
  rat: number
  sistemaS: number
  salarioEducacao: number
  totalEncargos: number
  custoTotal: number
}

class FuncionarioService {
  async listarFuncionarios(status?: string): Promise<any[]> {
    let query = db('funcionarios as f')
      .leftJoin('cargos_clt as c', 'f.id_cargo', 'c.id_cargo')
      .select(
        'f.*',
        'c.nome_cargo',
        'c.nivel',
        'c.departamento'
      )
      .orderBy('f.nome_completo')

    if (status) {
      query = query.where('f.status', status)
    }

    return await query
  }

  async buscarFuncionarioPorId(id: number): Promise<any | null> {
    const funcionario = await db('funcionarios as f')
      .leftJoin('cargos_clt as c', 'f.id_cargo', 'c.id_cargo')
      .select(
        'f.*',
        'c.nome_cargo',
        'c.nivel',
        'c.departamento',
        'c.salario_base'
      )
      .where('f.id_funcionario', id)
      .first()

    return funcionario || null
  }

  async buscarFuncionarioPorCPF(cpf: string): Promise<Funcionario | null> {
    const funcionario = await db('funcionarios')
      .where('cpf', cpf)
      .first()

    return funcionario || null
  }

  async criarFuncionario(funcionario: Funcionario): Promise<number> {
    const [id] = await db('funcionarios').insert({
      nome_completo: funcionario.nome_completo,
      cpf: funcionario.cpf,
      rg: funcionario.rg || null,
      data_nascimento: funcionario.data_nascimento,
      sexo: funcionario.sexo || null,
      estado_civil: funcionario.estado_civil || null,
      nacionalidade: funcionario.nacionalidade || 'Brasileiro',
      telefone: funcionario.telefone || null,
      email: funcionario.email || null,
      cep: funcionario.cep || null,
      logradouro: funcionario.logradouro || null,
      numero: funcionario.numero || null,
      complemento: funcionario.complemento || null,
      bairro: funcionario.bairro || null,
      cidade: funcionario.cidade || null,
      estado: funcionario.estado || null,
      id_cargo: funcionario.id_cargo,
      data_admissao: funcionario.data_admissao,
      data_demissao: funcionario.data_demissao || null,
      status: funcionario.status || 'ativo',
      tipo_contrato: funcionario.tipo_contrato || 'CLT',
      banco: funcionario.banco || null,
      agencia: funcionario.agencia || null,
      conta: funcionario.conta || null,
      tipo_conta: funcionario.tipo_conta || null,
      salario_atual: funcionario.salario_atual,
      vale_transporte: funcionario.vale_transporte ? 1 : 0,
      vale_alimentacao: funcionario.vale_alimentacao || 0,
      plano_saude: funcionario.plano_saude ? 1 : 0,
      plano_odonto: funcionario.plano_odonto ? 1 : 0,
      numero_dependentes: funcionario.numero_dependentes || 0,
      ctps_numero: funcionario.ctps_numero || null,
      ctps_serie: funcionario.ctps_serie || null,
      ctps_uf: funcionario.ctps_uf || null,
      pis_pasep: funcionario.pis_pasep || null,
      titulo_eleitor: funcionario.titulo_eleitor || null,
      observacoes: funcionario.observacoes || null
    })

    return id
  }

  async atualizarFuncionario(id: number, funcionario: Partial<Funcionario>): Promise<boolean> {
    const dadosAtualizacao: any = {}

    Object.keys(funcionario).forEach((key) => {
      const typedKey = key as keyof Funcionario
      if (funcionario[typedKey] !== undefined) {
        dadosAtualizacao[key] = funcionario[typedKey]
      }
    })

    if (Object.keys(dadosAtualizacao).length === 0) {
      return false
    }

    const result = await db('funcionarios')
      .where('id_funcionario', id)
      .update(dadosAtualizacao)

    return result > 0
  }

  async inativarFuncionario(id: number, dataDesligamento: string): Promise<boolean> {
    const result = await db('funcionarios')
      .where('id_funcionario', id)
      .update({
        status: 'demitido',
        data_demissao: dataDesligamento
      })

    return result > 0
  }

  private calcularINSS(salarioBruto: number): number {
    const faixas = [
      { limite: 1412.00, aliquota: 0.075, limiteAnterior: 0 },
      { limite: 2666.68, aliquota: 0.09, limiteAnterior: 1412.00 },
      { limite: 4000.03, aliquota: 0.12, limiteAnterior: 2666.68 },
      { limite: 7786.02, aliquota: 0.14, limiteAnterior: 4000.03 }
    ]

    let inss = 0
    let salarioRestante = salarioBruto

    for (const faixa of faixas) {
      if (salarioRestante <= 0) break

      const baseCalculo = Math.min(salarioRestante, faixa.limite - faixa.limiteAnterior)
      inss += baseCalculo * faixa.aliquota
      salarioRestante -= baseCalculo
    }

    return Math.min(inss, 908.85)
  }

  private calcularIRRF(salarioBruto: number, inss: number, dependentes: number): number {
    const deducaoPorDependente = 189.59
    const baseCalculo = salarioBruto - inss - (deducaoPorDependente * dependentes)

    if (baseCalculo <= 2259.20) return 0
    if (baseCalculo <= 2826.65) return Math.max(0, baseCalculo * 0.075 - 169.44)
    if (baseCalculo <= 3751.05) return Math.max(0, baseCalculo * 0.15 - 381.44)
    if (baseCalculo <= 4664.68) return Math.max(0, baseCalculo * 0.225 - 662.77)
    return Math.max(0, baseCalculo * 0.275 - 896.00)
  }

  private calcularEncargosPatronais(salarioBruto: number): any {
    return {
      inssPatronal: salarioBruto * 0.20,
      rat: salarioBruto * 0.02,
      sistemaS: salarioBruto * 0.058,
      salarioEducacao: salarioBruto * 0.025,
      fgts: salarioBruto * 0.08,
      total: salarioBruto * 0.383
    }
  }

  async calcularFolhaPagamento(idFuncionario: number): Promise<CalculoFolha> {
    const funcionario = await this.buscarFuncionarioPorId(idFuncionario)

    if (!funcionario) {
      throw new Error('Funcionário não encontrado')
    }

    const salarioBruto = funcionario.salario_atual
    const inss = this.calcularINSS(salarioBruto)
    const irrf = this.calcularIRRF(salarioBruto, inss, funcionario.numero_dependentes || 0)

    let valeTransporteDesc = 0
    if (funcionario.vale_transporte) {
      valeTransporteDesc = salarioBruto * 0.06
    }

    const totalDescontos = inss + irrf + valeTransporteDesc
    const salarioLiquido = salarioBruto - totalDescontos

    const encargos = this.calcularEncargosPatronais(salarioBruto)

    const beneficiosEmpresa = (funcionario.vale_alimentacao || 0)

    const custoTotal = salarioBruto + encargos.total + beneficiosEmpresa

    return {
      salarioBruto,
      inss,
      irrf,
      valeTransporteDesc,
      totalDescontos,
      salarioLiquido,
      fgts: encargos.fgts,
      inssPatronal: encargos.inssPatronal,
      rat: encargos.rat,
      sistemaS: encargos.sistemaS,
      salarioEducacao: encargos.salarioEducacao,
      totalEncargos: encargos.total,
      custoTotal
    }
  }

  async obterEstatisticas(): Promise<any> {
    const totalAtivos = await db('funcionarios')
      .where('status', 'ativo')
      .count('* as count')
      .first()

    const totalFuncionarios = await db('funcionarios')
      .count('* as count')
      .first()

    const custoTotal = await db('funcionarios')
      .where('status', 'ativo')
      .sum('salario_atual as total')
      .first()

    return {
      totalAtivos: totalAtivos?.count || 0,
      totalFuncionarios: totalFuncionarios?.count || 0,
      custoSalarios: custoTotal?.total || 0,
      custoTotalEstimado: (custoTotal?.total || 0) * 1.383 // Incluindo encargos médios
    }
  }
}

export default new FuncionarioService()
