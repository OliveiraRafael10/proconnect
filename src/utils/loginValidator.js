import { usuariosCadastrados } from "./usuario";

export function validarLoginLocal(email, senha) {
  const usuario = usuariosCadastrados.find(user => user.validarLogin(email, senha));
  return usuario || null;
}