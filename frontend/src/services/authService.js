export async function autenticarUsuario(email, senha) {
  try {
    const response = await fetch("https://suaapi.com/usuarios");
    const usuarios = await response.json();
    return usuarios.find(user => user.email === email && user.senha === senha) || null;
  } catch (error) {
    console.error("Erro na autenticação:", error);
    return null;
  }
}
