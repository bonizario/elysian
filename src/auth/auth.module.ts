import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { Env } from '@/env';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory(configService: ConfigService<Env, true>) {
        const privateKey = configService.get('JWT_PRIVATE_KEY', {
          infer: true,
        });

        const publicKey = configService.get('JWT_PUBLIC_KEY', {
          infer: true,
        });

        return {
          privateKey: Buffer.from(privateKey, 'base64'),
          publicKey: Buffer.from(publicKey, 'base64'),
          signOptions: {
            algorithm: 'RS256',
          },
        };
      },
    }),
  ],
  providers: [JwtStrategy],
})
export class AuthModule {}
