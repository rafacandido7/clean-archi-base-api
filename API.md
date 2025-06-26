# 📚 API Documentation - Clean Architecture API

Este guia documenta todos os endpoints da API com exemplos práticos e casos de uso.

## 🎯 **Visão Geral**

- **Base URL**: `http://localhost:3000` (desenvolvimento)
- **Documentação Interativa**: `http://localhost:3000/docs` (Swagger UI)
- **Formato**: JSON
- **Autenticação**: JWT Bearer Token
- **Rate Limiting**: 100 requests/minuto por IP

## 🔐 **Autenticação**

### **Como Autenticar**
1. Faça login para obter um token JWT
2. Inclua o token no header: `Authorization: Bearer <token>`
3. O token expira em 15 minutos

### **Headers Obrigatórios**
```http
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Headers Opcionais**
```http
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000  # ID único da requisição
X-API-Key: your-api-key                              # Para integrações externas
```

## 👤 **Endpoints de Usuários**

### **POST /users - Criar Usuário**

Cria um novo usuário no sistema.

#### **Request**
```http
POST /users
Content-Type: application/json

{
  "name": "João Silva Santos",
  "email": "joao.silva@email.com",
  "password": "MinhaSenh@123",
  "cpf": "111.444.777-35",
  "phone": "(11) 98765-4321"
}
```

#### **Response 201 - Sucesso**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "João Silva Santos",
  "email": "joao.silva@email.com",
  "cpf": "111.444.777-35",
  "phone": "+55 (11) 98765-4321",
  "createdAt": "2023-12-01T10:30:00.000Z",
  "updatedAt": "2023-12-01T10:30:00.000Z"
}
```

#### **Response 400 - Erro de Validação**
```json
{
  "statusCode": 400,
  "message": [
    "Nome deve ter entre 2 e 100 caracteres",
    "E-mail deve ter um formato válido",
    "Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 símbolo"
  ],
  "error": "Bad Request",
  "timestamp": "2023-12-01T10:30:00.000Z",
  "path": "/users",
  "method": "POST"
}
```

#### **Validações**
- **Nome**: 2-100 caracteres, apenas letras, espaços e acentos
- **Email**: Formato válido, único no sistema
- **Senha**: Mínimo 8 caracteres com maiúscula, minúscula, número e símbolo
- **CPF**: Validação completa com dígitos verificadores, único no sistema
- **Telefone**: Formato brasileiro com DDD (opcional)

---

### **GET /users - Listar Usuários**

Retorna uma lista paginada de usuários. **Requer autenticação**.

#### **Request**
```http
GET /users?page=1&limit=10&name=João&sortBy=createdAt&sortOrder=desc
Authorization: Bearer <token>
```

#### **Query Parameters**
- `page` (opcional): Número da página (padrão: 1)
- `limit` (opcional): Itens por página (padrão: 10, máximo: 100)
- `name` (opcional): Filtro por nome (busca parcial)
- `email` (opcional): Filtro por email (busca parcial)
- `sortBy` (opcional): Campo para ordenação (name, email, createdAt)
- `sortOrder` (opcional): Ordem (asc, desc)

#### **Response 200 - Sucesso**
```json
{
  "data": [
    {
      "id": "507f1f77bcf86cd799439011",
      "name": "João Silva Santos",
      "email": "joao.silva@email.com",
      "cpf": "111.444.777-35",
      "phone": "+55 (11) 98765-4321",
      "createdAt": "2023-12-01T10:30:00.000Z",
      "updatedAt": "2023-12-01T10:30:00.000Z"
    }
  ],
  "total": 150,
  "page": 1,
  "limit": 10,
  "totalPages": 15,
  "hasNext": true,
  "hasPrev": false
}
```

---

### **GET /users/:id - Buscar Usuário por ID**

Retorna os dados de um usuário específico. **Requer autenticação**.

#### **Request**
```http
GET /users/507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

#### **Response 200 - Sucesso**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "João Silva Santos",
  "email": "joao.silva@email.com",
  "cpf": "111.444.777-35",
  "phone": "+55 (11) 98765-4321",
  "createdAt": "2023-12-01T10:30:00.000Z",
  "updatedAt": "2023-12-01T10:30:00.000Z"
}
```

#### **Response 404 - Usuário Não Encontrado**
```json
{
  "statusCode": 404,
  "message": "Usuário não encontrado",
  "error": "Not Found",
  "timestamp": "2023-12-01T10:30:00.000Z",
  "path": "/users/507f1f77bcf86cd799439011",
  "method": "GET"
}
```

---

### **PUT /users/:id - Atualizar Usuário**

Atualiza os dados de um usuário existente. **Requer autenticação**.

#### **Request**
```http
PUT /users/507f1f77bcf86cd799439011
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "João Santos Silva",
  "email": "joao.santos@email.com",
  "phone": "(11) 99999-8888"
}
```

#### **Response 200 - Sucesso**
```json
{
  "id": "507f1f77bcf86cd799439011",
  "name": "João Santos Silva",
  "email": "joao.santos@email.com",
  "cpf": "111.444.777-35",
  "phone": "+55 (11) 99999-8888",
  "createdAt": "2023-12-01T10:30:00.000Z",
  "updatedAt": "2023-12-01T11:45:00.000Z"
}
```

#### **Campos Atualizáveis**
- `name` (opcional): Nome completo
- `email` (opcional): Email (deve ser único)
- `phone` (opcional): Telefone brasileiro

---

### **DELETE /users/:id - Excluir Usuário**

Remove um usuário do sistema permanentemente. **Requer autenticação**.

#### **Request**
```http
DELETE /users/507f1f77bcf86cd799439011
Authorization: Bearer <token>
```

#### **Response 204 - Sucesso**
```
(Sem conteúdo)
```

#### **⚠️ Atenção**
- Esta ação é **irreversível**
- Todos os dados do usuário serão perdidos

---

## 🔐 **Endpoints de Autenticação**

### **POST /auth/login - Login**

Autentica um usuário e retorna um token JWT.

#### **Request**
```http
POST /auth/login
Content-Type: application/json

{
  "email": "joao.silva@email.com",
  "password": "MinhaSenh@123"
}
```

#### **Response 200 - Sucesso**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900,
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "João Silva Santos",
    "email": "joao.silva@email.com",
    "cpf": "111.444.777-35",
    "phone": "+55 (11) 98765-4321"
  }
}
```

#### **Response 401 - Credenciais Inválidas**
```json
{
  "statusCode": 401,
  "message": "Email ou senha inválidos",
  "error": "Unauthorized",
  "timestamp": "2023-12-01T10:30:00.000Z",
  "path": "/auth/login",
  "method": "POST"
}
```

---

### **POST /auth/refresh - Renovar Token**

Renova um token JWT expirado usando um refresh token.

#### **Request**
```http
POST /auth/refresh
Content-Type: application/json

{
  "refreshToken": "550e8400-e29b-41d4-a716-446655440000"
}
```

#### **Response 200 - Sucesso**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tokenType": "Bearer",
  "expiresIn": 900
}
```

---

### **POST /auth/logout - Logout**

Invalida o token atual e o refresh token. **Requer autenticação**.

#### **Request**
```http
POST /auth/logout
Authorization: Bearer <token>
```

#### **Response 200 - Sucesso**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## 🏥 **Endpoints de Monitoramento**

### **GET /monitoring/health - Health Check**

Verifica a saúde da aplicação.

#### **Request**
```http
GET /monitoring/health
```

#### **Response 200 - Saudável**
```json
{
  "status": "ok",
  "timestamp": "2023-12-01T10:30:00.000Z",
  "uptime": 3600000,
  "version": "1.0.0",
  "environment": "production",
  "checks": {
    "database": {
      "status": "up",
      "responseTime": 25
    },
    "memory": {
      "status": "ok",
      "message": "Memory usage: 65.2%",
      "heapUsed": "128MB",
      "heapTotal": "196MB"
    },
    "disk": {
      "status": "ok",
      "message": "Disk accessible"
    }
  }
}
```

---

### **GET /monitoring/metrics - Métricas Prometheus**

Retorna métricas no formato Prometheus.

#### **Request**
```http
GET /monitoring/metrics
```

#### **Response 200 - Métricas**
```
# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/health",status_code="200"} 1

# HELP users_total Total number of users
# TYPE users_total gauge
users_total 1250
```

---

### **GET /monitoring/info - Informações da API**

Retorna informações sobre a aplicação.

#### **Request**
```http
GET /monitoring/info
```

#### **Response 200 - Informações**
```json
{
  "name": "Clean Architecture API",
  "version": "1.0.0",
  "environment": "production",
  "nodeVersion": "v18.20.8",
  "uptime": 3600,
  "features": {
    "authentication": true,
    "rateLimit": true,
    "cors": true,
    "helmet": true,
    "validation": true,
    "sanitization": true,
    "monitoring": true
  }
}
```

---

## ⚠️ **Códigos de Erro**

### **400 - Bad Request**
Dados inválidos ou malformados.

### **401 - Unauthorized**
Token ausente, inválido ou expirado.

### **403 - Forbidden**
Acesso negado ao recurso.

### **404 - Not Found**
Recurso não encontrado.

### **429 - Too Many Requests**
Rate limit excedido.

### **500 - Internal Server Error**
Erro interno do servidor.

---

## 🔄 **Headers de Resposta**

Todas as respostas incluem headers informativos:

```http
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
X-API-Version: 1.0.0
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2023-12-01T10:31:00.000Z
```

---

## 📝 **Exemplos de Uso**

### **Fluxo Completo - Criar e Gerenciar Usuário**

```bash
# 1. Criar usuário
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "password": "MinhaSenh@123",
    "cpf": "111.444.777-35",
    "phone": "(11) 98765-4321"
  }'

# 2. Fazer login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@email.com",
    "password": "MinhaSenh@123"
  }'

# 3. Usar token para listar usuários
curl -X GET http://localhost:3000/users \
  -H "Authorization: Bearer <token>"

# 4. Atualizar usuário
curl -X PUT http://localhost:3000/users/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Santos Silva"
  }'
```

### **Filtros e Paginação**

```bash
# Buscar usuários por nome com paginação
curl -X GET "http://localhost:3000/users?name=João&page=2&limit=5&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer <token>"

# Buscar usuários por email
curl -X GET "http://localhost:3000/users?email=gmail.com" \
  -H "Authorization: Bearer <token>"
```

### **Monitoramento**

```bash
# Verificar saúde da API
curl http://localhost:3000/monitoring/health

# Ver métricas
curl http://localhost:3000/monitoring/metrics

# Informações da aplicação
curl http://localhost:3000/monitoring/info
```

---

## 🛠️ **Ferramentas Recomendadas**

### **Postman Collection**
Importe a collection para testes rápidos:
```bash
# Download da collection
curl -o postman-collection.json http://localhost:3000/docs-json
```

### **Insomnia**
Configure o ambiente:
```json
{
  "base_url": "http://localhost:3000",
  "token": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### **HTTPie**
```bash
# Instalar HTTPie
pip install httpie

# Fazer requisições
http POST localhost:3000/users name="João" email="joao@email.com" password="MinhaSenh@123" cpf="111.444.777-35"
```

---

## 🔍 **Debugging**

### **Request ID Tracking**
Cada requisição recebe um ID único para rastreamento:

```bash
curl -H "X-Request-ID: my-custom-id" http://localhost:3000/monitoring/health
```

### **Logs Estruturados**
Todos os requests são logados com detalhes:

```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "url": "/users",
  "statusCode": 201,
  "duration": 150,
  "userAgent": "curl/7.68.0"
}
```

---

**Status**: 📚 **Documentação Completa** | 🔍 **Exemplos Práticos** | 🚀 **Ready to Use**
