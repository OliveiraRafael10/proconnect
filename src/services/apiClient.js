// src/services/apiClient.js
import { emitLoadingEnd, emitLoadingStart } from "../util/loadingEvents";

// Configure sempre VITE_API_BASE para apontar ao backend (ex.: https://proconect.pythonanywhere.com)
const API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  throw new Error("VITE_API_BASE não definido. Configure no .env/.env.production o endpoint do backend.");
}

function getAccessToken() {
  return localStorage.getItem("access_token") || null;
}

function setTokens(access, refresh) {
  if (access) localStorage.setItem("access_token", access);
  if (refresh) localStorage.setItem("refresh_token", refresh);
}

export async function apiFetch(path, opts = {}) {
  const {
    showLoading = true,
    loadingMessage,
    loadingTitle,
    loadingContext,
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

  try {
    const res = await fetch(`${API_BASE}${path}`, { ...fetchOptions, headers });
    const isJson = (res.headers.get("content-type") || "").includes("application/json");
    const data = isJson ? await res.json() : await res.text();
    if (!res.ok) {
      const msg = isJson ? (data?.error || JSON.stringify(data)) : data;
      throw new Error(msg || `Erro HTTP ${res.status}`);
    }
    return data;
  } finally {
    if (loaderId) {
      emitLoadingEnd(loaderId);
    }
  }
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
    // Token expirado - limpa storage e redireciona para login
    localStorage.clear();
    window.location.href = "/login";
    throw new Error("Sessão expirada. Por favor, faça login novamente.");
  }
  
  const data = await res.json();
  if (!res.ok) throw new Error(data?.error || "Falha no upload");
  return data; // { foto_url, profile }
}
