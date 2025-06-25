import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'),
        dbName: configService.get<string>('DATABASE_NAME'),
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [],
  exports: [MongooseModule],
})
export class MongoDbModule {}
