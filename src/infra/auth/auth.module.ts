import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { EnvModule } from '../env/env.module';
import { EnvService } from '../env/env.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      global: true,
      imports: [EnvModule],
      inject: [EnvService],
      useFactory(env: EnvService) {
        const privateKey = env.get('JWT_PRIVATE_KEY');

        const publicKey = env.get('JWT_PUBLIC_KEY');

        return {
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
          signOptions: {
            algorithm: 'RS256',
          },
        };
      },
    }),
    PassportModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    EnvService,
    JwtStrategy,
  ],
})
export class AuthModule {}
