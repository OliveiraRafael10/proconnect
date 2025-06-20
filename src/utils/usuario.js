export class Usuario {
  constructor(id, nome, email, senha) {
    this.id = id;
    this.nome = nome;
    this.email = email;
    this.senha = senha;
  }

  validarLogin(email, senha) {
    return this.email === email && this.senha === senha;
  }
}

// Lista de usuários cadastrados (mock)
export const usuariosCadastrados = [
  new Usuario(1, "João Silva", "joao@email.com", "123456"),
  new Usuario(2, "Maria Souza", "maria@email.com", "senha123"),
  new Usuario(3, "Carlos Lima", "carlos@email.com", "admin2024")
];

