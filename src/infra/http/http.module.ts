import { Module } from '@nestjs/common'
import { APP_FILTER } from '@nestjs/core'

import { GlobalExceptionFilter } from './exeptions/global-exeption.filter'

import { DatabaseModule } from '@infra/database/database.module'
import { CryptographyModule } from '@infra/cryptography'
import { EnvModule } from '@infra/env'

import { HealthController } from './controllers'

@Module({
  imports: [CryptographyModule, EnvModule, DatabaseModule],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class HttpModule {}
