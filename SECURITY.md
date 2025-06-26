# 🔒 Security Guide - Clean Architecture API

Este guia documenta todas as medidas de segurança implementadas na API.

## 🛡️ **Medidas de Segurança Implementadas**

### **1. Headers de Segurança (Helmet)**

#### **Implementação**
- **Middleware**: `SecurityMiddleware`
- **Biblioteca**: Helmet
- **Aplicação**: Global em todas as rotas

#### **Headers Configurados**
```typescript
// Content Security Policy
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'

// Prevent MIME type sniffing
X-Content-Type-Options: nosniff

// Prevent clickjacking
X-Frame-Options: DENY

// XSS Protection
X-XSS-Protection: 1; mode=block

// Referrer Policy
Referrer-Policy: strict-origin-when-cross-origin

// HTTPS Strict Transport Security
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

### **2. Rate Limiting**

#### **Implementação Dupla**
1. **NestJS Throttler**: Rate limiting avançado
2. **Custom Rate Limit Guard**: Rate limiting personalizado

#### **Configuração**
```typescript
// Throttler (múltiplas janelas)
short: 10 requests/second
medium: 100 requests/minute  
long: 1000 requests/15 minutes

// Custom Guard
default: 100 requests/minute
```

#### **Headers de Resposta**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2023-12-01T10:30:00.000Z
```

### **3. CORS Seguro**

#### **Configuração**
```typescript
// Origens permitidas (configurável via env)
origin: ['http://localhost:3000', 'https://yourdomain.com']

// Credenciais
credentials: true

// Métodos permitidos
methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']

// Headers expostos
exposedHeaders: ['X-RateLimit-*', 'X-Request-ID', 'X-API-Version']
```

### **4. Sanitização de Inputs**

#### **SanitizationPipe**
- **Aplicação**: Global em body e query parameters
- **Proteções**:
  - Remove tags HTML
  - Remove scripts maliciosos
  - Remove padrões de SQL injection
  - Remove padrões de NoSQL injection
  - Remove null bytes
  - Trim de espaços

#### **Exemplo**
```typescript
// Input malicioso
"<script>alert('xss')</script>João"

// Após sanitização
"João"
```

### **5. Validação Robusta de DTOs**

#### **CreateUserDto Melhorado**
```typescript
@IsString()
@Length(2, 100)
@Matches(/^[a-zA-ZÀ-ÿ\u00f1\u00d1\s'.-]+$/)
@Transform(({ value }) => value?.trim())
name: string

@IsEmail()
@Length(5, 254)
@Transform(({ value }) => value?.toLowerCase().trim())
email: string

@Length(8, 128)
@Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
password: string
```

#### **Validações Implementadas**
- **Nome**: Apenas letras, acentos, espaços, apostrofes, pontos e hífens
- **Email**: Formato válido, normalização automática
- **Senha**: Mínimo 8 chars, maiúscula, minúscula, número e símbolo
- **CPF**: Validação completa com dígitos verificadores
- **Telefone**: Formato brasileiro com DDD

### **6. Exception Filter de Segurança**

#### **SecurityExceptionFilter**
- **Logging**: Eventos de segurança registrados
- **Sanitização**: Mensagens de erro sanitizadas
- **Headers**: Headers de segurança em respostas de erro
- **Produção**: Detalhes internos ocultados

#### **Logs de Segurança**
```typescript
// Rate limit exceeded
WARN: Rate limit exceeded: {"ip": "192.168.1.1", "method": "POST", "url": "/api/users"}

// Authentication failure  
WARN: Authentication failure: {"ip": "192.168.1.1", "userAgent": "..."}

// Server errors
ERROR: Server error: {"ip": "192.168.1.1", "status": 500, "message": "..."}
```

### **7. JWT Security**

#### **Configuração Segura**
```typescript
// Token de acesso curto
expiresIn: '15m'

// Algoritmo seguro
algorithm: 'HS256'

// Issuer e audience
issuer: 'clean-archi-api'
audience: 'clean-archi-client'
```

#### **Refresh Token Strategy**
- Tokens de refresh separados
- Rotação automática
- Armazenamento seguro

## 🔧 **Configuração de Segurança**

### **Variáveis de Ambiente**
```env
# JWT Security
JWT_SECRET=your-super-secure-jwt-secret-key-256-bits-minimum
JWT_REFRESH_SECRET=your-refresh-token-secret-key
JWT_EXPIRES_IN=15m

# CORS
CORS_ORIGIN=https://yourdomain.com,https://app.yourdomain.com
CORS_CREDENTIALS=true

# Rate Limiting
RATE_LIMIT_TTL=60
RATE_LIMIT_LIMIT=100
RATE_LIMIT_STRICT_MODE=true

# Security Headers
CSP_POLICY=default-src 'self'
HSTS_MAX_AGE=31536000
SECURITY_HEADERS_ENABLED=true

# Password Hashing
BCRYPT_ROUNDS=12
```

### **Configuração de Produção**
```typescript
// Validation Pipe
new ValidationPipe({
  whitelist: true,                    // Remove propriedades desconhecidas
  forbidNonWhitelisted: true,         // Erro em propriedades desconhecidas
  transform: true,                    // Transform para DTOs
  disableErrorMessages: true,         // Ocultar detalhes em produção
  validateCustomDecorators: true,     // Validar decorators customizados
})
```

## 🚨 **Monitoramento de Segurança**

### **Eventos Monitorados**
- ✅ Tentativas de login falhadas
- ✅ Rate limit excedido
- ✅ Violações de CORS
- ✅ Inputs maliciosos detectados
- ✅ Erros de autenticação/autorização
- ✅ Exceções de servidor

### **Logs Estruturados**
```json
{
  "timestamp": "2023-12-01T10:30:00.000Z",
  "level": "WARN",
  "context": "Security",
  "message": "Rate limit exceeded",
  "metadata": {
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "method": "POST",
    "url": "/api/users",
    "limit": 100,
    "current": 101
  }
}
```

## 🔍 **Testes de Segurança**

### **Testes Implementados**
- ✅ Validação de inputs maliciosos
- ✅ Rate limiting funcional
- ✅ Headers de segurança presentes
- ✅ CORS configurado corretamente
- ✅ Sanitização funcionando

### **Executar Testes**
```bash
# Testes de segurança
npm run test:security

# Testes de validação
npm run test -- --testNamePattern="validation"

# Testes de sanitização
npm run test -- --testNamePattern="sanitization"
```

## 🛠️ **Ferramentas de Segurança**

### **Análise de Vulnerabilidades**
```bash
# Audit de dependências
npm audit

# Fix automático
npm audit fix

# Análise detalhada
npm audit --audit-level moderate
```

### **Linting de Segurança**
```bash
# ESLint com regras de segurança
npm run lint

# Verificação de secrets
git-secrets --scan
```

## 📋 **Checklist de Segurança**

### **✅ Implementado**
- [x] Headers de segurança (Helmet)
- [x] Rate limiting (duplo)
- [x] CORS configurado
- [x] Sanitização de inputs
- [x] Validação robusta de DTOs
- [x] Exception filter de segurança
- [x] Logging de eventos de segurança
- [x] JWT com configuração segura
- [x] Variáveis de ambiente protegidas
- [x] Validation pipe com whitelist

### **🔄 Próximas Melhorias**
- [ ] Implementar WAF (Web Application Firewall)
- [ ] Adicionar 2FA (Two-Factor Authentication)
- [ ] Implementar session management
- [ ] Adicionar IP whitelisting
- [ ] Configurar intrusion detection
- [ ] Implementar audit trail completo

## 🚀 **Deployment Seguro**

### **Produção**
```bash
# Build de produção
NODE_ENV=production npm run build

# Variáveis obrigatórias
JWT_SECRET=<strong-secret>
CORS_ORIGIN=<production-domains>
DATABASE_URL=<secure-connection>
```

### **Docker Security**
```dockerfile
# Usuário não-root
USER node

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD node dist/health-check.js

# Security headers
LABEL security.scan=true
```

## 📞 **Contato de Segurança**

Para reportar vulnerabilidades de segurança:
- **Email**: security@yourdomain.com
- **PGP Key**: [Link para chave pública]
- **Bug Bounty**: [Link para programa]

---

**Status**: 🔒 **Segurança Implementada** | 🛡️ **Production Ready**
