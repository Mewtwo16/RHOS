import { Link, useNavigate } from 'react-router-dom'
import '../assets/css/Menu.css'
import logoImg from '../assets/img/logo.png'

function Header() {
  const navigate = useNavigate()

  const handleLogout = () => {
    localStorage.removeItem('authToken')
    
    if (window.api && window.api.notifyLogout) {
      window.api.notifyLogout()
    } else {
      navigate('/login')
    }
  }

  return (
    <header className="box-header">
      <nav className="box-menu-principal">
        <Link to="/" className="box-imagem">
          <img src={logoImg} alt="RH-OS" />
        </Link>

        <ul className="menu">
          {/* Recrutamento */}
          <li className="dropdown">
            <a href="#" role="button" aria-haspopup="true">
              Recrutamento
            </a>
            <ul className="submenus">
              <li><a href="#" role="button">Minhas Vagas</a></li>
              <li><a href="#" role="button">Candidatos</a></li>
              <li><a href="#" role="button">Agenda</a></li>
            </ul>
          </li>

          {/* Desempenho */}
          <li className="dropdown">
            <a href="#" role="button" aria-haspopup="true">
              Desempenho
            </a>
            <ul className="submenus">
              <li><a href="#" role="button">Feedback:360</a></li>
              <li><a href="#" role="button">Recrutados</a></li>
              <li><a href="#" role="button">Metas</a></li>
            </ul>
          </li>

          {/* Gestão de RH */}
          <li className="dropdown">
            <a href="#" role="button" aria-haspopup="true">
              Gestão de RH
            </a>
            <ul className="submenus">
              <li><a href="#" role="button">Funcionarios</a></li>
              <li><a href="#" role="button">Gestão de ferias</a></li>
              <li><a href="#" role="button">Relogio de ponto</a></li>
              <li><a href="#" role="button">Gerenciamento de custos</a></li>
              <li><a href="#" role="button">Desligamento</a></li>
            </ul>
          </li>

          {/* Desenvolvimento e Satisfação */}
          <li className="dropdown">
            <a href="#" role="button" aria-haspopup="true">
              Desenvolvimento e Satisfação
            </a>
            <ul className="submenus">
              <li><a href="#" role="button">Treinamentos</a></li>
              <li><a href="#" role="button">Plano de Carreira</a></li>
              <li><a href="#" role="button">Pesquisa de Satisfação</a></li>
            </ul>
          </li>

          {/* Integração */}
          <li className="dropdown">
            <a href="#" role="button" aria-haspopup="true">
              Integração
            </a>
            <ul className="submenus">
              <li><a href="#" role="button">Não definido</a></li>
            </ul>
          </li>

          {/* Relatórios */}
          <li className="dropdown">
            <a href="#" role="button" aria-haspopup="true">
              Relatórios
            </a>
            <ul className="submenus">
              <li><a href="#" role="button">Contratações</a></li>
              <li><a href="#" role="button">Relatorio de ponto</a></li>
              <li><a href="#" role="button">Custos e pagamentos</a></li>
              <li>
                <Link to="/logs" role="button">
                  Logs de Usuarios
                </Link>
              </li>
            </ul>
          </li>

          {/* Sistema */}
          <li className="dropdown">
            <a href="#" role="button" aria-haspopup="true">
              Sistema
            </a>
            <ul className="submenus">
              <li><a href="#" role="button">Parametros gerais do sistema</a></li>
              <li>
                <Link to="/usuarios" role="button">
                  Cadastro de Usuarios
                </Link>
              </li>
              <li>
                <Link to="/cargos" role="button">
                  Cadastro de Cargos
                </Link>
              </li>
              <li><a href="#" role="button">Documentação</a></li>
              <li><a href="#" role="button">Versão</a></li>
              <li><a href="#" role="button">Licença</a></li>
            </ul>
          </li>
        </ul>

        <button
          onClick={handleLogout}
          style={{
            marginLeft: 'auto',
            padding: '8px 16px',
            backgroundColor: '#e77f67',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '500',
            transition: 'opacity 0.2s ease'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.8')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        >
          Sair
        </button>
      </nav>
    </header>
  )
}

export default Header
