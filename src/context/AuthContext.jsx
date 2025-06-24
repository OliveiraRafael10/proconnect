// src/context/AuthContext.js
import { createContext, useContext, useEffect, useState } from "react";

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

  const login = (dadosUsuario) => {
    setUsuario(dadosUsuario);
  };

  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuarioLogado");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, setUsuario }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
