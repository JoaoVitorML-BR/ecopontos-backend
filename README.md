# Eco Arapiraca Backend

Backend desenvolvido em NestJS para o projeto Eco Arapiraca.

## Tecnologias Utilizadas

- **NestJS** - Framework Node.js para construção de aplicações server-side eficientes e escaláveis
- **TypeScript** - Linguagem que adiciona tipagem estática ao JavaScript
- **MongoDB** - Banco de dados NoSQL
- **Mongoose** - ODM para MongoDB
- **Docker** - Containerização da aplicação

## Requisitos

- Docker e Docker Compose
- Node.js (versão 18 ou superior) - para desenvolvimento local
- npm ou yarn

## Configuração

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd eco_arapiraca_backend_nest
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

3. Edite o arquivo `.env` com suas configurações.

## Executando com Docker (Recomendado)

```bash
# Subir todos os serviços (MongoDB + API)
docker-compose up --build

# Executar em segundo plano
docker-compose up -d --build

# Ver logs
docker-compose logs -f api

# Parar os serviços
docker-compose down
```

A aplicação estará disponível em `http://localhost:3000`
O MongoDB estará disponível em `localhost:27017`

## Estrutura do Projeto

```
src/
├── app.controller.ts    # Controller principal
├── app.module.ts        # Módulo raiz da aplicação
├── app.service.ts       # Service principal
└── main.ts             # Ponto de entrada da aplicação
```

## Endpoints Disponíveis

- `GET /` - Mensagem de boas-vindas
- `GET /health` - Status de saúde da aplicação