// Categorias principais do sistema
export const categorias = [
  {
    value: "design",
    label: "Design Gráfico",
    icon: "🎨",
    description: "Criação de identidade visual, logos, banners e materiais gráficos"
  },
  {
    value: "reparos",
    label: "Reparos e Manutenção",
    icon: "🔧",
    description: "Consertos domésticos, manutenção de equipamentos e pequenos reparos"
  },
  {
    value: "aulas",
    label: "Aulas Particulares",
    icon: "📚",
    description: "Reforço escolar, idiomas, música e outras disciplinas"
  },
  {
    value: "tecnologia",
    label: "Tecnologia",
    icon: "💻",
    description: "Suporte técnico, desenvolvimento de software e soluções digitais"
  },
  {
    value: "construcao",
    label: "Construção Civil",
    icon: "🏗️",
    description: "Reformas, construção e serviços de pedreiro"
  },
  {
    value: "limpeza",
    label: "Limpeza",
    icon: "🧹",
    description: "Limpeza residencial, comercial e pós-obra"
  },
  {
    value: "organizacao",
    label: "Organização",
    icon: "📦",
    description: "Organização de ambientes, mudanças e decluttering"
  },
  {
    value: "culinaria",
    label: "Culinária",
    icon: "👨‍🍳",
    description: "Serviços de cozinha, eventos e aulas de culinária"
  },
  {
    value: "beleza",
    label: "Beleza e Estética",
    icon: "💄",
    description: "Cabeleireiro, manicure, maquiagem e tratamentos estéticos"
  },
  {
    value: "saude",
    label: "Saúde e Bem-estar",
    icon: "🏥",
    description: "Cuidados de saúde, fisioterapia e bem-estar"
  },
  {
    value: "transporte",
    label: "Transporte",
    icon: "🚗",
    description: "Serviços de transporte, entregas e logística"
  },
  {
    value: "eventos",
    label: "Eventos",
    icon: "🎉",
    description: "Organização de festas, casamentos e eventos corporativos"
  },
  {
    value: "fotografia",
    label: "Fotografia",
    icon: "📸",
    description: "Ensaios fotográficos, eventos e serviços de fotografia"
  },
  {
    value: "marketing",
    label: "Marketing Digital",
    icon: "📱",
    description: "Gestão de redes sociais, publicidade e marketing online"
  },
  {
    value: "contabilidade",
    label: "Contabilidade",
    icon: "📊",
    description: "Serviços contábeis, abertura de empresas e consultoria fiscal"
  },
  {
    value: "juridico",
    label: "Serviços Jurídicos",
    icon: "⚖️",
    description: "Consultoria jurídica, documentação e serviços legais"
  }
];

// Função para obter todas as categorias
export const obterTodasCategorias = () => {
  return categorias;
};

// Função para obter categoria por valor
export const obterCategoriaPorValor = (valor) => {
  return categorias.find(categoria => categoria.value === valor);
};

// Função para obter categorias por texto de busca
export const buscarCategorias = (texto) => {
  const textoLower = texto.toLowerCase();
  return categorias.filter(categoria => 
    categoria.label.toLowerCase().includes(textoLower) ||
    categoria.description.toLowerCase().includes(textoLower)
  );
};

// Função para obter opções de categoria para selects
export const obterOpcoesCategoria = (incluirTodas = false) => {
  const opcoes = categorias.map(categoria => ({
    value: categoria.value,
    label: categoria.label
  }));
  
  if (incluirTodas) {
    return [{ value: "", label: "Todas as categorias" }, ...opcoes];
  }
  
  return opcoes;
};

// Função para obter opções de categoria com ícones
export const obterOpcoesCategoriaComIcones = (incluirTodas = false) => {
  const opcoes = categorias.map(categoria => ({
    value: categoria.value,
    label: `${categoria.icon} ${categoria.label}`
  }));
  
  if (incluirTodas) {
    return [{ value: "", label: "Todas as categorias" }, ...opcoes];
  }
  
  return opcoes;
};

// Função para validar se uma categoria existe
export const validarCategoria = (valor) => {
  return categorias.some(categoria => categoria.value === valor);
};

// Função para obter categorias mais populares (baseado em uso comum)
export const obterCategoriasPopulares = () => {
  const populares = [
    "limpeza",
    "reparos", 
    "beleza",
    "aulas",
    "tecnologia",
    "construcao"
  ];
  
  return categorias.filter(categoria => 
    populares.includes(categoria.value)
  );
};

// Função para obter estatísticas de categorias (para futuras implementações)
export const obterEstatisticasCategorias = () => {
  return {
    total: categorias.length,
    categorias: categorias.map(categoria => ({
      ...categoria,
      // Aqui podem ser adicionadas estatísticas como:
      // totalServicos: 0,
      // totalProfissionais: 0,
      // mediaAvaliacao: 0
    }))
  };
};
