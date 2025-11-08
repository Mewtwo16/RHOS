import '../assets/css/Menu.css'
import logo from '../assets/img/logo.png'

export function Menu() {
  return (
    <>
      <header className="box-header">
        <nav className="box-menu-principal">
          <a href="#" role="button" className="box-imagem">
            <img src={logo} alt="RH-OS-Parametros" />
          </a>
          <ul className="menu">
            <li className="dropdown">
              <a href="#" role="button" aria-haspopup="true">
                Recrutamento
              </a>
              <ul className="submenus">
                <li>
                  <a href="#" role="button">
                    Minhas Vagas
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Candidatos
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Agenda
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="#" role="button" aria-haspopup="true">
                Desempenho
              </a>
              <ul className="submenus">
                <li>
                  <a href="#" role="button">
                    Feedback:360
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Recrutados
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Metas
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="#" role="button" aria-haspopup="true">
                Gestão de RH
              </a>
              <ul className="submenus">
                <li>
                  <a href="#" role="button">
                    Funcionarios
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Gestão de ferias
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Relogio de ponto
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Gerenciamento de custos
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Desligamento
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="#" role="button" aria-haspopup="true">
                Desenvolvimento e Satisfação
              </a>
              <ul className="submenus">
                <li>
                  <a href="#" role="button">
                    Treinamentos
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Plano de Carreira
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Pesquisa de Satisfação
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="#" role="button" aria-haspopup="true">
                Integração
              </a>
              <ul className="submenus">
                <li>
                  <a href="#" role="button">
                    Não definido
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="#" role="button" aria-haspopup="true">
                Relatorios
              </a>
              <ul className="submenus">
                <li>
                  <a href="#" role="button">
                    Contratações
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Relatorio de ponto
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    custos e pagamentos
                  </a>
                </li>
                <li>
                  <a href="#" id="link-logs" role="button">
                    Logs de Usuarios
                  </a>
                </li>
              </ul>
            </li>
            <li className="dropdown">
              <a href="#" role="button" aria-haspopup="true">
                Sistema
              </a>
              <ul className="submenus">
                <li>
                  <a href="#" role="button">
                    Parametros gerais do sistema
                  </a>
                </li>
                <li>
                  <a href="#" id="link-cadastro-usuarios" role="button">
                    Cadastro de Usuarios
                  </a>
                </li>
                <li>
                  <a href="#" id="link-cadastro-cargos" role="button">
                    cadastro de Cargos
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Documentação
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Versão
                  </a>
                </li>
                <li>
                  <a href="#" role="button">
                    Licença
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
    </>
  )
}
