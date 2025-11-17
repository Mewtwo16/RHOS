import { useState, useEffect } from 'react'
import '../assets/css/user.css'
import { hasPermission } from '../utils/auth'

interface User {
  id: number
  full_name: string
  email: string
  login: string
  cpf: string
  role: string
  status: number
  birth_date: string
  creation_date: string
}

interface Role {
  id: number
  role_name: string
}

function Usuarios() {
  const [users, setUsers] = useState<User[]>([])
  const [roles, setRoles] = useState<Role[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    login: '',
    password: '',
    cpf: '',
    role: ''
  })

  useEffect(() => {
    loadUsers()
    loadRoles()
  }, [])

  const loadUsers = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:4040/api/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setUsers(data.data || [])
      }
    } catch (err) {
      console.error('Erro ao carregar usuários:', err)
    }
  }

  const loadRoles = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:4040/api/roles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setRoles(data.data || [])
      }
    } catch (err) {
      console.error('Erro ao carregar cargos:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const formatCPF = (cpf: string) => {
    if (!cpf) return ''
    const cleaned = cpf.replace(/\D/g, '')
    if (cleaned.length !== 11) return cpf
    return cleaned.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('authToken')
      const url = editingUser 
        ? `http://localhost:4040/api/user/${editingUser.id}`
        : 'http://localhost:4040/api/user'
      
      const method = editingUser ? 'PUT' : 'POST'
      
      const dataToSend: any = {
        full_name: formData.full_name,
        email: formData.email,
        user: formData.login,
        cpf: formData.cpf,
        role: formData.role
      }

      if (!editingUser) {
        dataToSend.password = formData.password
        dataToSend.birth_date = '1990-01-01'
        dataToSend.status = 1
      } else {
        if (formData.password) {
          dataToSend.password = formData.password
        }
      }
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(dataToSend)
      })

      const data = await response.json()

      if (data.success) {
        alert(editingUser ? 'Usuário atualizado com sucesso!' : 'Usuário cadastrado com sucesso!')
        setShowForm(false)
        setFormData({
          full_name: '',
          email: '',
          login: '',
          password: '',
          cpf: '',
          role: ''
        })
        setEditingUser(null)
        loadUsers()
      } else {
        setError(data.message || `Erro ao ${editingUser ? 'atualizar' : 'cadastrar'} usuário`)
      }
    } catch (err: any) {
      setError(err.message || 'Erro na conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: User) => {
    setEditingUser(user)
    setFormData({
      full_name: user.full_name,
      email: user.email,
      login: user.login,
      password: '', // Deixar vazio na edição
      cpf: user.cpf,
      role: user.role
    })
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setShowForm(false)
    setEditingUser(null)
    setFormData({
      full_name: '',
      email: '',
      login: '',
      password: '',
      cpf: '',
      role: ''
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR')
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
      <div style={{ padding: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{ margin: 0 }}>Gerenciamento de Usuários</h1>
          {hasPermission('users:create') && (
            <button 
              onClick={() => {
                if (showForm) {
                  handleCancelEdit()
                } else {
                  setShowForm(true)
                }
              }}
              style={{
                padding: '10px 20px',
                backgroundColor: showForm ? '#f44336' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              {showForm ? 'Cancelar' : 'Novo Usuário'}
            </button>
          )}
        </div>

        {!hasPermission('users:view') && !hasPermission('users:read') ? (
          <div style={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ffeeba'
          }}>
            ⚠️ Você não tem permissão para visualizar usuários.
          </div>
        ) : (
          <>
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

        {showForm && (
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h2>{editingUser ? 'Editar Usuário' : 'Novo Usuário'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="full_name"
                    value={formData.full_name}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Login *
                  </label>
                  <input
                    type="text"
                    name="login"
                    value={formData.login}
                    onChange={handleInputChange}
                    required
                    disabled={!!editingUser}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                      backgroundColor: editingUser ? '#f0f0f0' : 'white',
                      cursor: editingUser ? 'not-allowed' : 'text'
                    }}
                  />
                  {editingUser && (
                    <small style={{ color: '#666', fontSize: '12px' }}>
                      O login não pode ser alterado
                    </small>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Senha {editingUser ? '(deixe vazio para não alterar)' : '*'}
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required={!editingUser}
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    CPF *
                  </label>
                  <input
                    type="text"
                    name="cpf"
                    value={formData.cpf}
                    onChange={handleInputChange}
                    required
                    placeholder="000.000.000-00"
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                    Cargo *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '4px',
                      border: '1px solid #ccc'
                    }}
                  >
                    <option value="">Selecione um cargo</option>
                    {roles.map(role => (
                      <option key={role.id} value={role.role_name}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ marginTop: '20px' }}>
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    padding: '10px 30px',
                    backgroundColor: loading ? '#ccc' : '#2196F3',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    fontSize: '14px'
                  }}
                >
                  {loading ? 'Salvando...' : 'Salvar'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h2>Lista de Usuários</h2>
          {users.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              Nenhum usuário cadastrado.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{
                width: '100%',
                borderCollapse: 'collapse',
                marginTop: '10px'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>ID</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Nome</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Email</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Login</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>CPF</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Cargo</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Status</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} style={{
                      backgroundColor: index % 2 === 0 ? 'white' : '#fafafa'
                    }}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{user.id}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                        {user.full_name}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                        {user.email}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                        {user.login}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                        {formatCPF(user.cpf)}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: '#e3f2fd',
                          color: '#1976d2',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {user.role || 'Sem cargo'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                        <span style={{
                          padding: '4px 12px',
                          backgroundColor: user.status === 1 ? '#e8f5e9' : '#ffebee',
                          color: user.status === 1 ? '#2e7d32' : '#c62828',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}>
                          {user.status === 1 ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                        {hasPermission('users:update') && (
                          <button
                            onClick={() => handleEdit(user)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#2196F3',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Editar
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Usuarios
