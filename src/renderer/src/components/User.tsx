import '../assets/css/user.css'
export function Users() {
  return (
    <>
      <main>
        <form className="form" id="form_usuario">
          <h2 className="form-title">Usuarios</h2>
          <div>
            <label htmlFor="nome">Nome Completo:</label>
            <input
              type="text"
              className="nome"
              id="nome"
              placeholder="Digite o nome completo"
              required
            />
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="email"
              id="email"
              placeholder="exemplo@email.com"
              required
            />
            <label htmlFor="cpf">CPF:</label>
            <input type="text" className="cpf" id="cpf" placeholder="000.000.000-00" required />
            <label htmlFor="dataNascimento">Data Nascimento:</label>
            <input type="date" className="dataNascimento" id="dataNascimento" required />
            <label htmlFor="cargo">Cargo:</label>
            <select id="cargo" name="cargo" required>
              <option value="" disabled selected>
                Selecione um cargo
              </option>
            </select>
          </div>
          <div>
            <label htmlFor="usuario">Usuário:</label>
            <input
              type="text"
              className="usuario"
              id="usuario"
              placeholder="Crie um nome de usuário"
              required
            />
            <label htmlFor="senha">Senha:</label>
            <input
              type="password"
              className="senha"
              id="senha"
              placeholder="Digite sua senha"
              required
            />
            <label htmlFor="senha_confirma">Confirmar Senha:</label>
            <input
              type="password"
              className="senha_confirma"
              id="senha_confirma"
              placeholder="Confirme sua senha"
              required
            />
            <button type="submit">Cadastrar</button>
          </div>
        </form>
      </main>
    </>
  )
}
