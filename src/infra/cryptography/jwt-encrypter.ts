import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';

@Injectable()
export class JwtEncrypter implements Encrypter {
  constructor(private readonly jwt: JwtService) {}

  async encrypt(payload: Record<string, unknown>) {
    return this.jwt.signAsync(payload);
  }
}
