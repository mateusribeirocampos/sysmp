# SYSMP - Frontend

Frontend do sistema de gerenciamento de documentos SYSMP, desenvolvido com React e Vite.

## Tecnologias Utilizadas

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios
- Headless UI
- Heroicons

## Pré-requisitos

- Node.js 16 ou superior
- npm ou yarn

## Instalação

1. Clone o repositório
2. Instale as dependências:

```bash
npm install
# ou
yarn install
```

## Desenvolvimento

Para iniciar o servidor de desenvolvimento:

```bash
npm run dev
# ou
yarn dev
```

O servidor estará disponível em `http://localhost:5173`

## Build

Para criar uma build de produção:

```bash
npm run build
# ou
yarn build
```

## Estrutura do Projeto

```tree
src/
  ├── components/     # Componentes reutilizáveis
  ├── contexts/      # Contextos do React
  ├── pages/         # Páginas da aplicação
  ├── services/      # Serviços e APIs
  ├── App.jsx        # Componente principal
  └── main.jsx       # Ponto de entrada
```

## Funcionalidades

- Autenticação de usuários
- Dashboard com estatísticas
- Gerenciamento de usuários
- Gerenciamento de documentos
- Upload e download de arquivos
- Interface responsiva

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
