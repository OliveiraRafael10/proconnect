// src/data/mockDataFrelaFacil.js

export const usuarios = [
  {
    id_usuario: 1,
    nome: "Ana Beatriz Rocha",
    email: "ana.rocha@email.com",
    senha_hash: "hash1",
    cpf: "123.456.789-01",
    endereco : {
      cep: "",
      rua: "",
      numero: "",
      cidade: "",
      estado: "",
      bairro: "",
      complemento: ""
    },
    apelido: "",
    telefone:{
      ddd: "",
      numero: ""
    },
    foto_url: "",
    criado_em: "2025-01-10T09:00:00"
  },
  {
    id_usuario: 2,
    nome: "Lucas Fernandes",
    email: "lucas@email.com",
    senha_hash: "hash2",
    cpf: "987.654.321-00",
    endereco : {
      cep: "",
      rua: "",
      numero: "",
      cidade: "",
      estado: "",
      bairro: "",
      complemento: ""
    },
    apelido: "",
    telefone:{
      ddd: "",
      numero: ""
    },
    foto_url: "",
    criado_em: "2025-01-11T10:30:00"
  },
  {
    id_usuario: 3,
    nome: "Juliana Ribeiro",
    email: "juliana@email.com",
    senha_hash: "hash3",
    cpf: "234.567.890-12",
    endereco : {
      cep: "",
      rua: "",
      numero: "",
      cidade: "",
      estado: "",
      bairro: "",
      complemento: ""
    },
    apelido: "",
    telefone:{
      ddd: "",
      numero: ""
    },
    foto_url: "",
    criado_em: "2025-01-12T08:15:00"
  },
  {
    id_usuario: 4,
    nome: "Rafael Oliveira",
    email: "rafa@email.com",
    senha_hash: "rafa123",
    cpf: "364.267.808-18",
    endereco : {
      cep: "",
      rua: "",
      numero: "",
      cidade: "",
      estado: "",
      bairro: "",
      complemento: ""
    },
    apelido: "",
    telefone:{
      ddd: "",
      numero: ""
    },
    foto_url: "",
    criado_em: "2025-01-12T11:15:00"
  }
];


export const categorias = [
  { id_categoria: 1, nome: "Design" },
  { id_categoria: 2, nome: "Reparos" },
  { id_categoria: 3, nome: "Aulas" },
  { id_categoria: 4, nome: "Tecnologia" }
];


export const servicos = [
  {
    id_servico: 1,
    titulo: "Criação de Identidade Visual",
    descricao: "Designer profissional com foco em marcas modernas.",
    preco_min: 200,
    preco_max: 600,
    id_categoria: 1,
    id_usuario_criador: 1,
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
    publicado_em: "2025-01-15T14:00:00"
  },
  {
    id_servico: 2,
    titulo: "Conserto de Torneiras",
    descricao: "Faço pequenos reparos hidráulicos e manutenção.",
    preco_min: 80,
    preco_max: 150,
    id_categoria: 2,
    id_usuario_criador: 2,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    publicado_em: "2025-01-18T16:00:00"
  },
  {
    id_servico: 3,
    titulo: "Aula de Matemática",
    descricao: "Aulas particulares do ensino fundamental ao médio.",
    preco_min: 50,
    preco_max: 90,
    id_categoria: 3,
    id_usuario_criador: 3,
    avatar: "https://randomuser.me/api/portraits/women/22.jpg",
    publicado_em: "2025-01-20T10:00:00"
  },
  {
    id_servico: 4,
    titulo: "Aula de Ingles",
    descricao: "Aulas particulares do ensino fundamental ao médio.",
    preco_min: 50,
    preco_max: 90,
    id_categoria: 3,
    id_usuario_criador: 3,
    avatar: "https://randomuser.me/api/portraits/women/18.jpg",
    publicado_em: "2025-01-20T10:00:00"
  },
  {
    id_servico: 5,
    titulo: "Pedreiro",
    descricao: "Pedreiro de mão cheia, experiente.",
    preco_min: 50,
    preco_max: 90,
    id_categoria: 2,
    id_usuario_criador: 3,
    avatar: "https://randomuser.me/api/portraits/men/20.jpg",
    publicado_em: "2025-01-20T10:00:00"
  },
  {
    id_servico: 6,
    titulo: "Técnico de informática",
    descricao: "Reparos de hardware e sotfware.",
    preco_min: 50,
    preco_max: 90,
    id_categoria: 3,
    id_usuario_criador: 3,
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    publicado_em: "2025-01-20T10:00:00"
  },
  {
    id_servico: 7,
    titulo: "Mecânico",
    descricao: "Mecanica em geral para carros GM e Wolks.",
    preco_min: 50,
    preco_max: 90,
    id_categoria: 3,
    id_usuario_criador: 3,
    avatar: "https://randomuser.me/api/portraits/men/25.jpg",
    publicado_em: "2025-01-20T10:00:00"
  },
   ...Array.from({ length: 27 }, (_, i) => {
    const id = i + 4;
    return {
      id_servico: id,
      titulo: [
        "Aula de Inglês",
        "Pedreiro",
        "Técnico de Informática",
        "Mecânico",
        "Editor de Vídeo",
        "Manicure e Pedicure",
        "Eletricista",
        "Cuidador de Idosos",
        "Babá",
        "Desenvolvedor Web",
        "Marketing Digital",
        "Social Media",
        "Fotógrafo de Eventos",
        "Montador de Móveis",
        "Diarista",
        "Garçom para Eventos",
        "Pintor Residencial",
        "Instalador de Ar-condicionado",
        "Consultoria Financeira",
        "Nutricionista Online",
        "Treinador Pessoal",
        "Tradutor de Textos",
        "Cabeleireiro",
        "DJ para festas",
        "Organizador de Eventos",
        "Personal Organizer",
        "Professor de Violão"
      ][i % 27],
      descricao: "Descrição genérica para teste da listagem.",
      preco_min: 50 + (i % 5) * 25,
      preco_max: 150 + (i % 3) * 50,
      id_categoria: (i % 4) + 1,
      id_usuario_criador: (i % 5) + 1,
      avatar: `https://randomuser.me/api/portraits/${i % 2 === 0 ? "men" : "women"}/${10 + i}.jpg`,
      publicado_em: `2025-01-${20 + (i % 8)}T10:00:00`
    };
  })
];


export const contratacoes = [
  {
    id_contratacao: 1,
    id_servico: 1,
    id_usuario_contratado: 2,
    data_contratacao: "2025-01-21T08:00:00",
    status: "concluido",
    valor_acordado: 250
  },
  {
    id_contratacao: 2,
    id_servico: 3,
    id_usuario_contratado: 1,
    data_contratacao: "2025-01-24T08:30:00",
    status: "concluido",
    valor_acordado: 80
  }
];


export const avaliacoes = [
  {
    id: 1,
    nota: 5,
    comentario: "Serviço excelente e dentro do prazo!",
    criado_em: "2025-01-22T11:00:00",
    id_contratacao: 1,
    id_avaliador: 2
  },
  {
    id: 2,
    nota: 4,
    comentario: "Didática ótima, recomendo!",
    criado_em: "2025-01-25T14:20:00",
    id_contratacao: 2,
    id_avaliador: 1
  }
];


export const mensagens = [
  {
    id: 1,
    remetente_id_usuario: 2,
    destinatario_id_usuario: 1,
    conteudo: "Você está disponível esta semana?",
    lida: false,
    enviada_em: "2025-01-19T09:00:00"
  },
  {
    id: 2,
    remetente_id_usuario: 1,
    destinatario_id_usuario: 2,
    conteudo: "Sim! Tenho horários na quarta e sexta.",
    lida: true,
    enviada_em: "2025-01-19T09:10:00"
  }
];

