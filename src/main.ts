import 'dotenv/config'

import { ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

import { AppModule } from './app.module'

import { env } from '@infra/env/env'
import {
  HttpLoggingInterceptor,
  TransformResponseInterceptor,
} from '@infra/http/interceptors'

const { apiPort } = env

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: true,
  })

  const reflector = app.get(Reflector)

  app.enableCors()
  app.disable('x-powered-by')

  app.useGlobalInterceptors(
    new HttpLoggingInterceptor(),
    new TransformResponseInterceptor(reflector),
  )

  app.useGlobalPipes(new ValidationPipe())

  const config = new DocumentBuilder()
    .setTitle('CLEAN ARCHI BASE API')
    .setDescription('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'method',
    },
  })

  await app.listen(apiPort, () => {
    console.log(
      '\n\x1b[34m\x1b[1m%s\x1b[0m',
      `Listening in port ${apiPort} 🚀!`,
    )
  })
}

bootstrap()
