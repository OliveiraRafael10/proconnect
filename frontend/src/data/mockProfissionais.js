export const profissionais = [
  {
    id: 1,
    nome: "Maria Silva",
    email: "maria@email.com",
    foto_url: "https://randomuser.me/api/portraits/women/22.jpg",
    endereco: {
      cidade: "Capivari",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Limpeza", "Organização"],
      descricao: "Profissional dedicada com mais de 3 anos de experiência em serviços de limpeza e organização para residências e escritórios. Foco na satisfação do cliente e atenção aos detalhes.",
      experiencia: "Mais de 3 anos de experiência em limpeza residencial e comercial, incluindo organização de ambientes, lavagem de roupas e cuidados com plantas. Certificada em técnicas de limpeza profissional.",
      portfolio: [
        { id: 'p1', name: 'Limpeza de Cozinha', url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Organização de Armário', url: 'https://images.unsplash.com/photo-1611269154421-4320a1222a67?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p3', name: 'Limpeza Pós-Obra', url: 'https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: false, domingo: false
      },
      raioAtendimento: '20',
      certificacoes: [
        { nome: 'Curso de Limpeza Profissional', instituicao: 'Instituto de Limpeza', ano: '2021' },
        { nome: 'Organização de Ambientes', instituicao: 'Escola de Organização', ano: '2022' }
      ],
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 45
    }
  },
  {
    id: 2,
    nome: "João Santos",
    email: "joao@email.com",
    foto_url: "https://randomuser.me/api/portraits/men/32.jpg",
    endereco: {
      cidade: "Piracicaba",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Reparos e Manutenção", "Construção Civil"],
      descricao: "Técnico especializado em reparos domésticos e pequenas reformas. Mais de 5 anos de experiência com foco em qualidade e pontualidade.",
      experiencia: "Experiência em hidráulica, elétrica básica, pintura, montagem de móveis e pequenos reparos. Trabalho com garantia e materiais de qualidade.",
      portfolio: [
        { id: 'p1', name: 'Reparo Hidráulico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Montagem de Móveis', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p3', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p4', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p5', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p6', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p7', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p8', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p9', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p10', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p11', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p12', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p13', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p14', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p15', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p16', name: 'Reparo Elétrico', url: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false
      },
      raioAtendimento: '30',
      certificacoes: [
        { nome: 'Técnico em Reparos', instituicao: 'Senai', ano: '2019' }
      ],
      avaliacaoMedia: 4.9,
      totalAvaliacoes: 67
    }
  },
  {
    id: 3,
    nome: "Ana Costa",
    email: "ana@email.com",
    foto_url: "https://randomuser.me/api/portraits/women/23.jpg",
    endereco: {
      cidade: "Itu",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Aulas Particulares", "Tecnologia"],
      descricao: "Professora de matemática e física com experiência em ensino personalizado. Especializada em preparação para vestibulares e reforço escolar.",
      experiencia: "Mais de 4 anos lecionando matemática e física. Formada em Engenharia com pós-graduação em Educação. Metodologia adaptada para cada aluno.",
      portfolio: [
        { id: 'p1', name: 'Aula de Matemática', url: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false
      },
      raioAtendimento: '25',
      certificacoes: [
        { nome: 'Licenciatura em Matemática', instituicao: 'UNICAMP', ano: '2018' },
        { nome: 'Pós em Educação', instituicao: 'PUC-SP', ano: '2020' }
      ],
      avaliacaoMedia: 4.7,
      totalAvaliacoes: 23
    }
  },
  {
    id: 4,
    nome: "Carlos Mendes",
    email: "carlos@email.com",
    foto_url: "https://randomuser.me/api/portraits/men/33.jpg",
    endereco: {
      cidade: "Sorocaba",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Design Gráfico", "Marketing Digital"],
      descricao: "Designer gráfico e especialista em marketing digital. Criação de identidade visual, logos, materiais promocionais e gestão de redes sociais.",
      experiencia: "Mais de 6 anos de experiência em design gráfico e marketing digital. Especializado em branding, social media e campanhas publicitárias online.",
      portfolio: [
        { id: 'p1', name: 'Logo Design', url: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Material Promocional', url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: false, domingo: false
      },
      raioAtendimento: '50',
      certificacoes: [
        { nome: 'Design Gráfico', instituicao: 'SENAC', ano: '2017' },
        { nome: 'Marketing Digital', instituicao: 'Google', ano: '2020' }
      ],
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 34
    }
  },
  {
    id: 5,
    nome: "Fernanda Lima",
    email: "fernanda@email.com",
    foto_url: "https://randomuser.me/api/portraits/women/24.jpg",
    endereco: {
      cidade: "Capivari",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Beleza e Estética"],
      descricao: "Manicure e pedicure profissional com especialização em unhas artísticas. Atendimento domiciliar com materiais de primeira qualidade.",
      experiencia: "Mais de 3 anos de experiência em manicure e pedicure. Especializada em técnicas de alongamento, unhas artísticas e cuidados com cutículas.",
      portfolio: [
        { id: 'p1', name: 'Unhas Artísticas', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: false, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true
      },
      raioAtendimento: '20',
      certificacoes: [
        { nome: 'Curso de Manicure', instituicao: 'Escola de Beleza', ano: '2019' }
      ],
      avaliacaoMedia: 4.9,
      totalAvaliacoes: 56
    }
  },
  {
    id: 6,
    nome: "Roberto Alves",
    email: "roberto@email.com",
    foto_url: "https://randomuser.me/api/portraits/men/34.jpg",
    endereco: {
      cidade: "Piracicaba",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Construção Civil", "Reparos e Manutenção"],
      descricao: "Pedreiro experiente com mais de 8 anos de experiência em construção civil, reformas e reparos. Especializado em alvenaria, acabamentos e pequenas reformas residenciais.",
      experiencia: "Mais de 8 anos trabalhando com construção civil. Experiência em alvenaria, reboco, pintura, azulejamento, instalação de pisos e pequenas reformas. Trabalho com qualidade e pontualidade garantidas.",
      portfolio: [
        { id: 'p1', name: 'Reforma de Cozinha', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Construção de Muro', url: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false
      },
      raioAtendimento: '25',
      certificacoes: [
        { nome: 'Curso de Pedreiro', instituicao: 'Senai', ano: '2016' },
        { nome: 'Segurança no Trabalho', instituicao: 'NR-35', ano: '2020' }
      ],
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 89
    }
  },
  {
    id: 7,
    nome: "Lucia Mendes",
    email: "lucia@email.com",
    foto_url: "https://randomuser.me/api/portraits/women/25.jpg",
    endereco: {
      cidade: "Itu",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Culinária", "Eventos"],
      descricao: "Chef de cozinha com especialização em culinária brasileira e internacional. Atendimento para eventos, jantares especiais e aulas particulares de culinária.",
      experiencia: "Mais de 6 anos de experiência em culinária profissional. Formada em Gastronomia, especializada em culinária brasileira, italiana e francesa. Experiência em eventos corporativos e particulares.",
      portfolio: [
        { id: 'p1', name: 'Jantar Italiano', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Aula de Culinária', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: false, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true
      },
      raioAtendimento: '30',
      certificacoes: [
        { nome: 'Gastronomia', instituicao: 'Senac', ano: '2018' },
        { nome: 'Culinária Italiana', instituicao: 'Instituto Italiano', ano: '2019' }
      ],
      avaliacaoMedia: 4.9,
      totalAvaliacoes: 67
    }
  },
  {
    id: 8,
    nome: "Pedro Costa",
    email: "pedro@email.com",
    foto_url: "https://randomuser.me/api/portraits/men/35.jpg",
    endereco: {
      cidade: "Sorocaba",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Tecnologia", "Reparos e Manutenção"],
      descricao: "Técnico em informática especializado em manutenção de computadores, notebooks e redes. Atendimento domiciliar com diagnóstico rápido e solução eficiente.",
      experiencia: "Mais de 5 anos de experiência em manutenção de computadores e notebooks. Especializado em remoção de vírus, formatação, upgrades de hardware e configuração de redes domésticas.",
      portfolio: [
        { id: 'p1', name: 'Manutenção de Notebook', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Configuração de Rede', url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false
      },
      raioAtendimento: '35',
      certificacoes: [
        { nome: 'Técnico em Informática', instituicao: 'Senai', ano: '2019' },
        { nome: 'Redes de Computadores', instituicao: 'Cisco', ano: '2020' }
      ],
      avaliacaoMedia: 4.7,
      totalAvaliacoes: 45
    }
  },
  {
    id: 9,
    nome: "Isabela Santos",
    email: "isabela@email.com",
    foto_url: "https://randomuser.me/api/portraits/women/26.jpg",
    endereco: {
      cidade: "Capivari",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Saúde e Bem-estar", "Aulas Particulares"],
      descricao: "Fisioterapeuta especializada em reabilitação e exercícios terapêuticos. Atendimento domiciliar para idosos, pós-cirúrgicos e lesões esportivas.",
      experiencia: "Mais de 4 anos de experiência em fisioterapia. Especializada em reabilitação funcional, exercícios terapêuticos e atendimento domiciliar. Experiência com idosos e pacientes pós-cirúrgicos.",
      portfolio: [
        { id: 'p1', name: 'Sessão de Fisioterapia', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Exercícios Terapêuticos', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: false, domingo: false
      },
      raioAtendimento: '20',
      certificacoes: [
        { nome: 'Fisioterapia', instituicao: 'UNICAMP', ano: '2020' },
        { nome: 'Fisioterapia Domiciliar', instituicao: 'CRF-SP', ano: '2021' }
      ],
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 52
    }
  },
  {
    id: 10,
    nome: "Marcos Oliveira",
    email: "marcos@email.com",
    foto_url: "https://randomuser.me/api/portraits/men/36.jpg",
    endereco: {
      cidade: "Piracicaba",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Transporte", "Eventos"],
      descricao: "Motorista profissional com experiência em transporte de passageiros e eventos. Veículo confortável e seguro para viagens, eventos e passeios.",
      experiencia: "Mais de 7 anos de experiência como motorista profissional. Especializado em transporte de passageiros, eventos corporativos, casamentos e passeios turísticos. Veículo em perfeito estado.",
      portfolio: [
        { id: 'p1', name: 'Transporte para Evento', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Passeio Turístico', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true
      },
      raioAtendimento: '100',
      certificacoes: [
        { nome: 'CNH D', instituicao: 'Detran-SP', ano: '2017' },
        { nome: 'Transporte de Passageiros', instituicao: 'ANTT', ano: '2018' }
      ],
      avaliacaoMedia: 4.9,
      totalAvaliacoes: 78
    }
  },
  {
    id: 11,
    nome: "Camila Rodrigues",
    email: "camila@email.com",
    foto_url: "https://randomuser.me/api/portraits/women/27.jpg",
    endereco: {
      cidade: "Itu",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Fotografia", "Eventos"],
      descricao: "Fotógrafa profissional especializada em eventos, ensaios e fotografia comercial. Estilo criativo e moderno com equipamentos profissionais.",
      experiencia: "Mais de 5 anos de experiência em fotografia profissional. Especializada em eventos sociais, ensaios fotográficos, fotografia comercial e tratamento de imagens. Equipamentos profissionais de última geração.",
      portfolio: [
        { id: 'p1', name: 'Ensaio Fotográfico', url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Evento Corporativo', url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: false, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true
      },
      raioAtendimento: '50',
      certificacoes: [
        { nome: 'Fotografia Profissional', instituicao: 'Senac', ano: '2019' },
        { nome: 'Photoshop Avançado', instituicao: 'Adobe', ano: '2020' }
      ],
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 63
    }
  },
  {
    id: 12,
    nome: "Rafael Silva",
    email: "rafael@email.com",
    foto_url: "https://randomuser.me/api/portraits/men/37.jpg",
    endereco: {
      cidade: "Sorocaba",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Marketing Digital", "Tecnologia"],
      descricao: "Especialista em marketing digital e gestão de redes sociais. Criação de campanhas, gestão de conteúdo e estratégias de crescimento para pequenos negócios.",
      experiencia: "Mais de 6 anos de experiência em marketing digital. Especializado em gestão de redes sociais, criação de campanhas publicitárias, SEO e estratégias de crescimento para pequenos negócios.",
      portfolio: [
        { id: 'p1', name: 'Campanha de Marketing', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Gestão de Redes Sociais', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: false, domingo: false
      },
      raioAtendimento: '60',
      certificacoes: [
        { nome: 'Marketing Digital', instituicao: 'Google', ano: '2020' },
        { nome: 'Facebook Ads', instituicao: 'Meta', ano: '2021' }
      ],
      avaliacaoMedia: 4.7,
      totalAvaliacoes: 41
    }
  },
  {
    id: 13,
    nome: "Patricia Lima",
    email: "patricia@email.com",
    foto_url: "https://randomuser.me/api/portraits/women/28.jpg",
    endereco: {
      cidade: "Capivari",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Contabilidade", "Jurídico"],
      descricao: "Contadora especializada em abertura de empresas, impostos e consultoria financeira para pequenos negócios e MEIs.",
      experiencia: "Mais de 8 anos de experiência em contabilidade. Especializada em abertura de empresas, impostos, consultoria financeira e regularização de documentos para pequenos negócios e MEIs.",
      portfolio: [
        { id: 'p1', name: 'Abertura de Empresa', url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Consultoria Financeira', url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: false, domingo: false
      },
      raioAtendimento: '30',
      certificacoes: [
        { nome: 'Contabilidade', instituicao: 'CRC-SP', ano: '2016' },
        { nome: 'Consultoria Financeira', instituicao: 'CFC', ano: '2018' }
      ],
      avaliacaoMedia: 4.9,
      totalAvaliacoes: 72
    }
  },
  {
    id: 14,
    nome: "Diego Santos",
    email: "diego@email.com",
    foto_url: "https://randomuser.me/api/portraits/men/38.jpg",
    endereco: {
      cidade: "Piracicaba",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Aulas Particulares", "Tecnologia"],
      descricao: "Professor de programação e desenvolvimento web. Aulas particulares de JavaScript, React, Node.js e outras tecnologias modernas.",
      experiencia: "Mais de 4 anos de experiência em desenvolvimento web e ensino. Especializado em JavaScript, React, Node.js, Python e outras tecnologias modernas. Metodologia prática e didática.",
      portfolio: [
        { id: 'p1', name: 'Aula de JavaScript', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Projeto React', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false
      },
      raioAtendimento: '40',
      certificacoes: [
        { nome: 'Desenvolvimento Web', instituicao: 'Rocketseat', ano: '2020' },
        { nome: 'JavaScript Avançado', instituicao: 'Alura', ano: '2021' }
      ],
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 38
    }
  },
  {
    id: 15,
    nome: "Juliana Costa",
    email: "juliana@email.com",
    foto_url: "https://randomuser.me/api/portraits/women/29.jpg",
    endereco: {
      cidade: "Itu",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Saúde e Bem-estar", "Aulas Particulares"],
      descricao: "Nutricionista especializada em consultoria nutricional, planos alimentares personalizados e educação alimentar para toda a família.",
      experiencia: "Mais de 5 anos de experiência em nutrição clínica. Especializada em consultoria nutricional, planos alimentares personalizados, educação alimentar e acompanhamento nutricional para toda a família.",
      portfolio: [
        { id: 'p1', name: 'Consulta Nutricional', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Plano Alimentar', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: false, domingo: false
      },
      raioAtendimento: '25',
      certificacoes: [
        { nome: 'Nutrição', instituicao: 'USP', ano: '2019' },
        { nome: 'Nutrição Clínica', instituicao: 'CRN-SP', ano: '2020' }
      ],
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 56
    }
  },
  {
    id: 16,
    nome: "André Oliveira",
    email: "andre@email.com",
    foto_url: "https://randomuser.me/api/portraits/men/39.jpg",
    endereco: {
      cidade: "Sorocaba",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Eventos", "Transporte"],
      descricao: "DJ profissional especializado em eventos sociais, casamentos e festas corporativas. Equipamentos de som e iluminação de alta qualidade.",
      experiencia: "Mais de 6 anos de experiência como DJ profissional. Especializado em eventos sociais, casamentos, festas corporativas e eventos privados. Equipamentos de som e iluminação de última geração.",
      portfolio: [
        { id: 'p1', name: 'Evento de Casamento', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Festa Corporativa', url: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: false, terca: false, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true
      },
      raioAtendimento: '80',
      certificacoes: [
        { nome: 'DJ Profissional', instituicao: 'Escola de DJ', ano: '2018' },
        { nome: 'Sonorização', instituicao: 'Audio Academy', ano: '2019' }
      ],
      avaliacaoMedia: 4.9,
      totalAvaliacoes: 84
    }
  },
  {
    id: 17,
    nome: "Mariana Alves",
    email: "mariana@email.com",
    foto_url: "https://randomuser.me/api/portraits/women/30.jpg",
    endereco: {
      cidade: "Capivari",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Beleza e Estética", "Saúde e Bem-estar"],
      descricao: "Cabeleireira e maquiadora profissional com especialização em cortes modernos, coloração e maquiagem para eventos especiais.",
      experiencia: "Mais de 7 anos de experiência em beleza e estética. Especializada em cortes modernos, coloração, escova, hidratação e maquiagem para eventos especiais, noivas e ensaios fotográficos.",
      portfolio: [
        { id: 'p1', name: 'Corte e Escova', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Maquiagem para Evento', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: false, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true
      },
      raioAtendimento: '20',
      certificacoes: [
        { nome: 'Cabeleireiro', instituicao: 'Senac', ano: '2017' },
        { nome: 'Maquiagem Profissional', instituicao: 'Escola de Beleza', ano: '2018' }
      ],
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 91
    }
  },
  {
    id: 18,
    nome: "Thiago Rodrigues",
    email: "thiago@email.com",
    foto_url: "https://randomuser.me/api/portraits/men/40.jpg",
    endereco: {
      cidade: "Piracicaba",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Saúde e Bem-estar", "Aulas Particulares"],
      descricao: "Personal trainer especializado em treinos funcionais, musculação e condicionamento físico. Atendimento domiciliar e em academias.",
      experiencia: "Mais de 5 anos de experiência como personal trainer. Especializado em treinos funcionais, musculação, condicionamento físico e reabilitação. Atendimento domiciliar e em academias com equipamentos portáteis.",
      portfolio: [
        { id: 'p1', name: 'Treino Funcional', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Musculação', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false
      },
      raioAtendimento: '30',
      certificacoes: [
        { nome: 'Personal Trainer', instituicao: 'CREF-SP', ano: '2019' },
        { nome: 'Treino Funcional', instituicao: 'CrossFit', ano: '2020' }
      ],
      avaliacaoMedia: 4.7,
      totalAvaliacoes: 47
    }
  },
  {
    id: 19,
    nome: "Vanessa Lima",
    email: "vanessa@email.com",
    foto_url: "https://randomuser.me/api/portraits/women/31.jpg",
    endereco: {
      cidade: "Itu",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Aulas Particulares", "Saúde e Bem-estar"],
      descricao: "Psicóloga especializada em terapia cognitivo-comportamental e atendimento psicológico para crianças, adolescentes e adultos.",
      experiencia: "Mais de 6 anos de experiência em psicologia clínica. Especializada em terapia cognitivo-comportamental, atendimento psicológico para crianças, adolescentes e adultos. Atendimento presencial e online.",
      portfolio: [
        { id: 'p1', name: 'Sessão de Terapia', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Terapia Infantil', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: false, domingo: false
      },
      raioAtendimento: '25',
      certificacoes: [
        { nome: 'Psicologia', instituicao: 'PUC-SP', ano: '2018' },
        { nome: 'TCC', instituicao: 'Instituto TCC', ano: '2019' }
      ],
      avaliacaoMedia: 4.9,
      totalAvaliacoes: 68
    }
  },
  {
    id: 20,
    nome: "Gabriel Silva",
    email: "gabriel@email.com",
    foto_url: "https://randomuser.me/api/portraits/men/41.jpg",
    endereco: {
      cidade: "Sorocaba",
      estado: "SP"
    },
    isWorker: true,
    workerProfile: {
      categorias: ["Construção Civil", "Reparos e Manutenção"],
      descricao: "Eletricista especializado em instalações elétricas residenciais e comerciais, manutenção e reparos elétricos com segurança e garantia.",
      experiencia: "Mais de 8 anos de experiência em eletricidade. Especializado em instalações elétricas residenciais e comerciais, manutenção, reparos elétricos e automação residencial. Trabalho com segurança e garantia.",
      portfolio: [
        { id: 'p1', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p2', name: 'Manutenção Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p3', name: 'Automação Residencial', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }, 
        { id: 'p4', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p5', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p6', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p7', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p8', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p9', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p10', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p11', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p12', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p13', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p14', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p15', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
        { id: 'p16', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
      ],
      disponibilidade: {
        segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false
      },
      raioAtendimento: '35',
      certificacoes: [
        { nome: 'Eletricista', instituicao: 'Senai', ano: '2016' },
        { nome: 'NR-10', instituicao: 'SENAC', ano: '2017' }
      ],
      avaliacaoMedia: 4.8,
      totalAvaliacoes: 73
    }
  }
];