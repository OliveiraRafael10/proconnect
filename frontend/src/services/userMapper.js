// Map between DB (Supabase) profile row and UI shape used in the app

export function dbToUi(profile = {}) {
  if (!profile || typeof profile !== 'object') return {};
  return {
    id: profile.id,
    nome: profile.nome || '',
    apelido: profile.apelido || '',
    email: profile.email || '',
    foto_url: profile.foto_url || '',
    isWorker: !!profile.is_worker,
    telefone: {
      ddd: profile.telefone_ddd || '',
      numero: profile.telefone_numero || '',
    },
    endereco: {
      cep: profile.endereco_cep || '',
      logradouro: profile.endereco_logradouro || '',
      numero: profile.endereco_numero || '',
      bairro: profile.endereco_bairro || '',
      cidade: profile.endereco_cidade || '',
      estado: profile.endereco_estado || '',
      complemento: profile.endereco_complemento || '',
    },
    workerProfile: profile.perfil_worker || {},
    preferencias: profile.preferencias || {},
  };
}

export function uiToDb(ui = {}) {
  // Accepts either full usuario shape or a subset (e.g., PerfilPage form)
  const out = {};
  if (typeof ui !== 'object' || !ui) return out;

  if (ui.nome != null) out.nome = ui.nome;
  if (ui.apelido != null) out.apelido = ui.apelido;
  if (ui.foto_url != null) out.foto_url = ui.foto_url;
  if (ui.isWorker != null) out.is_worker = !!ui.isWorker;

  const telefone = ui.telefone || {};
  if (telefone.ddd != null) out.telefone_ddd = String(telefone.ddd).replace(/\D/g, '');
  if (telefone.numero != null) out.telefone_numero = String(telefone.numero).replace(/\D/g, '');

  const endereco = ui.endereco || {};
  if (endereco.cep != null) out.endereco_cep = String(endereco.cep).replace(/\D/g, '');
  if (endereco.logradouro != null) out.endereco_logradouro = endereco.logradouro;
  if (endereco.numero != null) out.endereco_numero = endereco.numero;
  if (endereco.bairro != null) out.endereco_bairro = endereco.bairro;
  if (endereco.cidade != null) out.endereco_cidade = endereco.cidade;
  if (endereco.estado != null) out.endereco_estado = endereco.estado;
  if (endereco.complemento != null) out.endereco_complemento = endereco.complemento;

  if (ui.workerProfile != null) out.perfil_worker = ui.workerProfile;
  if (ui.preferencias != null) out.preferencias = ui.preferencias;

  return out;
}

