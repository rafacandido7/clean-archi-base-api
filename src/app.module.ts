import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { HttpModule } from '@infra/http/http.module'
import { EnvModule } from './infra/env'
import { AuthModule } from '@infra/auth/auth.module'
import { SecurityModule } from '@infra/security/security.module'
import { MonitoringModule } from '@infra/monitoring/monitoring.module'
import { ApplicationModule } from './application/application.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    EnvModule,
    SecurityModule,
    MonitoringModule,
    AuthModule,
    ApplicationModule,
    HttpModule,
  ],
})
export class AppModule {}
