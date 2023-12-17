import { compare, hash } from 'bcryptjs';

import { HashComparator } from '@/domain/forum/application/cryptography/hash-comparator';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';

export class BcryptHasher implements HashComparator, HashGenerator {
  private readonly HASH_SALT_LENGTH = 8;

  async compare(plain: string, hash: string) {
    return compare(plain, hash);
  }

  async hash(plain: string) {
    return hash(plain, this.HASH_SALT_LENGTH);
  }
}
