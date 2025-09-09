// src/data/mockServicos.js
// Dados mockados para serviços disponíveis na plataforma

export const servicosDisponiveis = [
  {
    id: 1,
    titulo: "Limpeza Residencial Completa",
    descricao: "Preciso de uma limpeza completa na minha casa de 3 quartos. Inclui limpeza de todos os cômodos, banheiros, cozinha e área de serviço. Materiais de limpeza fornecidos.",
    categoria: "Limpeza",
    valor: "R$ 150,00",
    valorNumerico: 150,
    localizacao: "Centro, São Paulo - SP",
    dataPublicacao: "2024-01-15T10:30:00Z",
    prazo: "2024-01-20",
    urgencia: "normal",
    cliente: {
      nome: "Maria Silva",
      avaliacao: 4.8,
      totalAvaliacoes: 12,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza residencial",
      "Disponibilidade nos fins de semana",
      "Referências comprovadas"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    ],
    status: "disponivel",
    visualizacoes: 45,
    propostas: 3
  },
  {
    id: 2,
    titulo: "Organização de Home Office",
    descricao: "Preciso organizar meu home office que está uma bagunça. Inclui organização de documentos, livros, equipamentos eletrônicos e criação de sistema de arquivamento.",
    categoria: "Organização",
    valor: "R$ 200,00",
    valorNumerico: 200,
    localizacao: "Vila Madalena, São Paulo - SP",
    dataPublicacao: "2024-01-14T14:20:00Z",
    prazo: "2024-01-18",
    urgencia: "alta",
    cliente: {
      nome: "João Santos",
      avaliacao: 4.9,
      totalAvaliacoes: 8,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de espaços",
      "Conhecimento em sistemas de arquivamento",
      "Portfolio de trabalhos anteriores"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    ],
    status: "disponivel",
    visualizacoes: 32,
    propostas: 1
  },
  {
    id: 3,
    titulo: "Limpeza Pós-Obra",
    descricao: "Reforma acabou e preciso de uma limpeza pesada. Muita poeira, resíduos de construção e limpeza de vidros. Trabalho para 2 pessoas.",
    categoria: "Limpeza",
    valor: "R$ 300,00",
    valorNumerico: 300,
    localizacao: "Pinheiros, São Paulo - SP",
    dataPublicacao: "2024-01-13T09:15:00Z",
    prazo: "2024-01-16",
    urgencia: "alta",
    cliente: {
      nome: "Ana Costa",
      avaliacao: 4.7,
      totalAvaliacoes: 15,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza pós-obra",
      "Equipamentos de proteção",
      "Disponibilidade imediata"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    ],
    status: "disponivel",
    visualizacoes: 67,
    propostas: 5
  },
  {
    id: 4,
    titulo: "Organização de Closet",
    descricao: "Meu closet está uma bagunça total. Preciso de alguém para organizar roupas por categoria, estação e criar um sistema funcional.",
    categoria: "Organização",
    valor: "R$ 120,00",
    valorNumerico: 120,
    localizacao: "Jardins, São Paulo - SP",
    dataPublicacao: "2024-01-12T16:45:00Z",
    prazo: "2024-01-19",
    urgencia: "normal",
    cliente: {
      nome: "Carlos Oliveira",
      avaliacao: 4.6,
      totalAvaliacoes: 6,
      verificado: false
    },
    requisitos: [
      "Experiência em organização de roupas",
      "Conhecimento em sistemas de armazenamento",
      "Referências de clientes anteriores"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    ],
    status: "disponivel",
    visualizacoes: 28,
    propostas: 2
  },
  {
    id: 5,
    titulo: "Limpeza de Escritório Comercial",
    descricao: "Escritório de 200m² precisa de limpeza diária. Inclui limpeza de mesas, banheiros, copa e área comum. Contrato mensal.",
    categoria: "Limpeza",
    valor: "R$ 800,00/mês",
    valorNumerico: 800,
    localizacao: "Bela Vista, São Paulo - SP",
    dataPublicacao: "2024-01-11T11:30:00Z",
    prazo: "2024-01-25",
    urgencia: "normal",
    cliente: {
      nome: "Tech Solutions Ltda",
      avaliacao: 4.9,
      totalAvaliacoes: 23,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza comercial",
      "Disponibilidade de segunda a sexta",
      "CNPJ e documentação em dia",
      "Seguro de responsabilidade civil"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    ],
    status: "disponivel",
    visualizacoes: 89,
    propostas: 7
  },
  {
    id: 6,
    titulo: "Organização de Evento",
    descricao: "Preciso de ajuda para organizar um evento corporativo para 50 pessoas. Inclui organização do espaço, decoração e coordenação no dia.",
    categoria: "Organização",
    valor: "R$ 500,00",
    valorNumerico: 500,
    localizacao: "Itaim Bibi, São Paulo - SP",
    dataPublicacao: "2024-01-10T13:20:00Z",
    prazo: "2024-01-22",
    urgencia: "alta",
    cliente: {
      nome: "Eventos Plus",
      avaliacao: 4.8,
      totalAvaliacoes: 18,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de eventos",
      "Disponibilidade no fim de semana",
      "Portfolio de eventos anteriores",
      "Boa comunicação"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    ],
    status: "disponivel",
    visualizacoes: 54,
    propostas: 4
  },
  {
    id: 7,
    titulo: "Limpeza de Condomínio",
    descricao: "Condomínio residencial precisa de limpeza das áreas comuns. Inclui hall, elevadores, escadas e área de lazer. Trabalho semanal.",
    categoria: "Limpeza",
    valor: "R$ 400,00/semana",
    valorNumerico: 400,
    localizacao: "Moema, São Paulo - SP",
    dataPublicacao: "2024-01-09T08:45:00Z",
    prazo: "2024-01-23",
    urgencia: "normal",
    cliente: {
      nome: "Síndico José",
      avaliacao: 4.5,
      totalAvaliacoes: 4,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza condominial",
      "Disponibilidade nos fins de semana",
      "Documentação em dia",
      "Referências de outros condomínios"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    ],
    status: "disponivel",
    visualizacoes: 41,
    propostas: 3
  },
  {
    id: 8,
    titulo: "Organização de Biblioteca Pessoal",
    descricao: "Tenho uma biblioteca com mais de 500 livros que precisa ser organizada por categoria, autor e sistema de catalogação.",
    categoria: "Organização",
    valor: "R$ 180,00",
    valorNumerico: 180,
    localizacao: "Higienópolis, São Paulo - SP",
    dataPublicacao: "2024-01-08T15:10:00Z",
    prazo: "2024-01-21",
    urgencia: "normal",
    cliente: {
      nome: "Prof. Dr. Roberto",
      avaliacao: 4.9,
      totalAvaliacoes: 11,
      verificado: true
    },
    requisitos: [
      "Conhecimento em organização de livros",
      "Experiência com sistemas de catalogação",
      "Cuidado com materiais frágeis",
      "Disponibilidade durante a semana"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80"
    ],
    status: "disponivel",
    visualizacoes: 23,
    propostas: 1
  }
];

export const categorias = [
  { id: "todas", nome: "Todas as Categorias", icone: "📋" },
  { id: "limpeza", nome: "Limpeza", icone: "🧹" },
  { id: "organizacao", nome: "Organização", icone: "📦" }
];

export const niveisUrgencia = [
  { id: "todas", nome: "Todas", cor: "gray" },
  { id: "normal", nome: "Normal", cor: "green" },
  { id: "alta", nome: "Alta", cor: "red" }
];

// Função para filtrar serviços
export const filtrarServicos = (servicos, filtros) => {
  return servicos.filter(servico => {
    // Filtro por categoria
    if (filtros.categoria && filtros.categoria !== "todas") {
      if (servico.categoria.toLowerCase() !== filtros.categoria.toLowerCase()) {
        return false;
      }
    }

    // Filtro por urgência
    if (filtros.urgencia && filtros.urgencia !== "todas") {
      if (servico.urgencia !== filtros.urgencia) {
        return false;
      }
    }

    // Filtro por valor mínimo
    if (filtros.valorMinimo && servico.valorNumerico < filtros.valorMinimo) {
      return false;
    }

    // Filtro por valor máximo
    if (filtros.valorMaximo && servico.valorNumerico > filtros.valorMaximo) {
      return false;
    }

    // Filtro por busca textual
    if (filtros.busca) {
      const termoBusca = filtros.busca.toLowerCase();
      const textoCompleto = `${servico.titulo} ${servico.descricao} ${servico.categoria} ${servico.localizacao}`.toLowerCase();
      if (!textoCompleto.includes(termoBusca)) {
        return false;
      }
    }

    return true;
  });
};

// Função para ordenar serviços
export const ordenarServicos = (servicos, ordenacao) => {
  const servicosOrdenados = [...servicos];
  
  switch (ordenacao) {
    case "valor_maior":
      return servicosOrdenados.sort((a, b) => b.valorNumerico - a.valorNumerico);
    case "valor_menor":
      return servicosOrdenados.sort((a, b) => a.valorNumerico - b.valorNumerico);
    case "mais_recente":
      return servicosOrdenados.sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao));
    case "mais_antigo":
      return servicosOrdenados.sort((a, b) => new Date(a.dataPublicacao) - new Date(b.dataPublicacao));
    case "mais_visualizado":
      return servicosOrdenados.sort((a, b) => b.visualizacoes - a.visualizacoes);
    default:
      return servicosOrdenados;
  }
};
