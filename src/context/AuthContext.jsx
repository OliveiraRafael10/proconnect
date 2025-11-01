// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";
import { clearSession, meApi } from "../services/apiClient";
import { dbToUi } from "../services/userMapper";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(() => {
    const local = localStorage.getItem("usuarioLogado");
    return local ? JSON.parse(local) : null;
  });

  useEffect(() => {
    if (usuario) {
      localStorage.setItem("usuarioLogado", JSON.stringify(usuario));
    } else {
      localStorage.removeItem("usuarioLogado");
    }
  }, [usuario]);

  // Carrega o perfil do backend ao iniciar (se houver sessão)
  useEffect(() => {
    let ignore = false;
    (async () => {
      try {
        const data = await meApi(); // { user_id, profile }
        const profile = data?.profile;
        if (profile && !ignore) {
          setUsuario(prev => ({ ...(prev || {}), ...dbToUi(profile) }));
        }
      } catch (_) {
        // Sem sessão ou erro: mantém estado atual
      }
    })();
    return () => { ignore = true; };
  }, []);

  const login = (dadosUsuario) => {
    // dadosUsuario é o perfil vindo do backend (/auth/login -> profile)
    setUsuario(dadosUsuario);
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuarioLogado");
    clearSession();
  };

  // Os métodos locais de toggle/update do workerProfile foram substituídos
  // por persistência direta via API nas telas.

  return (
    <AuthContext.Provider value={{
      usuario,
      login,
      logout,
      setUsuario,
      // toggle/update do perfil de trabalhador agora são feitos via API
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};
