import { useState, useEffect } from 'react'
import '../assets/css/logs.css'
import { hasPermission } from '../utils/auth'

interface Log {
  id: number
  user_id: number | null
  who: string | null
  where: string
  when: string
  what: string
}

function Logs() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const fetchLogs = async () => {
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:4040/api/logs', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const data = await response.json()

      if (data.success) {
        setLogs(data.data || [])
      } else {
        setError(data.message || 'Erro ao carregar logs')
      }
    } catch (err: any) {
      setError(err.message || 'Erro na conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      height: '100%', 
      width: '100%', 
      display: 'flex',
      flexDirection: 'column',
      background: '#fafbfc',
      overflow: 'auto'
    }}>
      {!hasPermission('logs:read') ? (
        <div style={{ padding: '20px' }}>
          <h1>Acesso Negado</h1>
          <p>Você não tem permissão para visualizar os logs do sistema.</p>
        </div>
      ) : (
        <div style={{ padding: '20px' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <h1 style={{ margin: 0 }}>Logs do Sistema</h1>
            <button 
              onClick={fetchLogs}
              disabled={loading}
              style={{
                padding: '10px 20px',
                backgroundColor: loading ? '#ccc' : '#2196F3',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '14px'
              }}
            >
              {loading ? 'Carregando...' : 'Atualizar'}
            </button>
          </div>

          {error && (
            <div style={{
              backgroundColor: '#f44336',
              color: 'white',
              padding: '10px',
              borderRadius: '4px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}>
            {loading ? (
              <p>Carregando logs...</p>
            ) : logs.length === 0 ? (
              <p style={{ color: '#666', fontStyle: 'italic' }}>
                Clique em "Pesquisar" para carregar os logs.
              </p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f5f5f5' }}>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Quem</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Onde</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Quando</th>
                      <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>O que</th>
                    </tr>
                  </thead>
                  <tbody>
                    {logs.map((log, index) => (
                      <tr key={log.id} style={{
                        backgroundColor: index % 2 === 0 ? 'white' : '#fafafa'
                      }}>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{log.id}</td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                          {log.who || `ID: ${log.user_id || 'Sistema'}`}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                          {log.where}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                          {new Date(log.when).toLocaleString('pt-BR')}
                        </td>
                        <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{log.what}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Logs
