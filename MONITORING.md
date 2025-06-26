# 📊 Monitoring Guide - Clean Architecture API

Este guia documenta o sistema completo de monitoramento e observabilidade implementado na API.

## 🎯 **Visão Geral**

A API possui um sistema completo de monitoramento com:
- **Structured Logging** com Winston
- **Métricas** com Prometheus
- **Health Checks** avançados
- **Request Tracing** com IDs únicos
- **Performance Monitoring**
- **Business Metrics**

## 📝 **Structured Logging**

### **Configuração**
- **Biblioteca**: Winston + nest-winston
- **Formato**: JSON estruturado
- **Níveis**: error, warn, info, debug, verbose

### **Logs por Ambiente**

#### **Development**
```bash
# Console colorido e legível
14:30:25 INFO [Bootstrap] 🚀 Application is running on: http://localhost:3000
14:30:26 LOG [RequestLoggingInterceptor] Incoming request
```

#### **Production**
```json
{
  "timestamp": "2023-12-01 14:30:25",
  "level": "INFO",
  "context": "Bootstrap",
  "message": "Application is running on: http://localhost:3000",
  "metadata": {
    "port": 3000,
    "environment": "production"
  }
}
```

### **Arquivos de Log**
```
logs/
├── combined.log      # Todos os logs (info+)
├── error.log         # Apenas erros
├── security.log      # Eventos de segurança
├── exceptions.log    # Exceções não tratadas
└── rejections.log    # Promise rejections
```

### **Request Logging**
Cada requisição é logada com:
```json
{
  "requestId": "550e8400-e29b-41d4-a716-446655440000",
  "method": "POST",
  "url": "/api/users",
  "userAgent": "Mozilla/5.0...",
  "ip": "192.168.1.1",
  "userId": "user123",
  "timestamp": "2023-12-01T14:30:25.000Z",
  "duration": 150,
  "statusCode": 201,
  "responseSize": 1024
}
```

## 📈 **Métricas com Prometheus**

### **Métricas HTTP**
```prometheus
# Total de requisições HTTP
http_requests_total{method="POST",route="/users",status_code="201"} 42

# Duração das requisições
http_request_duration_seconds{method="POST",route="/users",status_code="201"} 0.150
```

### **Métricas de Negócio**
```prometheus
# Total de usuários
users_total 1250

# Registros de usuários
user_registrations_total 42

# Logins de usuários
user_logins_total{status="success"} 156
user_logins_total{status="failure"} 8
```

### **Métricas de Segurança**
```prometheus
# Eventos de segurança
security_events_total{type="unauthorized_access",severity="medium"} 12
security_events_total{type="rate_limit_exceeded",severity="low"} 5

# Rate limit hits
rate_limit_hits_total{ip="192.168.1.1",endpoint="/api/users"} 3
```

### **Métricas de Sistema**
```prometheus
# Conexões de banco
database_connections_active 5

# Duração de queries
database_query_duration_seconds{operation="find",collection="users"} 0.025

# Erros totais
errors_total{type="ValidationError",severity="medium"} 8
```

## 🏥 **Health Checks**

### **Endpoint Básico**
```bash
GET /monitoring/health
```

**Resposta:**
```json
{
  "status": "ok",
  "timestamp": "2023-12-01T14:30:25.000Z",
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
      "message": "Disk accessible",
      "accessible": true
    }
  },
  "metrics": {
    "totalRequests": 1250,
    "totalUsers": 450,
    "errorRate": 2.1
  }
}
```

### **Health Check Detalhado**
```bash
GET /monitoring/health/detailed
```

**Inclui informações adicionais:**
```json
{
  "system": {
    "nodeVersion": "v18.20.8",
    "platform": "linux",
    "arch": "x64",
    "pid": 1234,
    "uptime": 3600
  },
  "performance": {
    "eventLoopDelay": 1.2,
    "gcStats": {
      "totalHeapSize": 196,
      "usedHeapSize": 128,
      "heapSizeLimit": 512
    }
  }
}
```

## 📊 **Endpoints de Monitoramento**

### **Métricas Prometheus**
```bash
GET /monitoring/metrics
Content-Type: text/plain

# HELP http_requests_total Total number of HTTP requests
# TYPE http_requests_total counter
http_requests_total{method="GET",route="/health",status_code="200"} 1
```

### **Informações da Aplicação**
```bash
GET /monitoring/info
```

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
    "monitoring": true,
    "healthCheck": true,
    "metrics": true,
    "structuredLogging": true
  }
}
```

### **Status Simples**
```bash
GET /monitoring/status
```

```json
{
  "status": "ok",
  "timestamp": "2023-12-01T14:30:25.000Z",
  "uptime": 3600
}
```

## 🔍 **Request Tracing**

### **Request ID**
Cada requisição recebe um ID único:
```http
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
```

### **Headers de Resposta**
```http
X-Request-ID: 550e8400-e29b-41d4-a716-446655440000
X-API-Version: 1.0.0
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 2023-12-01T14:31:00.000Z
```

## 📈 **Dashboards e Alertas**

### **Grafana Dashboard**
Métricas recomendadas para dashboard:

#### **Application Overview**
- Total de requisições por minuto
- Tempo de resposta médio
- Taxa de erro
- Usuários ativos

#### **Performance**
- Latência P95/P99
- Throughput (RPS)
- Event loop delay
- Memory usage

#### **Business Metrics**
- Novos registros por hora
- Logins bem-sucedidos vs falhas
- Endpoints mais utilizados

#### **Security**
- Rate limit hits
- Tentativas de login falhadas
- Eventos de segurança por tipo

### **Alertas Recomendados**

#### **Críticos**
```yaml
# Taxa de erro > 5%
- alert: HighErrorRate
  expr: rate(errors_total[5m]) / rate(http_requests_total[5m]) > 0.05
  for: 2m

# Latência P95 > 1s
- alert: HighLatency
  expr: histogram_quantile(0.95, http_request_duration_seconds) > 1
  for: 5m

# Memory usage > 90%
- alert: HighMemoryUsage
  expr: (process_resident_memory_bytes / node_memory_MemTotal_bytes) > 0.9
  for: 5m
```

#### **Warnings**
```yaml
# Rate limit hits frequentes
- alert: FrequentRateLimitHits
  expr: rate(rate_limit_hits_total[5m]) > 10
  for: 5m

# Muitas tentativas de login falhadas
- alert: HighFailedLogins
  expr: rate(user_logins_total{status="failure"}[5m]) > 5
  for: 2m
```

## 🛠️ **Configuração**

### **Variáveis de Ambiente**
```env
# Logging
LOG_LEVEL=info
LOG_FORMAT=json
ENABLE_REQUEST_LOGGING=true

# Monitoring
METRICS_ENABLED=true
HEALTH_CHECK_ENABLED=true
DETAILED_ERRORS=false

# Performance
EVENT_LOOP_MONITORING=true
GC_MONITORING=true
```

### **Docker Compose com Monitoring Stack**
```yaml
version: '3.8'
services:
  app:
    # ... configuração da app
    
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
      
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana-data:/var/lib/grafana
```

### **Prometheus Configuration**
```yaml
# monitoring/prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'clean-archi-api'
    static_configs:
      - targets: ['app:3000']
    metrics_path: '/monitoring/metrics'
    scrape_interval: 5s
```

## 🔧 **Desenvolvimento**

### **Logs em Desenvolvimento**
```bash
# Ver logs em tempo real
npm run start:dev

# Logs estruturados
LOG_LEVEL=debug npm run start:dev

# Apenas erros
LOG_LEVEL=error npm run start:dev
```

### **Testando Métricas**
```bash
# Gerar algumas requisições
curl http://localhost:3000/monitoring/health
curl http://localhost:3000/monitoring/info

# Ver métricas
curl http://localhost:3000/monitoring/metrics
```

### **Debugging**
```bash
# Health check detalhado
curl http://localhost:3000/monitoring/health/detailed | jq

# Status da aplicação
curl http://localhost:3000/monitoring/status | jq
```

## 📚 **Logs Estruturados - Exemplos**

### **Request Log**
```json
{
  "timestamp": "2023-12-01 14:30:25",
  "level": "INFO",
  "context": "RequestLoggingInterceptor",
  "message": "Incoming request",
  "metadata": {
    "requestId": "550e8400-e29b-41d4-a716-446655440000",
    "method": "POST",
    "url": "/api/users",
    "ip": "192.168.1.1",
    "userAgent": "Mozilla/5.0...",
    "body": {
      "name": "João Silva",
      "email": "joao@example.com",
      "password": "[REDACTED]"
    }
  }
}
```

### **Security Event**
```json
{
  "timestamp": "2023-12-01 14:30:25",
  "level": "WARN",
  "context": "Security",
  "message": "Rate limit exceeded",
  "metadata": {
    "ip": "192.168.1.1",
    "endpoint": "/api/users",
    "limit": 100,
    "current": 101,
    "userAgent": "Mozilla/5.0..."
  }
}
```

### **Error Log**
```json
{
  "timestamp": "2023-12-01 14:30:25",
  "level": "ERROR",
  "context": "UserService",
  "message": "Failed to create user",
  "metadata": {
    "requestId": "550e8400-e29b-41d4-a716-446655440000",
    "userId": "user123",
    "error": "ValidationError",
    "details": "Email already exists"
  },
  "trace": "Error: Email already exists\n    at UserService.create..."
}
```

## 🚀 **Produção**

### **Checklist de Monitoramento**
- [ ] Logs sendo coletados (ELK/Fluentd)
- [ ] Métricas sendo scraped (Prometheus)
- [ ] Dashboards configurados (Grafana)
- [ ] Alertas configurados (AlertManager)
- [ ] Health checks funcionando
- [ ] Request tracing ativo
- [ ] Rotação de logs configurada

### **Integração com APM**
```typescript
// Exemplo com New Relic
import * as newrelic from 'newrelic'

// Custom metrics
newrelic.recordMetric('Custom/UserRegistrations', 1)
newrelic.recordMetric('Custom/LoginAttempts', 1)

// Custom events
newrelic.recordCustomEvent('UserAction', {
  action: 'registration',
  userId: 'user123',
  timestamp: Date.now()
})
```

---

**Status**: 📊 **Monitoramento Completo** | 🔍 **Observabilidade Total** | 📈 **Production Ready**
