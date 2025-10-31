const CEP_URL = "https://viacep.com.br/ws";

function normalizeCep(value) {
  return String(value || "").replace(/\D/g, "");
}

export function formatCep(value) {
  const digits = normalizeCep(value).slice(0, 8);
  if (!digits) return "";
  if (digits.length <= 5) return digits;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export async function buscarEnderecoPorCep(value) {
  const cep = normalizeCep(value);
  if (cep.length !== 8) {
    throw new Error("CEP deve conter 8 dígitos.");
  }

  const response = await fetch(`${CEP_URL}/${cep}/json/`);

  if (!response.ok) {
    throw new Error("Serviço de CEP temporariamente indisponível.");
  }

  const data = await response.json();

  if (data.erro) {
    throw new Error("CEP não encontrado. Verifique o número digitado.");
  }

  return {
    cep,
    logradouro: data.logradouro || "",
    bairro: data.bairro || "",
    cidade: data.localidade || "",
    estado: data.uf || "",
    complemento: data.complemento || "",
  };
}

export { normalizeCep };
