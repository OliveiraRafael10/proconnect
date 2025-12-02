// src/services/apiClient.js
import { emitLoadingEnd, emitLoadingStart } from "../util/loadingEvents";

// Configure sempre VITE_API_BASE para apontar ao backend (ex.: https://proconect.pythonanywhere.com)
// Para desenvolvimento local, use: http://localhost:5000
let API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  // Fallback para desenvolvimento local se não estiver configurado
  if (import.meta.env.DEV) {
    API_BASE = 'http://localhost:5000';
  } else {
    throw new Error("VITE_API_BASE não definido. Configure no .env/.env.production o endpoint do backend.");
  }
}
// Garantir que não use HTTPS em localhost
if (API_BASE.includes('localhost') && API_BASE.startsWith('https://')) {
  API_BASE = API_BASE.replace('https://', 'http://');
}

// Callback global para quando token expirar
let onTokenExpiredCallback = null;

export function setOnTokenExpiredCallback(callback) {
  onTokenExpiredCallback = callback;
}

export function getOnTokenExpiredCallback() {
  return onTokenExpiredCallback;
}

function getAccessToken() {
  return localStorage.getItem("access_token") || null;
}

function setTokens(access, refresh) {
  if (access) localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}

function handleTokenExpired() {
  // Limpar tokens
  clearSession();
  localStorage.removeItem("usuarioLogado");
  
  // Chamar callback se estiver definido
  // Usar setTimeout para garantir que o callback seja chamado após a renderização
  // Isso é importante quando o token expira no carregamento inicial da página
  if (onTokenExpiredCallback) {
    // Pequeno delay para garantir que o componente TokenExpiredHandler já montou
    setTimeout(() => {
      if (onTokenExpiredCallback) {
        try {
          onTokenExpiredCallback();
        } catch (error) {
          console.error('Erro ao chamar callback de token expirado:', error);
        }
      }
    }, 100);
  } else {
    // Se o callback não estiver configurado ainda, tentar novamente após um delay maior
    // Isso pode acontecer se o token expirar antes do componente montar
    setTimeout(() => {
      if (onTokenExpiredCallback) {
        try {
          onTokenExpiredCallback();
        } catch (error) {
          console.error('Erro ao chamar callback de token expirado (retry):', error);
        }
      }
    }, 500);
  }
}

export async function apiFetch(path, opts = {}) {
  const {
    showLoading = true,
    loadingMessage,
    loadingTitle,
    loadingContext,
    retries = 0,
    ...fetchOptions
  } = opts;

  const headers = new Headers(fetchOptions.headers || {});
  if (!headers.has("Content-Type") && fetchOptions.body) {
    headers.set("Content-Type", "application/json");
  }
  const token = getAccessToken();
  if (token && !headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const method = (fetchOptions.method || "GET").toUpperCase();
  const descriptor =
    method === "GET"
      ? {
          title: loadingTitle || "sincronizando",
          message:
            loadingMessage ||
            "Carregando as informações mais recentes para você.",
        }
      : {
          title: loadingTitle || "processando",
          message:
            loadingMessage ||
            "Estamos validando seus dados com segurança. Quase lá!",
        };

  const loaderId = showLoading ? emitLoadingStart({ ...descriptor, context: loadingContext }) : null;

  let lastError;
  try {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        // Criar AbortController para timeout (compatibilidade)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 segundos
        
        const res = await fetch(`${API_BASE}${path}`, { 
          ...fetchOptions, 
          headers,
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        // Verificar se é erro de autenticação (401)
        if (res.status === 401) {
          const isJson = (res.headers.get("content-type") || "").includes("application/json");
          let errorMsg = "Token inválido ou expirado. Por favor, reinicie sua sessão fazendo login novamente.";
          try {
            if (isJson) {
              const data = await res.json();
              errorMsg = data?.error || errorMsg;
              // Garantir que a mensagem inclui instrução para reiniciar sessão
              if (!errorMsg.includes("login") && !errorMsg.includes("sessão")) {
                errorMsg = `${errorMsg} Por favor, reinicie sua sessão fazendo login novamente.`;
              }
            }
          } catch {
            // Ignorar erro ao parsear JSON
          }
          
          // Tratar token expirado
          handleTokenExpired();
          throw new Error(errorMsg);
        }
        
        const isJson = (res.headers.get("content-type") || "").includes("application/json");
        const data = isJson ? await res.json() : await res.text();
        if (!res.ok) {
          const msg = isJson ? (data?.error || JSON.stringify(data)) : data;
          throw new Error(msg || `Erro HTTP ${res.status}`);
        }
        // Sucesso - retornar dados
        if (loaderId) {
          emitLoadingEnd(loaderId);
        }
        return data;
      } catch (err) {
        lastError = err;
        // Se for erro de rede/conexão e ainda houver tentativas, aguarda antes de tentar novamente
        const isNetworkError = err.message?.includes('network') || 
                              err.message?.includes('fetch') || 
                              err.message?.includes('socket') ||
                              err.message?.includes('10035') ||
                              err.message?.includes('Failed to fetch') ||
                              err.message?.includes('ERR_SSL_PROTOCOL_ERROR') ||
                              err.name === 'TypeError' ||
                              err.name === 'AbortError';
        
        if (attempt < retries && isNetworkError) {
          const delay = 500 * Math.pow(2, attempt); // Backoff exponencial: 500ms, 1000ms, 2000ms
          await new Promise(resolve => setTimeout(resolve, delay));
          continue; // Tentar novamente
        }
        // Se não for erro de rede ou não houver mais tentativas, lançar erro
        throw err;
      }
    }
  } finally {
    // Sempre finalizar loading após todas as tentativas
    if (loaderId) {
      emitLoadingEnd(loaderId);
    }
  }
  
  // Se chegou aqui, todas as tentativas falharam
  throw lastError;
}

export async function loginApi(email, password) {
  const data = await apiFetch(`/api/auth/login`, {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  // data: { access_token, refresh_token, user, profile }
  setTokens(data.access_token, data.refresh_token);
  return data;
}

export async function registerApi(payload) {
  // payload: { nome, email, password, is_worker?, perfil_worker?, preferencias? }
  const data = await apiFetch(`/api/auth/register`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data; // { user, profile }
}

export async function meApi() {
  return apiFetch(`/api/auth/me`, { method: "GET" });
}

export function clearSession() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export { API_BASE };

export async function updateMeApi(payload) {
  return apiFetch(`/api/users/me`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function saveOnboardingApi(payload) {
  return apiFetch(`/api/users/me/onboarding`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function uploadProfilePhotoApi(file) {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
  }
  
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  const form = new FormData();
  form.append("file", file);
  
  const res = await fetch(`${API_BASE}/api/users/me/foto`, {
    method: "POST",
    headers,
    body: form,
  });
  
  if (res.status === 401) {
    handleTokenExpired();
    throw new Error("Token inválido ou expirado. Por favor, reinicie sua sessão fazendo login novamente.");
  }
  
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Falha no upload");
  return data; // { foto_url, profile }
}

// --------- Categorias ---------
export async function listCategoriasApi() {
  const data = await apiFetch(`/api/categorias`, { method: "GET" });
  // esperado: { items: [{ id, slug, nome, ... }] }
  return Array.isArray(data?.items) ? data.items : [];
}

// --------- Anúncios ---------
export async function listAnunciosApi(params = {}) {
  // params: { tipo?, categoria_id?, busca?, urgencia?, status?, order?, page?, limit? }
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  const queryString = queryParams.toString();
  const url = `/api/anuncios${queryString ? `?${queryString}` : ''}`;
  const data = await apiFetch(url, { method: "GET" });
  // esperado: { items: [...], page, limit, offset, total? }
  return data;
}

export async function getAnuncioApi(anuncioId) {
  const data = await apiFetch(`/api/anuncios/${anuncioId}`, { method: "GET" });
  return data;
}

export async function createAnuncioApi(payload) {
  const data = await apiFetch(`/api/anuncios`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data;
}

export async function updateAnuncioApi(anuncioId, payload) {
  const data = await apiFetch(`/api/anuncios/${anuncioId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
  return data;
}

export async function deleteAnuncioApi(anuncioId) {
  const data = await apiFetch(`/api/anuncios/${anuncioId}`, {
    method: "DELETE"
  });
  return data;
}

export async function listMeusAnunciosApi() {
  const data = await apiFetch(`/api/anuncios/meus`, { method: "GET" });
  return data; // { items: [...] }
}

export async function uploadAnuncioImageApi(file, anuncioId = null) {
  const token = getAccessToken();
  if (!token) {
    throw new Error("Usuário não autenticado. Por favor, faça login novamente.");
  }
  
  const formData = new FormData();
  formData.append("file", file);
  if (anuncioId) {
    formData.append("anuncio_id", anuncioId.toString());
  }
  
  const headers = new Headers();
  headers.set("Authorization", `Bearer ${token}`);
  // Não definir Content-Type - o browser vai definir automaticamente com o boundary correto
  
  const res = await fetch(`${API_BASE}/api/anuncios/upload-imagem`, {
    method: "POST",
    headers,
    body: formData,
  });
  
  if (res.status === 401) {
    handleTokenExpired();
    throw new Error("Token inválido ou expirado. Por favor, reinicie sua sessão fazendo login novamente.");
  }
  
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error || "Falha no upload da imagem");
  }
  
  return data; // { url, path }
}

// --------- Propostas ---------
export async function createPropostaApi(payload) {
  // payload: { anuncio_id, valor_proposto?, mensagem? }
  const data = await apiFetch(`/api/propostas`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data;
}

export async function listPropostasApi(anuncioId = null, recebidas = false) {
  // Se anuncioId for fornecido, lista propostas do anúncio (requer ser dono)
  // Se recebidas=true, lista propostas recebidas (anúncios do usuário + direcionadas)
  // Senão, lista propostas enviadas pelo usuário autenticado
  const queryParams = new URLSearchParams();
  if (anuncioId) queryParams.append('anuncio_id', anuncioId);
  if (recebidas) queryParams.append('recebidas', 'true');
  const queryString = queryParams.toString();
  const data = await apiFetch(`/api/propostas${queryString ? `?${queryString}` : ''}`, { method: "GET" });
  return data; // { items: [...] }
}

export async function updatePropostaApi(propostaId, payload) {
  // payload: { valor_proposto?, mensagem?, status? }
  const data = await apiFetch(`/api/propostas/${propostaId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
  return data;
}

export async function deletePropostaApi(propostaId) {
  const data = await apiFetch(`/api/propostas/${propostaId}`, {
    method: "DELETE"
  });
  return data;
}

// --------- Profissionais ---------
export async function listProfissionaisApi(params = {}) {
  // params: { busca?, categoria?, localizacao? }
  const queryParams = new URLSearchParams();
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      queryParams.append(key, params[key]);
    }
  });
  const queryString = queryParams.toString();
  const url = `/api/profissionais${queryString ? `?${queryString}` : ''}`;
  const data = await apiFetch(url, { method: "GET" });
  // esperado: { items: [...] }
  return data;
}

export async function getAvaliacoesPorContratadoApi(usuarioId) {
  const data = await apiFetch(`/api/avaliacoes/por-contratado/${usuarioId}`, { 
    method: "GET",
    showLoading: false, // Não mostrar loading para requisições em lote
    retries: 1 // 1 retry em caso de erro de rede
  });
  // esperado: { items: [...], media: number, total: number }
  return data;
}

export async function getEstatisticasProfissionalApi(usuarioId) {
  const data = await apiFetch(`/api/profissionais/estatisticas/${usuarioId}`, { 
    method: "GET",
    showLoading: false, // Não mostrar loading para requisições em lote
    retries: 1 // 1 retry em caso de erro de rede
  });
  // esperado: { projetos_concluidos: number, total_contratacoes: number }
  return data;
}

// --------- Chat / Conversas ---------
export async function listConversasApi() {
  const data = await apiFetch(`/api/conversas`, { method: "GET" });
  // esperado: { items: [...] }
  return data;
}

export async function criarConversaApi(usuarioBId, contexto = null) {
  const payload = { usuario_b_id: usuarioBId };
  if (contexto) {
    payload.contexto_tipo = contexto.tipo;
    payload.contexto_id = contexto.id;
  }
  const data = await apiFetch(`/api/conversas`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data;
}

export async function obterConversaApi(conversaId) {
  const data = await apiFetch(`/api/conversas/${conversaId}`, { method: "GET" });
  return data;
}

export async function listMensagensApi(conversaId) {
  const data = await apiFetch(`/api/conversas/${conversaId}/mensagens`, { method: "GET" });
  // esperado: { items: [...] }
  return data;
}

export async function enviarMensagemApi(conversaId, conteudo) {
  const data = await apiFetch(`/api/conversas/${conversaId}/mensagens`, {
    method: "POST",
    body: JSON.stringify({ conteudo })
  });
  return data;
}

export async function atualizarMensagemApi(mensagemId, payload) {
  const data = await apiFetch(`/api/mensagens/${mensagemId}`, {
    method: "PATCH",
    body: JSON.stringify(payload)
  });
  return data;
}

// --------- Contratações Diretas ---------
export async function solicitarContratacaoDiretaApi(payload) {
  // payload: { profissional_id, categoria_id, titulo, descricao, localizacao?, preco_min?, preco_max?, prazo?, urgencia?, requisitos?, valor_proposto?, mensagem? }
  const data = await apiFetch(`/api/contratacoes/solicitar-direta`, {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return data; // { anuncio, proposta, profissional }
}

// Buscar dados básicos de um usuário específico
export async function getUserByIdApi(userId) {
  try {
    const data = await apiFetch(`/api/users/${userId}`, { 
      method: "GET",
      showLoading: false, // Não mostrar loading para buscas rápidas
      retries: 2, // Tentar até 2 vezes em caso de erro de conexão
      retryDelay: 500 // Delay inicial de 500ms
    });
    return data;
  } catch (err) {
    // Não logar erro aqui, deixar o componente tratar
    throw err; // Re-lançar o erro para que o componente possa fazer retry
  }
}