import { useState, useEffect } from 'react'
import { translatePermission, groupPermissionsByCategory } from '../utils/permissionTranslator'
import { hasPermission } from '../utils/auth'

interface Role {
  id: number
  profile_name: string
  description: string
  permissions?: string[]
}

interface Permission {
  id: number
  permission_name: string
}

function Perfis() {
  const [roles, setRoles] = useState<Role[]>([])
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)
  const [formData, setFormData] = useState({
    profile_name: '',
    description: ''
  })

  useEffect(() => {
    loadRoles()
    loadPermissions()
  }, [])

  const loadRoles = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:4040/api/profiles', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setRoles(data.data || [])
      }
    } catch (err) {
      console.error('Erro ao carregar perfis:', err)
    }
  }

  const loadPermissions = async () => {
    try {
      const token = localStorage.getItem('authToken')
      const response = await fetch('http://localhost:4040/api/allowed', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setPermissions(data.data || [])
      }
    } catch (err) {
      console.error('Erro ao carregar permissões:', err)
    }
  }

  const handlePermissionToggle = (permissionName: string) => {
    setSelectedPermissions(prev => {
      if (prev.includes(permissionName)) {
        return prev.filter(p => p !== permissionName)
      } else {
        return [...prev, permissionName]
      }
    })
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('authToken')
      const url = editingRole 
        ? `http://localhost:4040/api/profile/${editingRole.id}`
        : 'http://localhost:4040/api/profile'
      
      const method = editingRole ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          permissions: selectedPermissions
        })
      })

      const data = await response.json()

      if (data.success) {
        alert(editingRole ? 'Perfil atualizado com sucesso!' : 'Perfil cadastrado com sucesso!')
        setShowForm(false)
        setFormData({
          profile_name: '',
          description: ''
        })
        setSelectedPermissions([])
        setEditingRole(null)
        loadRoles()
      } else {
        setError(data.message || `Erro ao ${editingRole ? 'atualizar' : 'cadastrar'} cargo`)
      }
    } catch (err: any) {
      setError(err.message || 'Erro na conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setFormData({
      profile_name: role.profile_name,
      description: role.description || ''
    })
    setSelectedPermissions(role.permissions || [])
    setShowForm(true)
  }

  const handleCancelEdit = () => {
    setShowForm(false)
    setEditingRole(null)
    setFormData({
      profile_name: '',
      description: ''
    })
    setSelectedPermissions([])
  }

  const renderPermissionsByCategory = () => {
    const grouped = groupPermissionsByCategory(permissions.map(p => p.permission_name))
    
    return Object.entries(grouped).map(([category, perms]) => (
      <div key={category} style={{ marginBottom: '15px' }}>
        <h4 style={{ 
          marginBottom: '8px', 
          color: '#2a626a',
          fontSize: '14px',
          fontWeight: 'bold'
        }}>
          {category}
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '8px'
        }}>
          {perms.map(permName => (
            <label
              key={permName}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                cursor: 'pointer',
                padding: '5px',
                borderRadius: '4px',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <input
                type="checkbox"
                checked={selectedPermissions.includes(permName)}
                onChange={() => handlePermissionToggle(permName)}
                style={{ cursor: 'pointer' }}
              />
              <span style={{ fontSize: '13px' }}>{translatePermission(permName)}</span>
            </label>
          ))}
        </div>
      </div>
    ))
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
          <h1 style={{ margin: 0 }}>Gerenciamento de Perfis de Acesso</h1>
          {hasPermission('profiles:create') && (
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
              {showForm ? 'Cancelar' : 'Novo Perfil'}
            </button>
          )}
        </div>

        {!hasPermission('profiles:view') && !hasPermission('profiles:read') ? (
          <div style={{
            backgroundColor: '#fff3cd',
            color: '#856404',
            padding: '20px',
            borderRadius: '8px',
            border: '1px solid #ffeeba'
          }}>
            ⚠️ Você não tem permissão para visualizar perfis de acesso.
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
            <h2>{editingRole ? 'Editar Perfil' : 'Novo Perfil'}</h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Nome do Perfil *
                </label>
                <input
                  type="text"
                  name="profile_name"
                  value={formData.profile_name}
                  onChange={handleInputChange}
                  required
                  disabled={!!editingRole}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    backgroundColor: editingRole ? '#f0f0f0' : 'white',
                    cursor: editingRole ? 'not-allowed' : 'text'
                  }}
                />
                {editingRole && (
                  <small style={{ color: '#666', fontSize: '12px' }}>
                    O nome do perfil não pode ser alterado
                  </small>
                )}
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Descrição
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                  Permissões
                </label>
                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto',
                  padding: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  backgroundColor: 'white'
                }}>
                  {renderPermissionsByCategory()}
                </div>
                <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                  {selectedPermissions.length} permissão(ões) selecionada(s)
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
          <h2>Lista de Perfis</h2>
          {roles.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>
              Nenhum perfil cadastrado.
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
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Descrição</th>
                    <th style={{ padding: '12px', textAlign: 'left', borderBottom: '2px solid #ddd' }}>Permissões</th>
                    <th style={{ padding: '12px', textAlign: 'center', borderBottom: '2px solid #ddd' }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {roles.map((role, index) => (
                    <tr key={role.id} style={{
                      backgroundColor: index % 2 === 0 ? 'white' : '#fafafa'
                    }}>
                      <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>{role.id}</td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #ddd', fontWeight: 'bold' }}>
                        {role.profile_name}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                        {role.description || '-'}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #ddd' }}>
                        {role.permissions && role.permissions.length > 0 ? (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                            {role.permissions.map((perm, idx) => (
                              <span
                                key={idx}
                                style={{
                                  fontSize: '11px',
                                  padding: '3px 8px',
                                  backgroundColor: '#e3f2fd',
                                  color: '#1976d2',
                                  borderRadius: '3px',
                                  border: '1px solid #bbdefb'
                                }}
                                title={perm}
                              >
                                {translatePermission(perm)}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span style={{ color: '#999' }}>Sem permissões</span>
                        )}
                      </td>
                      <td style={{ padding: '12px', borderBottom: '1px solid #ddd', textAlign: 'center' }}>
                        {hasPermission('profiles:update') && (
                          <button
                            onClick={() => handleEdit(role)}
                            style={{
                              padding: '6px 12px',
                              backgroundColor: '#2196F3',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              marginRight: '5px'
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

export default Perfis
