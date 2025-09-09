import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import perfilSemFoto from "../../assets/perfil_sem_foto.png";
import { FiMapPin, FiUser, FiMessageCircle, FiCheckCircle, FiClock, FiAward, FiEye } from "react-icons/fi";
import { FaStar, FaBriefcase } from "react-icons/fa";
import SearchBar from "../../components/ui/SearchBar";
import FilterSelect from "../../components/ui/FilterSelect";
import Button from "../../components/ui/Button";
import { useNotification } from "../../context/NotificationContext";

export default function ProfissionaisPage() {
  const { success } = useNotification();
  const { usuario } = useAuth();
  const [selecionado, setSelecionado] = useState(null);
  const [listProfissionais, setProfissionais] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtros, setFiltros] = useState({
    categoria: "",
    localizacao: "",
    avaliacao: ""
  });
  const [loading, setLoading] = useState(false);
  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [selectedPortfolioImage, setSelectedPortfolioImage] = useState(null);

  // Mock de profissionais baseado nos dados do formulário de trabalhador
  const profissionaisMock = useMemo(() => [
    {
      id: 1,
      nome: "Maria Silva",
      email: "maria@email.com",
      foto_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
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
        certificacoes: [{ nome: 'Curso de Limpeza Profissional', instituicao: 'Clean Academy', ano: '2022' }],
        avaliacaoMedia: 4.8,
        totalAvaliacoes: 24
      }
    },
    {
      id: 2,
      nome: "João Santos",
      email: "joao@email.com",
      foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: {
        cidade: "Capivari",
        estado: "SP"
      },
      isWorker: true,
      workerProfile: {
        categorias: ["Reparos e Manutenção", "Construção Civil"],
        descricao: "Eletricista e pedreiro experiente com mais de 5 anos de atuação. Especializado em reparos domésticos e pequenas reformas.",
        experiencia: "5+ anos de experiência em elétrica residencial, alvenaria, pintura e pequenos reparos. Trabalho com qualidade e pontualidade garantidas.",
        portfolio: [
          { id: 'p1', name: 'Instalação Elétrica', url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
          { id: 'p2', name: 'Reforma de Banheiro', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: {
          segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false
        },
        raioAtendimento: '15',
        certificacoes: [
          { nome: 'Curso de Eletricista', instituicao: 'SENAI', ano: '2020' },
          { nome: 'NR-10', instituicao: 'Instituto de Segurança', ano: '2021' }
        ],
        avaliacaoMedia: 4.9,
        totalAvaliacoes: 47
      }
    },
    {
      id: 3,
      nome: "Ana Costa",
      email: "ana@email.com",
      foto_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: {
        cidade: "Capivari",
        estado: "SP"
      },
      isWorker: true,
      workerProfile: {
        categorias: ["Beleza e Estética", "Saúde e Bem-estar"],
        descricao: "Cabeleireira e esteticista com 4 anos de experiência. Atendimento domiciliar com produtos de qualidade.",
        experiencia: "4 anos de experiência em cortes, coloração, escova e tratamentos capilares. Especializada em cabelos cacheados e crespos.",
        portfolio: [
          { id: 'p1', name: 'Corte e Escova', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
          { id: 'p2', name: 'Coloração', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: {
          segunda: false, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true
        },
        raioAtendimento: '25',
        certificacoes: [
          { nome: 'Curso de Cabeleireiro', instituicao: 'Academia de Beleza', ano: '2020' }
        ],
        avaliacaoMedia: 4.7,
        totalAvaliacoes: 32
      }
    },
    {
      id: 4,
      nome: "Carlos Mendes",
      email: "carlos@email.com",
      foto_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: {
        cidade: "Capivari",
        estado: "SP"
      },
      isWorker: true,
      workerProfile: {
        categorias: ["Tecnologia", "Marketing Digital"],
        descricao: "Desenvolvedor web e especialista em marketing digital. Criação de sites e gestão de redes sociais para pequenos negócios.",
        experiencia: "6 anos de experiência em desenvolvimento web com React, Node.js e marketing digital. Especializado em e-commerce e landing pages.",
        portfolio: [
          { id: 'p1', name: 'Site E-commerce', url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
          { id: 'p2', name: 'Landing Page', url: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: {
          segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: false, domingo: false
        },
        raioAtendimento: '30',
        certificacoes: [
          { nome: 'Desenvolvimento Web', instituicao: 'Rocketseat', ano: '2021' },
          { nome: 'Marketing Digital', instituicao: 'Google', ano: '2022' }
        ],
        avaliacaoMedia: 4.8,
        totalAvaliacoes: 18
      }
    },
    {
      id: 5,
      nome: "Pedro Oliveira",
      email: "pedro@email.com",
      foto_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Aulas Particulares", "Tecnologia"],
        descricao: "Professor de programação e matemática com 8 anos de experiência. Aulas presenciais e online para todos os níveis.",
        experiencia: "8 anos ensinando programação, matemática e física. Especializado em Python, JavaScript e preparação para vestibulares.",
        portfolio: [
          { id: 'p1', name: 'Aula de Programação', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false },
        raioAtendimento: '25',
        certificacoes: [{ nome: 'Licenciatura em Matemática', instituicao: 'UNICAMP', ano: '2016' }],
        avaliacaoMedia: 4.9,
        totalAvaliacoes: 67
      }
    },
    {
      id: 6,
      nome: "Lucia Fernandes",
      email: "lucia@email.com",
      foto_url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Culinária", "Eventos"],
        descricao: "Chef de cozinha especializada em eventos e jantares personalizados. Cardápios sob medida para ocasiões especiais.",
        experiencia: "10 anos de experiência em gastronomia. Especializada em culinária italiana, francesa e brasileira contemporânea.",
        portfolio: [
          { id: 'p1', name: 'Jantar Italiano', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: false, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true },
        raioAtendimento: '30',
        certificacoes: [{ nome: 'Curso de Gastronomia', instituicao: 'Le Cordon Bleu', ano: '2014' }],
        avaliacaoMedia: 4.9,
        totalAvaliacoes: 89
      }
    },
    {
      id: 7,
      nome: "Roberto Silva",
      email: "roberto@email.com",
      foto_url: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Transporte", "Eventos"],
        descricao: "Motorista particular e transporte para eventos. Carro confortável e seguro para qualquer ocasião.",
        experiencia: "12 anos como motorista particular. Experiência em eventos corporativos, casamentos e transporte executivo.",
        portfolio: [
          { id: 'p1', name: 'Transporte Executivo', url: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true },
        raioAtendimento: '50',
        certificacoes: [{ nome: 'CNH D', instituicao: 'DETRAN', ano: '2012' }],
        avaliacaoMedia: 4.8,
        totalAvaliacoes: 156
      }
    },
    {
      id: 8,
      nome: "Fernanda Costa",
      email: "fernanda@email.com",
      foto_url: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Fotografia", "Eventos"],
        descricao: "Fotógrafa especializada em eventos, ensaios e casamentos. Estilo natural e emocional com tratamento profissional.",
        experiencia: "6 anos de experiência em fotografia. Especializada em eventos sociais, ensaios de gestante e fotografia de família.",
        portfolio: [
          { id: 'p1', name: 'Ensaio de Casal', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
          { id: 'p2', name: 'Casamento', url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: false, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true },
        raioAtendimento: '40',
        certificacoes: [{ nome: 'Curso de Fotografia', instituicao: 'Escola de Fotografia', ano: '2018' }],
        avaliacaoMedia: 4.9,
        totalAvaliacoes: 73
      }
    },
    {
      id: 9,
      nome: "Marcos Pereira",
      email: "marcos@email.com",
      foto_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Saúde e Bem-estar", "Aulas Particulares"],
        descricao: "Personal trainer e instrutor de yoga. Aulas personalizadas para todos os níveis e objetivos.",
        experiencia: "7 anos como personal trainer. Especializado em treinamento funcional, yoga e pilates. Certificado em primeiros socorros.",
        portfolio: [
          { id: 'p1', name: 'Treino Funcional', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false },
        raioAtendimento: '20',
        certificacoes: [
          { nome: 'Personal Trainer', instituicao: 'CREF', ano: '2017' },
          { nome: 'Instrutor de Yoga', instituicao: 'Escola de Yoga', ano: '2019' }
        ],
        avaliacaoMedia: 4.8,
        totalAvaliacoes: 45
      }
    },
    {
      id: 10,
      nome: "Patricia Lima",
      email: "patricia@email.com",
      foto_url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Contabilidade", "Jurídico"],
        descricao: "Contadora especializada em MEI e pequenas empresas. Abertura de empresas, impostos e consultoria financeira.",
        experiencia: "9 anos de experiência contábil. Especializada em MEI, Simples Nacional e consultoria para pequenos negócios.",
        portfolio: [
          { id: 'p1', name: 'Consultoria Contábil', url: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: false, domingo: false },
        raioAtendimento: '15',
        certificacoes: [{ nome: 'CRC Ativo', instituicao: 'CRC-SP', ano: '2015' }],
        avaliacaoMedia: 4.7,
        totalAvaliacoes: 38
      }
    },
    {
      id: 11,
      nome: "Diego Santos",
      email: "diego@email.com",
      foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Design Gráfico", "Marketing Digital"],
        descricao: "Designer gráfico e especialista em identidade visual. Criação de logos, materiais gráficos e gestão de redes sociais.",
        experiencia: "5 anos de experiência em design. Especializado em identidade visual, materiais gráficos e gestão de redes sociais para pequenos negócios.",
        portfolio: [
          { id: 'p1', name: 'Identidade Visual', url: 'https://images.unsplash.com/photo-1558655146-d09347e92766?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' },
          { id: 'p2', name: 'Material Gráfico', url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: false, domingo: false },
        raioAtendimento: '25',
        certificacoes: [{ nome: 'Design Gráfico', instituicao: 'SENAC', ano: '2019' }],
        avaliacaoMedia: 4.6,
        totalAvaliacoes: 29
      }
    },
    {
      id: 12,
      nome: "Camila Rodrigues",
      email: "camila@email.com",
      foto_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Saúde e Bem-estar", "Aulas Particulares"],
        descricao: "Nutricionista especializada em emagrecimento e ganho de massa muscular. Consultas domiciliares e planos personalizados.",
        experiencia: "6 anos de experiência em nutrição clínica. Especializada em emagrecimento, ganho de massa e nutrição esportiva.",
        portfolio: [
          { id: 'p1', name: 'Consulta Nutricional', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false },
        raioAtendimento: '20',
        certificacoes: [{ nome: 'CRN Ativo', instituicao: 'CRN-3', ano: '2018' }],
        avaliacaoMedia: 4.8,
        totalAvaliacoes: 52
      }
    },
    {
      id: 13,
      nome: "Rafael Almeida",
      email: "rafael@email.com",
      foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Reparos e Manutenção", "Construção Civil"],
        descricao: "Encanador especializado em vazamentos e desentupimentos. Atendimento 24h para emergências.",
        experiencia: "8 anos de experiência em hidráulica. Especializado em vazamentos, desentupimentos e instalações hidráulicas.",
        portfolio: [
          { id: 'p1', name: 'Reparo de Vazamento', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true },
        raioAtendimento: '30',
        certificacoes: [{ nome: 'Curso de Hidráulica', instituicao: 'SENAI', ano: '2016' }],
        avaliacaoMedia: 4.7,
        totalAvaliacoes: 41
      }
    },
    {
      id: 14,
      nome: "Juliana Ferreira",
      email: "juliana@email.com",
      foto_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Beleza e Estética", "Saúde e Bem-estar"],
        descricao: "Esteticista especializada em tratamentos faciais e corporais. Atendimento domiciliar com produtos de qualidade.",
        experiencia: "4 anos de experiência em estética. Especializada em limpeza de pele, drenagem linfática e tratamentos anti-idade.",
        portfolio: [
          { id: 'p1', name: 'Tratamento Facial', url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: false, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true },
        raioAtendimento: '25',
        certificacoes: [{ nome: 'Curso de Estética', instituicao: 'Escola de Estética', ano: '2020' }],
        avaliacaoMedia: 4.9,
        totalAvaliacoes: 36
      }
    },
    {
      id: 15,
      nome: "Thiago Martins",
      email: "thiago@email.com",
      foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Construção Civil", "Reparos e Manutenção"],
        descricao: "Pedreiro especializado em reformas e acabamentos. Trabalho com qualidade e pontualidade garantidas.",
        experiencia: "10 anos de experiência em alvenaria e acabamentos. Especializado em reformas residenciais e comerciais.",
        portfolio: [
          { id: 'p1', name: 'Reforma de Cozinha', url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false },
        raioAtendimento: '25',
        certificacoes: [{ nome: 'Curso de Pedreiro', instituicao: 'SENAI', ano: '2014' }],
        avaliacaoMedia: 4.8,
        totalAvaliacoes: 58
      }
    },
    {
      id: 16,
      nome: "Larissa Souza",
      email: "larissa@email.com",
      foto_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Aulas Particulares", "Saúde e Bem-estar"],
        descricao: "Professora de inglês e psicóloga. Aulas de idioma e consultas psicológicas domiciliares.",
        experiencia: "7 anos de experiência em ensino de inglês e 5 anos em psicologia clínica. Especializada em ansiedade e depressão.",
        portfolio: [
          { id: 'p1', name: 'Aula de Inglês', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false },
        raioAtendimento: '20',
        certificacoes: [
          { nome: 'CRP Ativo', instituicao: 'CRP-SP', ano: '2019' },
          { nome: 'Certificação em Inglês', instituicao: 'Cambridge', ano: '2017' }
        ],
        avaliacaoMedia: 4.9,
        totalAvaliacoes: 42
      }
    },
    {
      id: 17,
      nome: "Gabriel Costa",
      email: "gabriel@email.com",
      foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Tecnologia", "Reparos e Manutenção"],
        descricao: "Técnico em informática especializado em manutenção de computadores e redes. Atendimento domiciliar e empresarial.",
        experiencia: "6 anos de experiência em TI. Especializado em manutenção de computadores, redes e suporte técnico.",
        portfolio: [
          { id: 'p1', name: 'Manutenção de PC', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true },
        raioAtendimento: '30',
        certificacoes: [{ nome: 'Técnico em Informática', instituicao: 'SENAC', ano: '2018' }],
        avaliacaoMedia: 4.7,
        totalAvaliacoes: 34
      }
    },
    {
      id: 18,
      nome: "Beatriz Oliveira",
      email: "beatriz@email.com",
      foto_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Beleza e Estética", "Eventos"],
        descricao: "Maquiadora especializada em eventos e noivas. Maquiagem artística e social com produtos de alta qualidade.",
        experiencia: "5 anos de experiência em maquiagem. Especializada em maquiagem para noivas, eventos e ensaios fotográficos.",
        portfolio: [
          { id: 'p1', name: 'Maquiagem de Noiva', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: false, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true },
        raioAtendimento: '35',
        certificacoes: [{ nome: 'Curso de Maquiagem', instituicao: 'Escola de Beleza', ano: '2019' }],
        avaliacaoMedia: 4.8,
        totalAvaliacoes: 47
      }
    },
    {
      id: 19,
      nome: "André Silva",
      email: "andre@email.com",
      foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Aulas Particulares", "Tecnologia"],
        descricao: "Professor de música e técnico em áudio. Aulas de violão, guitarra e produção musical.",
        experiencia: "8 anos de experiência musical. Especializado em violão, guitarra e produção de áudio para eventos.",
        portfolio: [
          { id: 'p1', name: 'Aula de Violão', url: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true },
        raioAtendimento: '25',
        certificacoes: [{ nome: 'Curso de Música', instituicao: 'Conservatório', ano: '2016' }],
        avaliacaoMedia: 4.9,
        totalAvaliacoes: 61
      }
    },
    {
      id: 20,
      nome: "Mariana Santos",
      email: "mariana@email.com",
      foto_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Saúde e Bem-estar", "Aulas Particulares"],
        descricao: "Fisioterapeuta especializada em reabilitação e pilates. Atendimento domiciliar e aulas de pilates.",
        experiencia: "6 anos de experiência em fisioterapia. Especializada em reabilitação ortopédica e pilates terapêutico.",
        portfolio: [
          { id: 'p1', name: 'Sessão de Fisioterapia', url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false },
        raioAtendimento: '20',
        certificacoes: [{ nome: 'CREFITO Ativo', instituicao: 'CREFITO-3', ano: '2018' }],
        avaliacaoMedia: 4.8,
        totalAvaliacoes: 39
      }
    },
    {
      id: 21,
      nome: "Felipe Rodrigues",
      email: "felipe@email.com",
      foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Eventos", "Transporte"],
        descricao: "DJ e sonorização para eventos. Equipamentos profissionais e playlist personalizada para cada ocasião.",
        experiencia: "4 anos de experiência como DJ. Especializado em eventos corporativos, casamentos e festas particulares.",
        portfolio: [
          { id: 'p1', name: 'Evento Corporativo', url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: false, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true },
        raioAtendimento: '40',
        certificacoes: [{ nome: 'Curso de DJ', instituicao: 'Escola de DJ', ano: '2020' }],
        avaliacaoMedia: 4.7,
        totalAvaliacoes: 28
      }
    },
    {
      id: 22,
      nome: "Isabela Ferreira",
      email: "isabela@email.com",
      foto_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Aulas Particulares", "Saúde e Bem-estar"],
        descricao: "Professora de português e redação. Preparação para vestibulares e concursos públicos.",
        experiencia: "9 anos de experiência em ensino. Especializada em redação, literatura e preparação para vestibulares.",
        portfolio: [
          { id: 'p1', name: 'Aula de Redação', url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false },
        raioAtendimento: '25',
        certificacoes: [{ nome: 'Licenciatura em Letras', instituicao: 'USP', ano: '2015' }],
        avaliacaoMedia: 4.9,
        totalAvaliacoes: 73
      }
    },
    {
      id: 23,
      nome: "Bruno Alves",
      email: "bruno@email.com",
      foto_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Construção Civil", "Reparos e Manutenção"],
        descricao: "Pintor especializado em acabamentos finos e pintura decorativa. Trabalho com qualidade e limpeza.",
        experiencia: "7 anos de experiência em pintura. Especializado em acabamentos finos, pintura decorativa e texturas.",
        portfolio: [
          { id: 'p1', name: 'Pintura Decorativa', url: 'https://images.unsplash.com/photo-1581578731548-adabf4c593e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: true, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: false },
        raioAtendimento: '30',
        certificacoes: [{ nome: 'Curso de Pintura', instituicao: 'SENAI', ano: '2017' }],
        avaliacaoMedia: 4.8,
        totalAvaliacoes: 44
      }
    },
    {
      id: 24,
      nome: "Vanessa Lima",
      email: "vanessa@email.com",
      foto_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80",
      endereco: { cidade: "Capivari", estado: "SP" },
      isWorker: true,
      workerProfile: {
        categorias: ["Beleza e Estética", "Saúde e Bem-estar"],
        descricao: "Manicure e pedicure especializada em unhas artísticas. Atendimento domiciliar com produtos de qualidade.",
        experiencia: "5 anos de experiência em manicure e pedicure. Especializada em unhas artísticas, alongamento e cuidados especiais.",
        portfolio: [
          { id: 'p1', name: 'Unhas Artísticas', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=400&q=80' }
        ],
        disponibilidade: { segunda: false, terca: true, quarta: true, quinta: true, sexta: true, sabado: true, domingo: true },
        raioAtendimento: '20',
        certificacoes: [{ nome: 'Curso de Manicure', instituicao: 'Escola de Beleza', ano: '2019' }],
        avaliacaoMedia: 4.9,
        totalAvaliacoes: 56
      }
    }
  ], []);

  // Opções para os filtros baseadas nas categorias do formulário
  const opcoesCategoria = useMemo(() => [
    { value: "", label: "Todas as categorias" },
    { value: "design", label: "Design Gráfico" },
    { value: "reparos", label: "Reparos e Manutenção" },
    { value: "aulas", label: "Aulas Particulares" },
    { value: "tecnologia", label: "Tecnologia" },
    { value: "construcao", label: "Construção Civil" },
    { value: "limpeza", label: "Limpeza" },
    { value: "culinaria", label: "Culinária" },
    { value: "beleza", label: "Beleza e Estética" },
    { value: "saude", label: "Saúde e Bem-estar" },
    { value: "transporte", label: "Transporte" },
    { value: "eventos", label: "Eventos" },
    { value: "fotografia", label: "Fotografia" },
    { value: "marketing", label: "Marketing Digital" },
    { value: "contabilidade", label: "Contabilidade" },
    { value: "juridico", label: "Serviços Jurídicos" }
  ], []);

  const opcoesLocalizacao = useMemo(() => [
    { value: "", label: "Todas as localizações" },
    { value: "capivari", label: "Capivari" },
    { value: "piracicaba", label: "Piracicaba" },
    { value: "itu", label: "Itu" },
    { value: "sorocaba", label: "Sorocaba" }
  ], []);

  const opcoesAvaliacao = useMemo(() => [
    { value: "", label: "Todas as avaliações" },
    { value: "4", label: "⭐ 4.0+" },
    { value: "4.5", label: "⭐ 4.5+" },
    { value: "5", label: "⭐ 5.0" }
  ], []);

  // Filtrar profissionais
  const profissionaisFiltrados = useMemo(() => {
    return profissionaisMock.filter(profissional => {
      if (!profissional.isWorker || !profissional.workerProfile) return false;

      const matchSearch = !searchQuery || 
        profissional.nome.toLowerCase().includes(searchQuery.toLowerCase()) ||
        profissional.workerProfile.categorias.some(cat => 
          cat.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        profissional.workerProfile.descricao.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchCategoria = !filtros.categoria || 
        profissional.workerProfile.categorias.some(cat => 
          cat.toLowerCase().includes(filtros.categoria.toLowerCase())
        );
      
      const matchLocalizacao = !filtros.localizacao || 
        profissional.endereco.cidade.toLowerCase().includes(filtros.localizacao.toLowerCase());
      
      const matchAvaliacao = !filtros.avaliacao || 
        profissional.workerProfile.avaliacaoMedia >= parseFloat(filtros.avaliacao);
      
      return matchSearch && matchCategoria && matchLocalizacao && matchAvaliacao;
    });
  }, [searchQuery, filtros, profissionaisMock]);

  useEffect(() => {
    setProfissionais(profissionaisFiltrados);
    if (profissionaisFiltrados.length > 0 && !selecionado) {
      setSelecionado(profissionaisFiltrados[0]);
    }
  }, [profissionaisFiltrados, selecionado]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
  }, []);

  const handleFilterChange = useCallback((name, value) => {
    setFiltros(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleContratar = useCallback(async (profissional) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      success(`Solicitação enviada para ${profissional.nome}!`);
    } catch (error) {
      console.error("Erro ao contratar:", error);
    } finally {
      setLoading(false);
    }
  }, [success]);

  const handleMensagem = useCallback((profissional) => {
    success(`Redirecionando para conversa com ${profissional.nome}...`);
  }, [success]);

  // Função para obter dias de disponibilidade formatados
  const getDisponibilidadeText = useCallback((disponibilidade) => {
    if (!disponibilidade) return "Não definido";
    
    const dias = {
      segunda: "Seg",
      terca: "Ter", 
      quarta: "Qua",
      quinta: "Qui",
      sexta: "Sex",
      sabado: "Sáb",
      domingo: "Dom"
    };
    
    const diasSelecionados = Object.entries(disponibilidade)
      .filter(([_, selected]) => selected)
      .map(([dia, _]) => dias[dia]);
    
    return diasSelecionados.length > 0 ? diasSelecionados.join(", ") : "Não definido";
  }, []);

  // Função para abrir modal do portfólio
  const handlePortfolioImageClick = useCallback((image) => {
    setSelectedPortfolioImage(image);
    setShowPortfolioModal(true);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header com busca e filtros */}
      <div className="bg-white shadow-lg p-6 border-b flex-shrink-0">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="w-full lg:w-96">
            <SearchBar
              onSearch={handleSearch}
              placeholder="Buscar por nome, categoria ou descrição..."
              className="w-full"
            />
          </div>
          
          <div className="flex flex-wrap gap-3 items-center">
            <FilterSelect
              label="Categoria"
              name="categoria"
              value={filtros.categoria}
              onChange={(e) => handleFilterChange('categoria', e.target.value)}
              options={opcoesCategoria}
              placeholder="Todas as categorias"
              className="min-w-[150px]"
            />
            
            <FilterSelect
              label="Localização"
              name="localizacao"
              value={filtros.localizacao}
              onChange={(e) => handleFilterChange('localizacao', e.target.value)}
              options={opcoesLocalizacao}
              placeholder="Todas as localizações"
              className="min-w-[150px]"
            />
            
            <FilterSelect
              label="Avaliação"
              name="avaliacao"
              value={filtros.avaliacao}
              onChange={(e) => handleFilterChange('avaliacao', e.target.value)}
              options={opcoesAvaliacao}
              placeholder="Todas as avaliações"
              className="min-w-[150px]"
            />
          </div>
        </div>
        
        {/* Contador de resultados */}
        <div className="mt-4 text-sm text-gray-600">
          {profissionaisFiltrados.length} profissional(is) encontrado(s)
          {searchQuery && ` para "${searchQuery}"`}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Lista de Profissionais */}
        <aside className="w-1/3 border-r border-gray-200 overflow-y-auto bg-white">
          {listProfissionais.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <FiUser className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>Nenhum profissional encontrado</p>
              <p className="text-sm">Tente ajustar os filtros de busca</p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {listProfissionais.map((profissional) => (
                <div
                  key={profissional.id}
                  onClick={() => setSelecionado(profissional)}
                  className={`
                    flex bg-white p-4 rounded-xl shadow-sm cursor-pointer 
                    transition-all duration-200 hover:shadow-md hover:scale-[1.02]
                    ${selecionado?.id === profissional.id 
                      ? "ring-2 ring-[#19506e] bg-blue-50" 
                      : "hover:bg-gray-50"
                    }
                  `}
                >
                  <div className="mr-3">
                    <img
                      src={profissional.foto_url || perfilSemFoto}
                      alt={profissional.nome}
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="text-lg font-bold text-gray-900 truncate">
                        {profissional.nome}
                      </h3>
                      <div className="flex items-center gap-1 ml-2">
                        <FaStar className="text-yellow-400 w-4 h-4" />
                        <span className="text-sm font-medium text-gray-700">
                          {profissional.workerProfile.avaliacaoMedia}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <FaBriefcase className="text-gray-400 w-4 h-4" />
                      <span className="text-sm text-gray-600 truncate">
                        {profissional.workerProfile.categorias.join(", ")}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mt-1">
                      <FiMapPin className="text-gray-400 w-4 h-4" />
                      <span className="text-sm text-gray-600 truncate">
                        {profissional.endereco.cidade}, {profissional.endereco.estado}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </aside>

        {/* Detalhes do Profissional */}
        <main className="flex-1 p-6 overflow-y-auto">
          {selecionado ? (
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-shrink-0">
                  <img 
                    src={selecionado.foto_url || perfilSemFoto} 
                    alt={selecionado.nome} 
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-200" 
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        {selecionado.nome}
                      </h2>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selecionado.workerProfile.categorias.map((categoria, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-[#19506e] text-white text-sm rounded-full"
                          >
                            {categoria}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-lg">
                      <FaStar className="text-yellow-400 w-5 h-5" />
                      <span className="text-lg font-bold text-gray-900">
                        {selecionado.workerProfile.avaliacaoMedia}
                      </span>
                      <span className="text-sm text-gray-600">
                        ({selecionado.workerProfile.totalAvaliacoes} avaliações)
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiMapPin className="w-5 h-5" />
                      <span>{selecionado.endereco.cidade}, {selecionado.endereco.estado}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <FiClock className="w-5 h-5" />
                      <span>Atende em {selecionado.workerProfile.raioAtendimento}km</span>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Sobre</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selecionado.workerProfile.descricao}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Experiência</h3>
                    <p className="text-gray-700 leading-relaxed">
                      {selecionado.workerProfile.experiencia}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Disponibilidade</h3>
                    <p className="text-gray-700">
                      {getDisponibilidadeText(selecionado.workerProfile.disponibilidade)}
                    </p>
                  </div>

                  {/* Certificações */}
                  {selecionado.workerProfile.certificacoes?.length > 0 && (
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Certificações</h3>
                      <div className="space-y-2">
                        {selecionado.workerProfile.certificacoes.map((cert, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-sm text-gray-900">{cert.nome}</p>
                            <p className="text-xs text-gray-600">{cert.instituicao} - {cert.ano}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Portfólio */}
                  {selecionado.workerProfile.portfolio?.length > 0 && (
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Portfólio</h3>
                      <div className="grid grid-cols-3 gap-3">
                        {selecionado.workerProfile.portfolio.slice(0, 6).map((item, index) => (
                          <div 
                            key={index} 
                            className="aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition"
                            onClick={() => handlePortfolioImageClick(item)}
                          >
                            <img
                              src={item.url}
                              alt={item.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.src = perfilSemFoto;
                                e.target.alt = "Imagem não disponível";
                              }}
                            />
                          </div>
                        ))}
                      </div>
                      {selecionado.workerProfile.portfolio.length > 6 && (
                        <p className="text-xs text-gray-500 mt-2">
                          +{selecionado.workerProfile.portfolio.length - 6} imagens
                        </p>
                      )}
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      variant="outline"
                      onClick={() => handleMensagem(selecionado)}
                      className="flex items-center gap-2"
                    >
                      <FiMessageCircle className="w-5 h-5" />
                      Enviar Mensagem
                    </Button>
                    
                    <Button
                      onClick={() => handleContratar(selecionado)}
                      loading={loading}
                      disabled={loading}
                      className="flex items-center gap-2"
                    >
                      <FiCheckCircle className="w-5 h-5" />
                      Contratar Serviço
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <FiUser className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                <h3 className="text-xl font-semibold mb-2">Selecione um profissional</h3>
                <p>Escolha um profissional da lista para ver os detalhes</p>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Modal de visualização do portfólio */}
      {showPortfolioModal && selectedPortfolioImage && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
            onClick={() => setShowPortfolioModal(false)}
          />
          <div className="relative z-10 flex min-h-full items-center justify-center p-4">
            <div className="relative w-full max-w-4xl">
              <button
                onClick={() => setShowPortfolioModal(false)}
                className="absolute -top-3 -right-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/90 hover:bg-white shadow"
                aria-label="Fechar visualização"
              >
                <FiEye className="w-6 h-6 text-gray-700" />
              </button>
              <div className="bg-white rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  {selectedPortfolioImage.name}
                </h3>
                <img
                  src={selectedPortfolioImage.url}
                  alt={selectedPortfolioImage.name}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                  onError={(e) => {
                    e.target.src = perfilSemFoto;
                    e.target.alt = "Imagem não disponível";
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}