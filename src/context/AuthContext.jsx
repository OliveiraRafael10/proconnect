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

  const toggleWorkerProfile = (isWorker) => {
    setUsuario(prev => ({
      ...prev,
      isWorker,
      workerProfile: isWorker ? (prev.workerProfile || {
        categorias: ["Limpeza", "Organização"],
        descricao: 'Profissional dedicada com experiência em limpeza residencial e comercial. Trabalho com qualidade e pontualidade.',
        experiencia: 'Mais de 3 anos de experiência em limpeza doméstica e organização de ambientes.',
        portfolio: [
          {
            id: 'p1',
            url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
            name: "Limpeza de Cozinha"
          },
          {
            id: 'p2',
            url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
            name: "Organização de Quarto"
          },
          {
            id: 'p3',
            url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
            name: "Limpeza de Banheiro"
          },
          {
            id: 'p4',
            url: "https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
            name: "Organização de Sala"
          },
          {
            id: 'p5',
            url: "https://images.unsplash.com/photo-1611269154421-4320a1222a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
            name: "Limpeza de Escritório"
          },
          {
            id: 'p6',
            url: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
            name: "Organização de Closet"
          }
        ],
        disponibilidade: {
          segunda: true,
          terca: true,
          quarta: true,
          quinta: true,
          sexta: true,
          sabado: false,
          domingo: false
        },
        precoMinimo: '50',
        precoMaximo: '150',
        raioAtendimento: '10',
        certificacoes: [
          {
            nome: "Curso de Limpeza Profissional",
            instituicao: "Instituto de Limpeza",
            ano: "2022"
          }
        ],
        avaliacaoMedia: 4.8,
        totalAvaliacoes: 24
      }) : null
    }));
  };

  const updateWorkerProfile = (workerData) => {
    setUsuario(prev => ({
      ...prev,
      workerProfile: { ...prev.workerProfile, ...workerData }
    }));
  };

  return (
    <AuthContext.Provider value={{
      usuario,
      login,
      logout,
      setUsuario,
      toggleWorkerProfile,
      updateWorkerProfile
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