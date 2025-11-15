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
 
Recomendado: Git (para controlar versões) e um editor como VS Code.

## Configuração

1. Clone o repositório:
```bash
git clone https://github.com/JoaoVitorML-BR/ecopontos-backend.git
cd eco_arapiraca_backend_nest
```

2. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

conteudo das variaveis:

```
# Configurações do Banco de Dados MongoDB
DB_USER=admin
DB_PASS=12345
DB_NAME=eco_arapiraca

# Configurações da Aplicação
NODE_ENV=development
PORT=3001
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


A aplicação estará disponível em `http://localhost:3001`
O MongoDB estará disponível em `localhost:27017`

## Gerenciamento do Banco de Dados

Para acessar a interface web de administração do banco de dados MongoDB, utilize o mongo-express:

- Interface de administração: [`http://localhost:8090`](http://localhost:8090)

Por meio dessa interface, é possível visualizar, editar e gerenciar os dados do banco de forma prática pelo navegador.

> **Nota:** Se a porta 8090 estiver ocupada na sua máquina, você pode alterá-la no `docker-compose.yml` na linha `ports: - "8090:8081"`. Mude o primeiro número (8090) para outra porta livre, como 9090, 7000 ou 5555.

### Solução de Problemas Comuns

**Erro de autenticação no mongo-express após clonar o projeto:**

Se você clonou este projeto e está enfrentando erros como "Authentication failed" no mongo-express, siga estes passos:

1. Certifique-se que o arquivo `.env` está configurado corretamente com as credenciais:
   ```
   DB_USER=admin
   DB_PASS=12345
   DB_NAME=eco_arapiraca
   JWT_SECRET=eco_arapiraca_jwt_secret_2025_7x9k2m5n8q1w4e6r3t7y9u0i2o5p8a1s
   ```

2. Se o erro persistir, remova os volumes do Docker e recrie os containers:
   ```bash
   docker-compose down
   docker volume rm eco_arapiraca_backend_nest_mongo_data
   docker-compose up -d --build
   ```

**Erro 401 ao tentar acessar rotas protegidas:**

- Certifique-se que a variável `JWT_SECRET` está definida no arquivo `.env`
- Faça login com um usuário válido e use o token retornado no header `Authorization: Bearer <token>`
- Para acessar rotas administrativas (como `POST /auth/register-enterprise`), é necessário um token de usuário com `role: admin`

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

## Desenvolvimento local (sem Docker)

Se preferir rodar localmente sem Docker, instale o Node.js e o MongoDB localmente e execute:

```powershell
npm install
# configurar .env conforme descrito acima
npm run start:dev
```

O servidor em modo de desenvolvimento utiliza `nodemon` (ou `ts-node-dev`) conforme a configuração do `package.json`.

## Testes

O projeto usa Jest (via `ts-jest`) para testes unitários.

- Executar testes:

```powershell
npm test
```

- Executar cobertura e gerar relatório HTML:

```powershell
npm run test:cov

# Abra em um navegador o arquivo gerado:
# coverage/lcov-report/index.html
```

## Variáveis de ambiente (principais)

Exemplos / obrigatórias (algumas dependem das features que você for usar):

```env
# Mongo (opcional: forneça DB_USER/DB_PASS/DB_NAME ou MONGO_URI direto)
DB_USER=admin
DB_PASS=12345
DB_NAME=eco_arapiraca
# ou
MONGO_URI=mongodb://admin:12345@localhost:27017/eco_arapiraca?authSource=admin

# Aplicação
NODE_ENV=development
PORT=3001
JWT_SECRET=eco_arapiraca_jwt_secret_... (escolha algo seguro)

# Nodemailer (para enviar reclamações)
EMAIL_USER=seu-email@gmail.com
EMAIL_PASS=sua-senha-ou-app-password

# (Frontend) chave pública do Google Maps — usada no frontend Next.js
NEXT_PUBLIC_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
```

Nota sobre Gmail: se for usar Gmail para envio de e-mails, recomenda-se criar uma App Password (para contas com 2FA) ou configurar permissões adequadas — evitar usar a senha principal diretamente em produção.

## Observações sobre cobertura

Os testes atuais cobrem muitos serviços principais, mas alguns controllers e módulos de inicialização possuem 0% de cobertura — adicione testes focados em controllers/rotas para aumentar o percentual global de cobertura.

## Contribuição

1. Crie um branch para sua feature/fix:

```bash
git checkout -b feat/minha-nova-coisa
```

2. Faça commits pequenos e descritivos.
3. Abra um Pull Request no GitHub para revisão.

---

Se quiser, eu posso: gerar um relatório de cobertura para arquivos com 0%, adicionar testes para controllers com maior impacto (por exemplo `ecopoints.controller.ts`) ou suprimir logs durante os testes. Qual prefere que eu faça a seguir?

## Documentação Swagger

Esta aplicação possui documentação automática das rotas via Swagger.

Após subir o backend, acesse:

```
http://localhost:3001/api
```

Você poderá visualizar, testar e explorar todas as rotas da API diretamente pelo navegador.

Para adicionar/atualizar a documentação, utilize os decorators do NestJS Swagger (`@ApiTags`, `@ApiOperation`, `@ApiResponse`, etc.) nos controllers e DTOs.