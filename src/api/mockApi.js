// src/api/mockApi.js
import {
  usuarios,
  categorias,
  servicos,
  contratacoes,
  avaliacoes,
  mensagens
} from "../data/mockDados.js";

// Simula um delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simula GET por tipo
export async function getData(tipo) {
  await delay(300); // simula carregamento
  switch (tipo) {
    case "usuarios":
      return usuarios;
    case "servicos":
      return servicos;
    case "categorias":
      return categorias;
    case "contratacoes":
      return contratacoes;
    case "avaliacoes":
      return avaliacoes;
    case "mensagens":
      return mensagens;
    default:
      throw new Error("Tipo de dado inválido");
  }
}

// Simula login
export async function login(email, senha) {
  await delay(200);
  return usuarios.find((u) => u.email === email && u.senha_hash === senha) || null;
}
