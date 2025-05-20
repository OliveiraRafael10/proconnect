// loginValidator.js

const users = [
    {
      emailCpf: "usuario@email.com",
      senha: "123456",
    },
    {
      emailCpf: "123.456.789-00",
      senha: "senhaSegura",
    },
  ];
  
// Função de validação simples
export function validarLogin(emailCpf, senha) {
    const usuarioValido = users.find(
      (user) => user.emailCpf === emailCpf && user.senha === senha
    );
  
    if (usuarioValido) {
      return { sucesso: true, mensagem: "Login bem-sucedido!" };
    } else {
      return { sucesso: false, mensagem: "E-mail/CPF ou senha inválidos." };
    }
}
  