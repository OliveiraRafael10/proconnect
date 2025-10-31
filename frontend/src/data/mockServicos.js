// src/data/mockServicos.js
// Dados mockados para serviços disponíveis na plataforma

import { obterCategoriaPorValor } from './mockCategorias';

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
      "Disponibilidade durante a semana"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 32,
    propostas: 5
  },
  {
    id: 3,
    titulo: "Limpeza Pós-Obra",
    descricao: "Acabei de fazer uma reforma no meu apartamento e preciso de uma limpeza especializada pós-obra. Tem muito pó de gesso, tinta e restos de materiais.",
    categoria: "Limpeza",
    localizacao: "Jardins, São Paulo - SP",
    dataPublicacao: "2024-01-13T16:45:00Z",
    prazo: "2024-01-16",
    urgencia: "alta",
    cliente: {
      nome: "Ana Paula",
      avaliacao: 4.7,
      totalAvaliacoes: 15,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza pós-obra",
      "Equipamentos específicos para limpeza pesada",
      "Equipe de pelo menos 2 pessoas"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 28,
    propostas: 2
  },
  {
    id: 4,
    titulo: "Organização de Closet",
    descricao: "Meu closet está completamente desorganizado. Preciso de alguém para organizar roupas por categoria, cores e estações. Inclui organização de sapatos e acessórios.",
    categoria: "Organização",
    localizacao: "Morumbi, São Paulo - SP",
    dataPublicacao: "2024-01-12T09:15:00Z",
    prazo: "2024-01-25",
    urgencia: "normal",
    cliente: {
      nome: "Carla Mendes",
      avaliacao: 4.9,
      totalAvaliacoes: 22,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de guarda-roupas",
      "Conhecimento em dobras e organização de roupas",
      "Disponibilidade para trabalhar no período da tarde"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 41,
    propostas: 4
  },
  {
    id: 5,
    titulo: "Limpeza de Vidros e Janelas",
    descricao: "Preciso de limpeza especializada em vidros e janelas de um apartamento no 15º andar. São muitas janelas grandes que precisam ser limpadas por dentro e por fora.",
    categoria: "Limpeza",
    localizacao: "Brooklin, São Paulo - SP",
    dataPublicacao: "2024-01-11T11:30:00Z",
    prazo: "2024-01-22",
    urgencia: "normal",
    cliente: {
      nome: "Roberto Silva",
      avaliacao: 4.6,
      totalAvaliacoes: 9,
      verificado: false
    },
    requisitos: [
      "Experiência em limpeza de vidros em altura",
      "Equipamentos de segurança",
      "Produtos específicos para limpeza de vidros"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 19,
    propostas: 1
  },
  {
    id: 6,
    titulo: "Organização de Cozinha",
    descricao: "Minha cozinha está muito desorganizada. Preciso reorganizar armários, geladeira, despensa e criar um sistema funcional para utensílios e mantimentos.",
    categoria: "Organização",
    localizacao: "Pinheiros, São Paulo - SP",
    dataPublicacao: "2024-01-10T13:20:00Z",
    prazo: "2024-01-28",
    urgencia: "normal",
    cliente: {
      nome: "Fernanda Costa",
      avaliacao: 4.8,
      totalAvaliacoes: 18,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de cozinhas",
      "Conhecimento em sistemas de armazenamento",
      "Disponibilidade para trabalhar aos sábados"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 35,
    propostas: 3
  },
  {
    id: 7,
    titulo: "Limpeza de Estofados",
    descricao: "Preciso de limpeza profissional em sofás, poltronas e tapetes. São móveis claros que mancharam e precisam de uma limpeza especializada.",
    categoria: "Limpeza",
    localizacao: "Vila Olímpia, São Paulo - SP",
    dataPublicacao: "2024-01-09T15:45:00Z",
    prazo: "2024-01-19",
    urgencia: "normal",
    cliente: {
      nome: "Paulo Henrique",
      avaliacao: 4.5,
      totalAvaliacoes: 7,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza de estofados",
      "Equipamentos para limpeza a vapor",
      "Produtos específicos para tecidos delicados"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 23,
    propostas: 2
  },
  {
    id: 8,
    titulo: "Organização de Quarto de Criança",
    descricao: "Quarto das crianças está muito bagunçado. Preciso organizar brinquedos, roupas, livros e criar um sistema que as próprias crianças consigam manter.",
    categoria: "Organização",
    localizacao: "Santana, São Paulo - SP",
    dataPublicacao: "2024-01-08T10:10:00Z",
    prazo: "2024-01-30",
    urgencia: "normal",
    cliente: {
      nome: "Marina Santos",
      avaliacao: 4.9,
      totalAvaliacoes: 14,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de quartos infantis",
      "Conhecimento em sistemas de organização para crianças",
      "Paciência para trabalhar com crianças presentes"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 42,
    propostas: 6
  },
  {
    id: 9,
    titulo: "Limpeza de Ar Condicionado",
    descricao: "Tenho 4 aparelhos de ar condicionado que precisam de limpeza completa. Incluindo filtros, serpentinas e duto de drenagem.",
    categoria: "Limpeza",
    localizacao: "Moema, São Paulo - SP",
    dataPublicacao: "2024-01-07T14:30:00Z",
    prazo: "2024-01-21",
    urgencia: "normal",
    cliente: {
      nome: "Eduardo Lima",
      avaliacao: 4.7,
      totalAvaliacoes: 11,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza de ar condicionado",
      "Conhecimento técnico em refrigeração",
      "Ferramentas específicas para limpeza de AC"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 17,
    propostas: 2
  },
  {
    id: 10,
    titulo: "Organização de Escritório Doméstico",
    descricao: "Meu escritório em casa está completamente desorganizado. Papéis espalhados, livros fora do lugar e arquivos sem organização. Preciso de um sistema eficiente.",
    categoria: "Organização",
    localizacao: "Itaim Bibi, São Paulo - SP",
    dataPublicacao: "2024-01-06T16:15:00Z",
    prazo: "2024-01-24",
    urgencia: "alta",
    cliente: {
      nome: "Juliana Rodrigues",
      avaliacao: 4.8,
      totalAvaliacoes: 20,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de escritórios",
      "Conhecimento em sistemas de arquivamento",
      "Discrição para lidar com documentos"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 38,
    propostas: 4
  },
  {
    id: 11,
    titulo: "Limpeza de Casa Completa - Mudança",
    descricao: "Estou me mudando e preciso de uma limpeza completa da casa antiga antes de entregar. Casa de 4 quartos, 3 banheiros, sala, cozinha, área de serviço e garagem.",
    categoria: "Limpeza",
    localizacao: "Campo Belo, São Paulo - SP",
    dataPublicacao: "2024-01-05T08:45:00Z",
    prazo: "2024-01-12",
    urgencia: "alta",
    cliente: {
      nome: "Ricardo Alves",
      avaliacao: 4.6,
      totalAvaliacoes: 5,
      verificado: false
    },
    requisitos: [
      "Experiência em limpeza completa",
      "Equipe de pelo menos 3 pessoas",
      "Disponibilidade para trabalhar no fim de semana"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 51,
    propostas: 8
  },
  {
    id: 12,
    titulo: "Organização de Despensa",
    descricao: "Minha despensa está um caos total. Preciso organizar mantimentos, produtos de limpeza e criar um sistema de identificação e rotatividade dos produtos.",
    categoria: "Organização",
    localizacao: "Perdizes, São Paulo - SP",
    dataPublicacao: "2024-01-04T12:20:00Z",
    prazo: "2024-01-26",
    urgencia: "normal",
    cliente: {
      nome: "Beatriz Ferreira",
      avaliacao: 4.9,
      totalAvaliacoes: 16,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de despensas",
      "Conhecimento em sistemas de rotatividade",
      "Criatividade para otimizar espaços pequenos"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 29,
    propostas: 3
  },
  {
    id: 13,
    titulo: "Limpeza de Piscina e Área Externa",
    descricao: "Preciso de limpeza completa da piscina, deck de madeira, churrasqueira e jardim. A piscina está verde e precisa de tratamento químico.",
    categoria: "Limpeza",
    localizacao: "Alto de Pinheiros, São Paulo - SP",
    dataPublicacao: "2024-01-03T17:10:00Z",
    prazo: "2024-01-15",
    urgencia: "normal",
    cliente: {
      nome: "Carlos Eduardo",
      avaliacao: 4.4,
      totalAvaliacoes: 8,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza e manutenção de piscinas",
      "Conhecimento em produtos químicos para piscina",
      "Equipamentos para limpeza de área externa"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 33,
    propostas: 2
  },
  {
    id: 14,
    titulo: "Organização de Biblioteca Pessoal",
    descricao: "Tenho uma grande coleção de livros que está completamente desorganizada. Preciso organizar por gênero, autor e criar um sistema de catalogação.",
    categoria: "Organização",
    localizacao: "Bela Vista, São Paulo - SP",
    dataPublicacao: "2024-01-02T09:30:00Z",
    prazo: "2024-01-31",
    urgencia: "normal",
    cliente: {
      nome: "Professor Antônio",
      avaliacao: 4.8,
      totalAvaliacoes: 12,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de bibliotecas",
      "Conhecimento em sistemas de catalogação",
      "Cuidado com livros antigos e raros"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 26,
    propostas: 1
  },
  {
    id: 15,
    titulo: "Limpeza de Apartamento para Venda",
    descricao: "Estou vendendo meu apartamento e preciso deixá-lo impecável para as visitas. Limpeza completa incluindo todos os detalhes para causar boa impressão.",
    categoria: "Limpeza",
    localizacao: "Vila Nova Conceição, São Paulo - SP",
    dataPublicacao: "2024-01-01T14:45:00Z",
    prazo: "2024-01-08",
    urgencia: "alta",
    cliente: {
      nome: "Renata Oliveira",
      avaliacao: 4.9,
      totalAvaliacoes: 25,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza para venda de imóveis",
      "Atenção aos detalhes",
      "Disponibilidade para limpeza de manutenção"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 44,
    propostas: 5
  },
  {
    id: 16,
    titulo: "Organização de Garagem",
    descricao: "Minha garagem virou depósito. Preciso organizar ferramentas, equipamentos, decoração de natal, objetos antigos e criar áreas específicas para cada categoria.",
    categoria: "Organização",
    localizacao: "Butantã, São Paulo - SP",
    dataPublicacao: "2023-12-31T11:15:00Z",
    prazo: "2024-01-29",
    urgencia: "normal",
    cliente: {
      nome: "Marcos Vinícius",
      avaliacao: 4.5,
      totalAvaliacoes: 6,
      verificado: false
    },
    requisitos: [
      "Experiência em organização de garagens",
      "Força física para mover objetos pesados",
      "Criatividade para otimizar espaços"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 18,
    propostas: 1
  },
  {
    id: 17,
    titulo: "Limpeza de Cortinas e Persianas",
    descricao: "Preciso de limpeza especializada em cortinas de tecido e persianas de madeira. São várias janelas e algumas cortinas são muito delicadas.",
    categoria: "Limpeza",
    localizacao: "Higienópolis, São Paulo - SP",
    dataPublicacao: "2023-12-30T15:20:00Z",
    prazo: "2024-01-20",
    urgencia: "normal",
    cliente: {
      nome: "Dona Helena",
      avaliacao: 4.7,
      totalAvaliacoes: 19,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza de cortinas",
      "Conhecimento em tecidos delicados",
      "Equipamentos específicos para persianas"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 22,
    propostas: 2
  },
  {
    id: 18,
    titulo: "Organização de Roupas de Bebê",
    descricao: "Ganhei muitas roupas de bebê de vários tamanhos e estou perdida. Preciso organizar por idade, estação e criar um sistema prático para o dia a dia.",
    categoria: "Organização",
    localizacao: "Vila Mariana, São Paulo - SP",
    dataPublicacao: "2023-12-29T13:50:00Z",
    prazo: "2024-01-23",
    urgencia: "normal",
    cliente: {
      nome: "Camila Nascimento",
      avaliacao: 4.6,
      totalAvaliacoes: 3,
      verificado: false
    },
    requisitos: [
      "Experiência com organização de roupas infantis",
      "Conhecimento em tamanhos de bebê",
      "Paciência e carinho com itens delicados"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 31,
    propostas: 4
  },
  {
    id: 19,
    titulo: "Limpeza de Escritório Comercial",
    descricao: "Escritório pequeno com 3 salas, recepção, copa e 2 banheiros. Preciso de limpeza semanal, incluindo limpeza de equipamentos eletrônicos.",
    categoria: "Limpeza",
    localizacao: "Centro, São Paulo - SP",
    dataPublicacao: "2023-12-28T10:25:00Z",
    prazo: "2024-01-05",
    urgencia: "normal",
    cliente: {
      nome: "Empresa ABC Ltda",
      avaliacao: 4.8,
      totalAvaliacoes: 15,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza comercial",
      "Disponibilidade para trabalhar durante a semana",
      "Discrição e profissionalismo"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 39,
    propostas: 3
  },
  {
    id: 20,
    titulo: "Organização de Quarto de Casal",
    descricao: "Nosso quarto está muito desorganizado. Precisamos reorganizar o guarda-roupa, criados-mudos, cômoda e criar um ambiente mais relaxante e funcional.",
    categoria: "Organização",
    localizacao: "Tatuapé, São Paulo - SP",
    dataPublicacao: "2023-12-27T16:40:00Z",
    prazo: "2024-01-27",
    urgencia: "normal",
    cliente: {
      nome: "Casal Rodrigues",
      avaliacao: 4.7,
      totalAvaliacoes: 10,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de quartos",
      "Conhecimento em organização de roupas de casal",
      "Bom gosto para decoração"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 27,
    propostas: 2
  },
  {
    id: 21,
    titulo: "Limpeza de Tapeçaria Automotiva",
    descricao: "Preciso de limpeza completa do estofado do meu carro. Bancos de couro e tecido, tapetes e teto solar. O carro está muito sujo.",
    categoria: "Limpeza",
    localizacao: "Ipiranga, São Paulo - SP",
    dataPublicacao: "2023-12-26T12:30:00Z",
    prazo: "2024-01-10",
    urgencia: "normal",
    cliente: {
      nome: "Gabriel Souza",
      avaliacao: 4.5,
      totalAvaliacoes: 4,
      verificado: false
    },
    requisitos: [
      "Experiência em limpeza automotiva",
      "Produtos específicos para couro e tecido",
      "Equipamentos para limpeza de veículos"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 15,
    propostas: 1
  },
  {
    id: 22,
    titulo: "Organização de Material Escolar",
    descricao: "Com as crianças voltando às aulas, preciso organizar todo o material escolar acumulado. Livros, cadernos, lápis, canetas e materiais de arte.",
    categoria: "Organização",
    localizacao: "Saúde, São Paulo - SP",
    dataPublicacao: "2023-12-25T14:15:00Z",
    prazo: "2024-02-01",
    urgencia: "normal",
    cliente: {
      nome: "Família Silva",
      avaliacao: 4.8,
      totalAvaliacoes: 7,
      verificado: true
    },
    requisitos: [
      "Experiência com organização escolar",
      "Conhecimento em materiais escolares",
      "Criatividade para sistemas práticos"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 24,
    propostas: 3
  },
  {
    id: 23,
    titulo: "Limpeza de Lustre de Cristal",
    descricao: "Tenho um lustre de cristal grande na sala de jantar que precisa de limpeza especializada. São muitas peças pequenas e precisa de muito cuidado.",
    categoria: "Limpeza",
    localizacao: "Jardim Europa, São Paulo - SP",
    dataPublicacao: "2023-12-24T18:20:00Z",
    prazo: "2024-01-18",
    urgencia: "normal",
    cliente: {
      nome: "Família Bernardes",
      avaliacao: 4.9,
      totalAvaliacoes: 13,
      verificado: true
    },
    requisitos: [
      "Experiência em limpeza de cristais",
      "Muito cuidado e delicadeza",
      "Conhecimento em produtos específicos"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 21,
    propostas: 2
  },
  {
    id: 24,
    titulo: "Organização de Loja de Roupas",
    descricao: "Tenho uma pequena loja de roupas que precisa de uma reorganização completa. Organizar por tamanho, cor, estilo e criar um layout mais atrativo.",
    categoria: "Organização",
    localizacao: "Liberdade, São Paulo - SP",
    dataPublicacao: "2023-12-23T11:45:00Z",
    prazo: "2024-01-30",
    urgencia: "normal",
    cliente: {
      nome: "Loja Estilo & Moda",
      avaliacao: 4.6,
      totalAvaliacoes: 9,
      verificado: true
    },
    requisitos: [
      "Experiência em organização comercial",
      "Conhecimento em visual merchandising",
      "Disponibilidade para trabalhar após horário comercial"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 36,
    propostas: 4
  },
  {
    id: 25,
    titulo: "Limpeza de Casa de Praia",
    descricao: "Casa de praia que ficou fechada por 6 meses. Precisa de limpeza completa, remoção de mofo, limpeza de móveis e preparação para a temporada.",
    categoria: "Limpeza",
    localizacao: "Guarujá, SP",
    dataPublicacao: "2023-12-22T09:30:00Z",
    prazo: "2024-01-14",
    urgencia: "alta",
    cliente: {
      nome: "Roberto e Marina",
      avaliacao: 4.7,
      totalAvaliacoes: 8,
      verificado: true
    },
    requisitos: [
      "Experiência com limpeza pós-fechamento",
      "Conhecimento em remoção de mofo",
      "Disponibilidade para viajar até Guarujá"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80",
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 43,
    propostas: 5
  },
  {
    id: 26,
    titulo: "Organização de Ateliê de Costura",
    descricao: "Meu ateliê de costura está uma bagunça. Preciso organizar tecidos, linhas, botões, máquinas e criar um espaço funcional para trabalhar.",
    categoria: "Organização",
    localizacao: "Barra Funda, São Paulo - SP",
    dataPublicacao: "2023-12-21T15:10:00Z",
    prazo: "2024-01-25",
    urgencia: "normal",
    cliente: {
      nome: "Ateliê da Carla",
      avaliacao: 4.8,
      totalAvaliacoes: 11,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de ateliês",
      "Conhecimento em materiais de costura",
      "Criatividade para otimizar espaço de trabalho"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 28,
    propostas: 2
  },
  {
    id: 27,
    titulo: "Limpeza de Equipamentos de Academia",
    descricao: "Tenho uma academia em casa com vários equipamentos que precisam de limpeza e manutenção. Esteira, bicicleta, pesos e aparelhos diversos.",
    categoria: "Limpeza",
    localizacao: "Campo Limpo, São Paulo - SP",
    dataPublicacao: "2023-12-20T13:25:00Z",
    prazo: "2024-01-16",
    urgencia: "normal",
    cliente: {
      nome: "Personal Trainer Lucas",
      avaliacao: 4.5,
      totalAvaliacoes: 6,
      verificado: false
    },
    requisitos: [
      "Experiência em limpeza de equipamentos de exercício",
      "Conhecimento em produtos específicos",
      "Cuidado com equipamentos eletrônicos"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 19,
    propostas: 1
  },
  {
    id: 28,
    titulo: "Organização de Documentos Pessoais",
    descricao: "Tenho anos de documentos acumulados sem organização. RG, CPF, contas, contratos, garantias. Preciso de um sistema de arquivamento eficiente.",
    categoria: "Organização",
    localizacao: "Penha, São Paulo - SP",
    dataPublicacao: "2023-12-19T17:40:00Z",
    prazo: "2024-02-05",
    urgencia: "normal",
    cliente: {
      nome: "Sr. José Carlos",
      avaliacao: 4.6,
      totalAvaliacoes: 4,
      verificado: true
    },
    requisitos: [
      "Experiência em organização de documentos",
      "Discrição total com informações pessoais",
      "Conhecimento em sistemas de arquivamento"
    ],
    imagens: [
      "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600&q=80"
    ],
    status: "disponivel",
    visualizacoes: 37,
    propostas: 3
  }
];

// Categorias para filtros - usando dados centralizados
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
    const matchBusca = !filtros.busca || 
      servico.titulo.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      servico.descricao.toLowerCase().includes(filtros.busca.toLowerCase()) ||
      servico.categoria.toLowerCase().includes(filtros.busca.toLowerCase());

    const matchCategoria = !filtros.categoria || filtros.categoria === '' || 
      servico.categoria.toLowerCase() === filtros.categoria;

    const matchUrgencia = filtros.urgencia === 'todas' || 
      servico.urgencia === filtros.urgencia;

    return matchBusca && matchCategoria && matchUrgencia;
  });
};

// Função para ordenar serviços
export const ordenarServicos = (servicos, criterio) => {
  const servicosOrdenados = [...servicos];
  
  switch (criterio) {
    case 'recentes':
      return servicosOrdenados.sort((a, b) => 
        new Date(b.dataPublicacao) - new Date(a.dataPublicacao)
      );
    case 'antigos':
      return servicosOrdenados.sort((a, b) => 
        new Date(a.dataPublicacao) - new Date(b.dataPublicacao)
      );
    case 'visualizacoes':
      return servicosOrdenados.sort((a, b) => b.visualizacoes - a.visualizacoes);
    case 'propostas':
      return servicosOrdenados.sort((a, b) => b.propostas - a.propostas);
    default:
      return servicosOrdenados;
  }
};