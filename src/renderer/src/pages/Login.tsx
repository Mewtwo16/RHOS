import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import '../assets/css/login.css'
import logoImg from '../assets/img/logo.png'

function Login() {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://localhost:4040/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ usuario, senha })
      })

      const data = await response.json()

      if (data.success && data.token) {
        localStorage.setItem('authToken', data.token)
        
        if (window.api && window.api.notifyLoginSuccess) {
          window.api.notifyLoginSuccess()
        }
        
        setTimeout(() => {
          navigate('/home')
        }, 100)
      } else {
        setError(data.message || 'Erro ao fazer login')
      }
    } catch (err: any) {
      setError(err.message || 'Erro na conexão com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container">
      {/* Área de arrastar (drag) */}
      <div className="drag-area" />

      {/* Botão de fechar */}
      <button onClick={() => window.close()} className="close-button">
        ✕
      </button>

        {/* Coluna da Esquerda - Informações */}
        <div className="coluna-info">
          <div className="box-titulo">
            <h1 className="titulo-login">RH-OS</h1>
            <p className="subtitulo-login">Sistema de Gestão de Recursos Humanos</p>
          </div>
          
          <div className="logo-login">
            <img src={logoImg} alt="RH-OS Logo" />
          </div>
          
          <div className="slogan">
            <p>Gestão inteligente para sua empresa</p>
          </div>
        </div>

        {/* Coluna da Direita - Formulário */}
        <div className="formulario">
          <h2 className="texto-login">Bem-vindo</h2>

          {error && (
            <div style={{
              width: '100%',
              maxWidth: '300px',
              backgroundColor: '#f44336',
              color: 'white',
              padding: '10px',
              borderRadius: '8px',
              marginBottom: '15px',
              textAlign: 'center',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div className="input-box">
              <input
                type="text"
                placeholder="Usuário"
                value={usuario}
                onChange={(e) => setUsuario(e.target.value)}
                required
                disabled={loading}
              />
              <i className='bx bxs-user'></i>
            </div>

            <div className="input-box">
              <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                disabled={loading}
              />
              <i className='bx bxs-lock-alt'></i>
            </div>

            <button
              type="submit"
              className="login"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>
    </div>
  )
}

export default Login
