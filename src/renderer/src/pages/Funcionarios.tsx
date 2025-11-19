import { useState, useEffect } from 'react'
import '../assets/css/global.css'

interface Funcionario {
  id_funcionario: number
  nome_completo: string
  cpf: string
  nome_cargo: string
  salario_atual: number
  status: string
  data_admissao: string
}

function Funcionarios() {
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroStatus, setFiltroStatus] = useState('ativo')

  useEffect(() => {
    carregarFuncionarios()
  }, [filtroStatus])

  const carregarFuncionarios = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('authToken')
      const url = filtroStatus
        ? `http://localhost:3000/api/funcionarios?status=${filtroStatus}`
        : 'http://localhost:3000/api/funcionarios'

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setFuncionarios(data.data)
      }
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatarMoeda = (valor: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(valor)
  }

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR')
  }

  const formatarCPF = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ativo: '#28a745',
      ferias: '#ffc107',
      afastado: '#17a2b8',
      demitido: '#dc3545'
    }
    return colors[status] || '#6c757d'
  }

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}
      >
        <p>Carregando funcionários...</p>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px', height: '100%', overflow: 'auto' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px'
        }}
      >
        <h1 style={{ color: '#2a626a', margin: 0 }}>👥 Gestão de Funcionários</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid #e0e0e0',
              fontSize: '14px'
            }}
          >
            <option value="">Todos</option>
            <option value="ativo">Ativos</option>
            <option value="ferias">Férias</option>
            <option value="afastado">Afastados</option>
            <option value="demitido">Demitidos</option>
          </select>
          <button
            style={{
              padding: '8px 16px',
              backgroundColor: '#2a626a',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500'
            }}
          >
            + Novo Funcionário
          </button>
        </div>
      </div>

      <div
        style={{
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          overflow: 'hidden'
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f7f8fa', borderBottom: '2px solid #e0e0e0' }}>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Nome</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>CPF</th>
              <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600' }}>Cargo</th>
              <th style={{ padding: '12px', textAlign: 'right', fontWeight: '600' }}>Salário</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Status</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Admissão</th>
              <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {funcionarios.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                  Nenhum funcionário encontrado
                </td>
              </tr>
            ) : (
              funcionarios.map((func) => (
                <tr
                  key={func.id_funcionario}
                  style={{ borderBottom: '1px solid #e0e0e0' }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f9f9f9')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                >
                  <td style={{ padding: '12px' }}>{func.nome_completo}</td>
                  <td style={{ padding: '12px', fontSize: '14px', color: '#666' }}>
                    {formatarCPF(func.cpf)}
                  </td>
                  <td style={{ padding: '12px' }}>{func.nome_cargo}</td>
                  <td style={{ padding: '12px', textAlign: 'right', fontWeight: '500' }}>
                    {formatarMoeda(func.salario_atual)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <span
                      style={{
                        padding: '4px 12px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '500',
                        color: 'white',
                        backgroundColor: getStatusColor(func.status),
                        textTransform: 'capitalize'
                      }}
                    >
                      {func.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', fontSize: '14px' }}>
                    {formatarData(func.data_admissao)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#44a0a8',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px',
                        marginRight: '5px'
                      }}
                      onClick={() => console.log('Ver detalhes', func.id_funcionario)}
                    >
                      📊 Calcular
                    </button>
                    <button
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                      onClick={() => console.log('Editar', func.id_funcionario)}
                    >
                      ✏️ Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div
        style={{
          marginTop: '20px',
          padding: '15px',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          display: 'flex',
          justifyContent: 'space-between'
        }}
      >
        <div>
          <strong>Total de funcionários:</strong> {funcionarios.length}
        </div>
        <div>
          <strong>Custo Total (salários):</strong>{' '}
          {formatarMoeda(funcionarios.reduce((acc, f) => acc + f.salario_atual, 0))}
        </div>
        <div style={{ color: '#666', fontSize: '14px' }}>
          * Custo total estimado (com encargos):{' '}
          {formatarMoeda(
            funcionarios.reduce((acc, f) => acc + f.salario_atual, 0) * 1.383
          )}
        </div>
      </div>
    </div>
  )
}

export default Funcionarios
