import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './auth/auth.module';
import { envSchema } from './env';
import { EnvModule } from './env/env.module';
import { EventsModule } from './events/events.module.ts';
import { HttpModule } from './http/http.module';

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot({
      validate: envSchema.parse,
      isGlobal: true,
    }),
    EnvModule,
    EventsModule,
    HttpModule,
  ],
})
export class AppModule {}
