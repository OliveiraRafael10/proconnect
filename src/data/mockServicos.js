// src/data/mockServicos.js
// Dados mockados para serviços disponíveis na plataforma

export const servicosDisponiveis = [
  {
    id: 1,
    titulo: "Limpeza Residencial Completa",
    descricao: "Preciso de uma limpeza completa na minha casa de 3 quartos. Inclui limpeza de todos os cômodos, banheiros, cozinha e área de serviço. Materiais de limpeza fornecidos.",
    categoria: "Limpeza",
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
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
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
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
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
  },
  {
    id: 9,
    titulo: "Limpeza de Carro Detalhada",
    descricao: "Preciso de uma limpeza completa e detalhada no meu carro. Inclui lavagem externa, limpeza interna, aspiração, limpeza de estofados e aplicação de produtos de proteção.",
    categoria: "Limpeza",
    localizacao: "Vila Olímpia, São Paulo - SP",
    dataPublicacao: "2024-01-07T12:30:00Z",
    prazo: "2024-01-15",
    urgencia: "normal",
    cliente: {
      nome: "Roberto Lima",
      avaliacao: 4.7,
      totalAvaliacoes: 9,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza automotiva",
      "Produtos de qualidade",
      "Local próprio ou domicílio"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 38,
    propostas: 2
  },
  {
    id: 10,
    titulo: "Organização de Móveis e Decoração",
    descricao: "Preciso reorganizar os móveis da minha sala e quarto. Inclui mudança de posição, organização de objetos decorativos e sugestões de melhor aproveitamento do espaço.",
    categoria: "Organização",
    localizacao: "Brooklin, São Paulo - SP",
    dataPublicacao: "2024-01-06T16:45:00Z",
    prazo: "2024-01-17",
    urgencia: "normal",
    cliente: {
      nome: "Fernanda Costa",
      avaliacao: 4.9,
      totalAvaliacoes: 14,
      verificado: true
    },
    requisitos: [
      "Conhecimento em decoração",
      "Experiência em organização de espaços",
      "Boa comunicação"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 29,
    propostas: 1
  },
  {
    id: 11,
    titulo: "Limpeza de Vidros Residenciais",
    descricao: "Casa de 2 andares com muitos vidros que precisam de limpeza. Inclui janelas, portas de vidro, espelhos e box do banheiro. Equipamentos de segurança necessários.",
    categoria: "Limpeza",
    localizacao: "Alphaville, São Paulo - SP",
    dataPublicacao: "2024-01-05T09:20:00Z",
    prazo: "2024-01-14",
    urgencia: "alta",
    cliente: {
      nome: "Patricia Mendes",
      avaliacao: 4.8,
      totalAvaliacoes: 7,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza de vidros",
      "Equipamentos de segurança",
      "Seguro de responsabilidade civil"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 52,
    propostas: 4
  },
  {
    id: 12,
    titulo: "Organização de Documentos Empresariais",
    descricao: "Escritório pequeno precisa organizar documentos fiscais, contratos e arquivos. Inclui digitalização, categorização e criação de sistema de arquivamento.",
    categoria: "Organização",
    localizacao: "Consolação, São Paulo - SP",
    dataPublicacao: "2024-01-04T14:15:00Z",
    prazo: "2024-01-16",
    urgencia: "normal",
    cliente: {
      nome: "Contabilidade Silva",
      avaliacao: 4.6,
      totalAvaliacoes: 11,
      verificado: true
    },
    requisitos: [
      "Conhecimento em organização de documentos",
      "Experiência com arquivos empresariais",
      "Confidencialidade"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 41,
    propostas: 3
  },
  {
    id: 13,
    titulo: "Limpeza de Estofados e Tapetes",
    descricao: "Preciso limpar sofá, poltronas e tapetes da sala. Alguns têm manchas antigas que precisam de tratamento especial. Produtos de limpeza fornecidos.",
    categoria: "Limpeza",
    localizacao: "Perdizes, São Paulo - SP",
    dataPublicacao: "2024-01-03T11:30:00Z",
    prazo: "2024-01-13",
    urgencia: "normal",
    cliente: {
      nome: "Marcos Oliveira",
      avaliacao: 4.7,
      totalAvaliacoes: 6,
      verificado: false
    },
    requisitos: [
      "Experiência em limpeza de estofados",
      "Conhecimento em remoção de manchas",
      "Equipamentos adequados"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 33,
    propostas: 2
  },
  {
    id: 14,
    titulo: "Organização de Cozinha e Despensa",
    descricao: "Cozinha pequena precisa de organização total. Inclui despensa, armários, geladeira e criação de sistema de rotulagem para facilitar o uso diário.",
    categoria: "Organização",
    localizacao: "Vila Mariana, São Paulo - SP",
    dataPublicacao: "2024-01-02T15:45:00Z",
    prazo: "2024-01-12",
    urgencia: "normal",
    cliente: {
      nome: "Juliana Santos",
      avaliacao: 4.9,
      totalAvaliacoes: 13,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de cozinhas",
      "Conhecimento em sistemas de armazenamento",
      "Criatividade para otimizar espaços"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 47,
    propostas: 3
  },
  {
    id: 15,
    titulo: "Limpeza de Ar Condicionado",
    descricao: "Preciso limpar 4 aparelhos de ar condicionado split. Inclui limpeza de filtros, serpentinas e desinfecção. Trabalho para pessoa com experiência específica.",
    categoria: "Limpeza",
    localizacao: "Santo André, São Paulo - SP",
    dataPublicacao: "2024-01-01T10:20:00Z",
    prazo: "2024-01-11",
    urgencia: "alta",
    cliente: {
      nome: "Carlos Eduardo",
      avaliacao: 4.8,
      totalAvaliacoes: 8,
      verificado: true
    },
    requisitos: [
      "Experiência específica em ar condicionado",
      "Equipamentos de limpeza adequados",
      "Conhecimento técnico básico"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 61,
    propostas: 5
  },
  {
    id: 16,
    titulo: "Organização de Brinquedos e Quarto Infantil",
    descricao: "Quarto de criança de 5 anos está uma bagunça. Preciso organizar brinquedos, livros, roupas e criar sistema que a criança consiga manter organizado.",
    categoria: "Organização",
    localizacao: "Campinas, São Paulo - SP",
    dataPublicacao: "2023-12-31T13:30:00Z",
    prazo: "2024-01-10",
    urgencia: "normal",
    cliente: {
      nome: "Ana Paula",
      avaliacao: 4.9,
      totalAvaliacoes: 16,
      verificado: true
    },
    requisitos: [
      "Experiência com organização infantil",
      "Conhecimento em psicologia infantil",
      "Criatividade para tornar divertido"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 35,
    propostas: 2
  },
  {
    id: 17,
    titulo: "Limpeza de Piscina e Área de Lazer",
    descricao: "Piscina de 8x4 metros precisa de limpeza completa. Inclui aspiração, tratamento químico, limpeza da área ao redor e organização dos móveis de piscina.",
    categoria: "Limpeza",
    localizacao: "Granja Viana, São Paulo - SP",
    dataPublicacao: "2023-12-30T08:45:00Z",
    prazo: "2024-01-09",
    urgencia: "normal",
    cliente: {
      nome: "Roberto Silva",
      avaliacao: 4.7,
      totalAvaliacoes: 5,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza de piscinas",
      "Conhecimento em química de piscinas",
      "Equipamentos adequados"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 28,
    propostas: 1
  },
  {
    id: 18,
    titulo: "Organização de Guarda-Roupa e Roupas",
    descricao: "Guarda-roupa de casal está lotado e desorganizado. Preciso organizar por categoria, estação, criar sistema de doação e otimizar o espaço disponível.",
    categoria: "Organização",
    localizacao: "Osasco, São Paulo - SP",
    dataPublicacao: "2023-12-29T16:20:00Z",
    prazo: "2024-01-08",
    urgencia: "normal",
    cliente: {
      nome: "Mariana e João",
      avaliacao: 4.8,
      totalAvaliacoes: 9,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de roupas",
      "Conhecimento em sistemas de armazenamento",
      "Sensibilidade para doações"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 42,
    propostas: 3
  },
  {
    id: 19,
    titulo: "Limpeza de Churrasqueira e Área Externa",
    descricao: "Churrasqueira de alvenaria precisa de limpeza pesada. Inclui remoção de gordura, limpeza da área externa, organização de utensílios e limpeza de móveis externos.",
    categoria: "Limpeza",
    localizacao: "Guarulhos, São Paulo - SP",
    dataPublicacao: "2023-12-28T12:15:00Z",
    prazo: "2024-01-07",
    urgencia: "normal",
    cliente: {
      nome: "Pedro Henrique",
      avaliacao: 4.6,
      totalAvaliacoes: 7,
      verificado: false
    },
    requisitos: [
      "Experiência em limpeza pesada",
      "Produtos específicos para gordura",
      "Disponibilidade para trabalho externo"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 31,
    propostas: 2
  },
  {
    id: 20,
    titulo: "Organização de Home Studio de Música",
    descricao: "Home studio pequeno precisa de organização. Inclui equipamentos de áudio, instrumentos, cabos e criação de sistema de armazenamento para facilitar o trabalho.",
    categoria: "Organização",
    localizacao: "Vila Madalena, São Paulo - SP",
    dataPublicacao: "2023-12-27T14:30:00Z",
    prazo: "2024-01-06",
    urgencia: "normal",
    cliente: {
      nome: "Lucas Música",
      avaliacao: 4.9,
      totalAvaliacoes: 12,
      verificado: true
    },
    requisitos: [
      "Conhecimento em equipamentos de áudio",
      "Experiência em organização de estúdios",
      "Cuidado com equipamentos sensíveis"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 26,
    propostas: 1
  },
  {
    id: 21,
    titulo: "Limpeza de Forno e Fogão Profissional",
    descricao: "Fogão industrial e forno de restaurante precisam de limpeza profunda. Inclui remoção de gordura acumulada, limpeza de grelhas e desinfecção completa.",
    categoria: "Limpeza",
    localizacao: "Centro, São Paulo - SP",
    dataPublicacao: "2023-12-26T09:45:00Z",
    prazo: "2024-01-05",
    urgencia: "alta",
    cliente: {
      nome: "Restaurante Sabor",
      avaliacao: 4.8,
      totalAvaliacoes: 19,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza industrial",
      "Produtos específicos para cozinha",
      "Disponibilidade noturna"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 58,
    propostas: 6
  },
  {
    id: 22,
    titulo: "Organização de Ateliê de Artesanato",
    descricao: "Ateliê de artesanato está desorganizado. Preciso organizar materiais, ferramentas, tecidos e criar sistema de armazenamento por tipo de projeto.",
    categoria: "Organização",
    localizacao: "Pinheiros, São Paulo - SP",
    dataPublicacao: "2023-12-25T15:20:00Z",
    prazo: "2024-01-04",
    urgencia: "normal",
    cliente: {
      nome: "Carla Artesanato",
      avaliacao: 4.7,
      totalAvaliacoes: 8,
      verificado: true
    },
    requisitos: [
      "Conhecimento em materiais de artesanato",
      "Experiência em organização criativa",
      "Entendimento de fluxo de trabalho"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 34,
    propostas: 2
  },
  {
    id: 23,
    titulo: "Limpeza de Janelas de Prédio Comercial",
    descricao: "Prédio comercial de 10 andares precisa de limpeza de todas as janelas externas. Trabalho para equipe especializada com equipamentos de segurança.",
    categoria: "Limpeza",
    localizacao: "Faria Lima, São Paulo - SP",
    dataPublicacao: "2023-12-24T11:30:00Z",
    prazo: "2024-01-03",
    urgencia: "normal",
    cliente: {
      nome: "Construtora ABC",
      avaliacao: 4.9,
      totalAvaliacoes: 25,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza de altura",
      "Equipamentos de segurança",
      "Seguro de responsabilidade civil",
      "Equipe especializada"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 73,
    propostas: 8
  },
  {
    id: 24,
    titulo: "Organização de Consultório Médico",
    descricao: "Consultório médico pequeno precisa organizar arquivos de pacientes, medicamentos, equipamentos e criar sistema de armazenamento eficiente.",
    categoria: "Organização",
    localizacao: "Jardins, São Paulo - SP",
    dataPublicacao: "2023-12-23T13:45:00Z",
    prazo: "2024-01-02",
    urgencia: "normal",
    cliente: {
      nome: "Dr. Carlos Medicina",
      avaliacao: 4.8,
      totalAvaliacoes: 15,
      verificado: true
    },
    requisitos: [
      "Conhecimento em organização médica",
      "Experiência com arquivos de saúde",
      "Confidencialidade total",
      "Conhecimento de normas sanitárias"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 39,
    propostas: 3
  },
  {
    id: 25,
    titulo: "Limpeza de Galpão Industrial",
    descricao: "Galpão de 500m² precisa de limpeza geral. Inclui remoção de poeira, limpeza de equipamentos, organização de ferramentas e limpeza de piso.",
    categoria: "Limpeza",
    localizacao: "Santo André, São Paulo - SP",
    dataPublicacao: "2023-12-22T08:20:00Z",
    prazo: "2024-01-01",
    urgencia: "alta",
    cliente: {
      nome: "Indústria Metalúrgica",
      avaliacao: 4.7,
      totalAvaliacoes: 22,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza industrial",
      "Equipamentos de proteção",
      "Disponibilidade para trabalho pesado",
      "Equipe para grande área"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 67,
    propostas: 7
  },
  {
    id: 26,
    titulo: "Organização de Loja de Roupas",
    descricao: "Loja de roupas femininas precisa reorganizar estoque, vitrine e área de provador. Inclui organização por tamanho, cor e categoria.",
    categoria: "Organização",
    localizacao: "Moema, São Paulo - SP",
    dataPublicacao: "2023-12-21T16:30:00Z",
    prazo: "2023-12-31",
    urgencia: "normal",
    cliente: {
      nome: "Boutique Elegance",
      avaliacao: 4.9,
      totalAvaliacoes: 18,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de lojas",
      "Conhecimento em moda",
      "Senso estético",
      "Disponibilidade para trabalhar com público"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 44,
    propostas: 4
  },
  {
    id: 27,
    titulo: "Limpeza de Laboratório de Análises",
    descricao: "Laboratório de análises clínicas precisa de limpeza especializada. Inclui desinfecção de equipamentos, limpeza de bancadas e organização de materiais.",
    categoria: "Limpeza",
    localizacao: "Vila Olímpia, São Paulo - SP",
    dataPublicacao: "2023-12-20T10:15:00Z",
    prazo: "2023-12-30",
    urgencia: "alta",
    cliente: {
      nome: "Lab Diagnósticos",
      avaliacao: 4.8,
      totalAvaliacoes: 13,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza de laboratórios",
      "Conhecimento em normas sanitárias",
      "Produtos específicos para desinfecção",
      "Certificação em biossegurança"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 51,
    propostas: 5
  },
  {
    id: 28,
    titulo: "Organização de Sala de Aula e Material Didático",
    descricao: "Sala de aula de curso técnico precisa organizar material didático, equipamentos e criar sistema de armazenamento para facilitar as aulas.",
    categoria: "Organização",
    localizacao: "Liberdade, São Paulo - SP",
    dataPublicacao: "2023-12-19T14:20:00Z",
    prazo: "2023-12-29",
    urgencia: "normal",
    cliente: {
      nome: "Instituto Técnico SP",
      avaliacao: 4.7,
      totalAvaliacoes: 16,
      verificado: true
    },
    requisitos: [
      "Experiência em organização educacional",
      "Conhecimento em material didático",
      "Senso pedagógico",
      "Disponibilidade para trabalhar com educadores"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 37,
    propostas: 3
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
    case "mais_recente":
      return servicosOrdenados.sort((a, b) => new Date(b.dataPublicacao) - new Date(a.dataPublicacao));
    case "mais_antigo":
      return servicosOrdenados.sort((a, b) => new Date(a.dataPublicacao) - new Date(b.dataPublicacao));
    case "mais_visualizado":
      return servicosOrdenados.sort((a, b) => b.visualizacoes - a.visualizacoes);
    case "mais_propostas":
      return servicosOrdenados.sort((a, b) => b.propostas - a.propostas);
    default:
      return servicosOrdenados;
  }
};
