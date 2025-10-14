# Proconnect

**Proconnect** é uma plataforma web moderna para conectar profissionais autônomos com pessoas que precisam de serviços diversos. A aplicação facilita a busca, contratação e comunicação entre prestadores de serviços e clientes em um ambiente seguro e intuitivo.

## Sobre o Projeto

O sistema foi desenvolvido como uma solução completa para o mercado de serviços freelancer, oferecendo uma experiência fluida tanto para quem oferece serviços quanto para quem os contrata. A plataforma abrange diversas categorias de serviços.

## Tecnologias Utilizadas

### Frontend
- **React 19.0.0** - Biblioteca principal para interface de usuário
- **React Router DOM 7.6.0** - Roteamento e navegação
- **Tailwind CSS 4.1.4** - Framework CSS para estilização
- **React Icons 5.5.0** - Biblioteca de ícones
- **Vite 6.3.0** - Build tool e servidor de desenvolvimento

## Funcionalidades Principais

### Para Clientes
- **Busca Avançada**: Sistema de busca por categorias, localização e preço
- **Visualização de Perfis**: Acesso completo aos perfis dos profissionais
- **Sistema de Avaliações**: Visualização de avaliações e comentários
- **Chat Integrado**: Comunicação direta com prestadores de serviços
- **Histórico de Contratações**: Acompanhamento de serviços contratados

### Para Profissionais
- **Perfil Completo**: Criação e gerenciamento de perfil profissional
- **Portfolio**: Upload e organização de trabalhos realizados
- **Publicação de Serviços**: Anúncio de serviços com descrições
- **Gestão de Disponibilidade**: Controle de horários e dias de trabalho
- **Sistema de Notificações**: Alertas sobre novas mensagens e propostas

## Funcionalidades Técnicas

### Autenticação e Autorização
- Sistema de login e registro
- Verificação de email
- Gerenciamento de sessão com localStorage
- Rotas protegidas para área logada

### Interface Responsiva
- Design mobile-first
- Componentes adaptáveis para diferentes telas
- Menu mobile otimizado
- Carrossel responsivo para categorias

### Sistema de Notificações
- Notificações em tempo real
- Centro de notificações
- Toasts para feedback imediato
- Sistema de alertas contextual

### Gerenciamento de Estado
- Context API para autenticação
- Context API para notificações
- Hooks customizados para funcionalidades específicas
- Persistência de dados no localStorage

## Como Executar o Projeto

### Pré-requisitos
- Node.js (versão 18 ou superior)
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone [url-do-repositorio]

# Navegue para o diretório
cd proconnect

# Instale as dependências
npm install

# Execute o projeto em modo de desenvolvimento
npm run dev
```

## Desenvolvimento

### Padrões de Código
- Componentes funcionais com hooks
- Nomenclatura em português para variáveis de negócio
- Estrutura modular e reutilizável
- Separação clara de responsabilidades

### Hooks Customizados
- `useCarousel` - Gerenciamento de carrosséis
- `useDebounce` - Otimização de buscas
- `useLoading` - Controle de estados de carregamento
- `useSwipe` - Gestos de toque para mobile
- `useValidation` - Validação de formulários



---



