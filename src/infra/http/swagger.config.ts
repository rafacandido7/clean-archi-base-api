import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { INestApplication } from '@nestjs/common'

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Clean Architecture API')
    .setDescription(`
# Clean Architecture Base API

Uma API RESTful construída com **Clean Architecture**, **NestJS** e **TypeScript**.

## 🚀 Características

- ✅ **Clean Architecture** com separação clara de responsabilidades
- ✅ **Value Objects** para validação robusta (CPF, Email, Phone)
- ✅ **Segurança** completa (Helmet, Rate Limiting, CORS, Sanitização)
- ✅ **Monitoramento** com logs estruturados e métricas Prometheus
- ✅ **Testes** unitários com 95%+ de cobertura
- ✅ **Docker** otimizado com multi-stage build
- ✅ **Validação** rigorosa de dados de entrada
- ✅ **Documentação** completa com exemplos

## 🔐 Autenticação

Esta API usa **JWT Bearer Token** para autenticação.

### Como obter um token:
1. Faça login com \`POST /auth/login\`
2. Use o token retornado no header: \`Authorization: Bearer <token>\`

## 📊 Monitoramento

- **Health Check**: \`GET /monitoring/health\`
- **Métricas**: \`GET /monitoring/metrics\`
- **Status**: \`GET /monitoring/status\`

## 🛡️ Rate Limiting

- **Limite**: 100 requests por minuto por IP
- **Headers**: \`X-RateLimit-*\` informam o status atual

## 📝 Logs

Todas as requisições são logadas com ID único (\`X-Request-ID\`).
    `)
    .setVersion('1.0.0')
    .setContact(
      'API Support',
      'https://github.com/your-repo',
      'support@yourdomain.com',
    )
    .setLicense(
      'MIT',
      'https://opensource.org/licenses/MIT',
    )
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://api.yourdomain.com', 'Production Server')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API Key for external integrations',
      },
      'API-Key',
    )
    .addTag('Authentication', 'Endpoints para autenticação de usuários')
    .addTag('Users', 'Gerenciamento de usuários')
    .addTag('Monitoring', 'Endpoints de monitoramento e saúde da aplicação')
    .addTag('Health', 'Health checks e status da aplicação')
    .build()

  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  })

  // Adicionar exemplos customizados
  addCustomExamples(document)

  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'method',
      docExpansion: 'none',
      filter: true,
      showRequestHeaders: true,
      showCommonExtensions: true,
      tryItOutEnabled: true,
    },
    customSiteTitle: 'Clean Architecture API - Documentation',
    customfavIcon: '/favicon.ico',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info { margin: 20px 0 }
      .swagger-ui .info .title { color: #3b82f6 }
      .swagger-ui .scheme-container { background: #f8fafc; padding: 15px; border-radius: 8px }
      .swagger-ui .btn.authorize { background-color: #10b981; border-color: #10b981 }
      .swagger-ui .btn.authorize:hover { background-color: #059669; border-color: #059669 }
    `,
    customJs: [
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-bundle.min.js',
      'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.15.5/swagger-ui-standalone-preset.min.js',
    ],
  })
}

function addCustomExamples(document: any) {
  // Adicionar exemplos para responses comuns
  if (document.components) {
    document.components.examples = {
      UserResponse: {
        summary: 'Resposta de usuário',
        value: {
          id: '507f1f77bcf86cd799439011',
          name: 'João Silva',
          email: 'joao.silva@email.com',
          cpf: '111.444.777-35',
          phone: '+55 (11) 98765-4321',
          createdAt: '2023-12-01T10:30:00.000Z',
          updatedAt: '2023-12-01T10:30:00.000Z',
        },
      },
      ValidationError: {
        summary: 'Erro de validação',
        value: {
          statusCode: 400,
          message: [
            'Nome deve ter entre 2 e 100 caracteres',
            'E-mail deve ter um formato válido',
            'Senha deve conter pelo menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 símbolo',
          ],
          error: 'Bad Request',
        },
      },
      UnauthorizedError: {
        summary: 'Erro de autenticação',
        value: {
          statusCode: 401,
          message: 'Token inválido ou expirado',
          error: 'Unauthorized',
        },
      },
      RateLimitError: {
        summary: 'Rate limit excedido',
        value: {
          statusCode: 429,
          message: 'Too many requests, please try again later',
          error: 'Rate Limit Exceeded',
        },
      },
    }
  }
}
