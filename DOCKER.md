# 🐳 Docker Guide - Clean Architecture API

Este guia explica como usar Docker para desenvolvimento e produção da API.

## 📋 Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+
- Make (opcional, mas recomendado)

## 🚀 Quick Start

### Desenvolvimento
```bash
# Copiar variáveis de ambiente
cp .env.example .env

# Iniciar ambiente de desenvolvimento
make setup
# ou
npm run docker:up:dev
```

### Produção
```bash
# Copiar e configurar variáveis de ambiente
cp .env.example .env
# Editar .env com valores de produção

# Build e iniciar
make build && make up
# ou
npm run docker:build && npm run docker:up
```

## 🏗️ Arquitetura Docker

### Multi-Stage Build
O Dockerfile usa multi-stage build para otimização:

1. **Base**: Configuração comum e usuário não-root
2. **Dependencies**: Instala apenas dependências de produção
3. **Build**: Compila a aplicação
4. **Production**: Imagem final otimizada

### Benefícios
- ✅ Imagem final pequena (~150MB vs ~800MB)
- ✅ Usuário não-root para segurança
- ✅ Cache otimizado para builds rápidos
- ✅ Health check integrado
- ✅ Signal handling adequado com dumb-init

## 📁 Estrutura de Arquivos

```
├── Dockerfile              # Produção (multi-stage)
├── Dockerfile.dev          # Desenvolvimento
├── docker-compose.yaml     # Produção
├── docker-compose.dev.yaml # Desenvolvimento
├── .dockerignore           # Arquivos ignorados
├── Makefile               # Comandos facilitados
└── scripts/
    └── mongo-init.js      # Inicialização do MongoDB
```

## 🛠️ Comandos Disponíveis

### Com Make (Recomendado)
```bash
# Ajuda
make help

# Desenvolvimento
make up-dev          # Iniciar desenvolvimento
make down-dev        # Parar desenvolvimento
make logs-dev        # Ver logs
make shell-dev       # Acessar container
make test            # Executar testes

# Produção
make up              # Iniciar produção
make down            # Parar produção
make logs            # Ver logs
make rebuild         # Rebuild completo

# Manutenção
make clean           # Limpar Docker
make health          # Verificar saúde
make status          # Status dos containers
```

### Com NPM
```bash
# Build
npm run docker:build
npm run docker:build:dev

# Run
npm run docker:up
npm run docker:up:dev
npm run docker:down
npm run docker:down:dev

# Logs
npm run docker:logs
npm run docker:logs:dev

# Manutenção
npm run docker:clean
npm run docker:rebuild
```

### Com Docker Compose
```bash
# Desenvolvimento
docker-compose -f docker-compose.dev.yaml up -d
docker-compose -f docker-compose.dev.yaml down

# Produção
docker-compose up -d
docker-compose down
```

## 🔧 Configuração

### Variáveis de Ambiente
Principais variáveis para Docker:

```env
# Aplicação
NODE_ENV=development|production
API_PORT=3000

# Database
DATABASE_URL=mongodb://root:root@mongodb:27017
DATABASE_NAME=clean_archi_api
MONGO_PORT=27017
MONGO_ROOT_USERNAME=root
MONGO_ROOT_PASSWORD=root

# Redis (opcional)
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key
```

### Volumes
- `mongodb-data`: Dados do MongoDB
- `redis-data`: Dados do Redis
- `app-logs`: Logs da aplicação
- Hot reload no desenvolvimento

### Networks
- `app-network`: Rede interna para comunicação entre serviços

## 🏥 Health Checks

### Aplicação
- **Endpoint**: `GET /health`
- **Intervalo**: 30s
- **Timeout**: 10s
- **Retries**: 3

### MongoDB
- **Comando**: `mongosh --eval "db.adminCommand('ping')"`
- **Intervalo**: 30s

### Redis
- **Comando**: `redis-cli ping`
- **Intervalo**: 30s

## 🔍 Monitoramento

### Logs
```bash
# Logs da aplicação
make logs
docker-compose logs -f app

# Logs do banco
make logs-db
docker-compose logs -f mongodb

# Todos os logs
make logs-all
docker-compose logs -f
```

### Status
```bash
# Status dos containers
make status
docker-compose ps

# Health check manual
make health
curl http://localhost:3000/health
```

## 🐛 Desenvolvimento

### Hot Reload
O ambiente de desenvolvimento inclui:
- ✅ Hot reload automático
- ✅ Debug port (9229)
- ✅ Volume mount do código fonte
- ✅ MongoDB Express UI (http://localhost:8081)

### Debug
```bash
# Iniciar com debug
make up-dev

# Conectar debugger na porta 9229
# VS Code: attach to localhost:9229
```

### Testes
```bash
# Executar testes
make test

# Testes em watch mode
make test-watch

# Dentro do container
make shell-dev
npm test
```

## 🗄️ Database

### MongoDB
- **Host**: mongodb (interno) / localhost:27017 (externo)
- **Admin UI**: http://localhost:8081 (desenvolvimento)
- **Usuário**: root/root
- **Database**: clean_archi_api

### Comandos úteis
```bash
# Acessar MongoDB shell
make db-shell

# Backup
make db-backup

# Restore
make db-restore
```

## 🚀 Deploy

### Produção Local
```bash
# 1. Configurar ambiente
cp .env.example .env
# Editar .env com valores de produção

# 2. Build e iniciar
make build
make up

# 3. Verificar
make health
make status
```

### CI/CD
Exemplo para GitHub Actions:
```yaml
- name: Build Docker image
  run: docker build -t ${{ env.IMAGE_NAME }} .

- name: Run tests
  run: docker run --rm ${{ env.IMAGE_NAME }} npm test

- name: Deploy
  run: docker-compose up -d
```

## 🔒 Segurança

### Práticas Implementadas
- ✅ Usuário não-root
- ✅ Multi-stage build
- ✅ .dockerignore otimizado
- ✅ Health checks
- ✅ Signal handling
- ✅ Volumes para dados persistentes
- ✅ Network isolation

### Recomendações Adicionais
- Use secrets para senhas em produção
- Configure firewall adequadamente
- Use HTTPS em produção
- Monitore logs e métricas
- Mantenha imagens atualizadas

## 🆘 Troubleshooting

### Problemas Comuns

**Container não inicia**
```bash
# Verificar logs
make logs
docker-compose logs app

# Verificar configuração
make status
```

**Banco não conecta**
```bash
# Verificar se MongoDB está rodando
make logs-db

# Testar conexão
make db-shell
```

**Build falha**
```bash
# Build sem cache
make build-no-cache

# Verificar .dockerignore
cat .dockerignore
```

**Performance ruim**
```bash
# Limpar sistema Docker
make clean

# Verificar recursos
docker stats
```

### Logs Úteis
```bash
# Logs estruturados
docker-compose logs --tail=100 app

# Logs em tempo real
docker-compose logs -f

# Logs de um serviço específico
docker-compose logs mongodb
```

## 📚 Referências

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Multi-stage builds](https://docs.docker.com/develop/dev-best-practices/#use-multi-stage-builds)
- [Health checks](https://docs.docker.com/engine/reference/builder/#healthcheck)
