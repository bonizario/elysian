import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { envSchema } from './env';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      validate: envSchema.parse,
      isGlobal: true,
    }),
    HttpModule,
  ],
})
export class AppModule {}