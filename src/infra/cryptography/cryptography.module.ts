import { Module } from '@nestjs/common';

import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { HashComparator } from '@/domain/forum/application/cryptography/hash-comparator';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { BcryptHasher } from './bcrypt-hasher';
import { JwtEncrypter } from './jwt-encrypter';

@Module({
  exports: [Encrypter, HashComparator, HashGenerator],
  providers: [
    {
      provide: Encrypter,
      useClass: JwtEncrypter,
    },
    {
      provide: HashComparator,
      useClass: BcryptHasher,
    },
    {
      provide: HashGenerator,
      useClass: BcryptHasher,
    },
  ],
})
export class CryptographyModule {}
