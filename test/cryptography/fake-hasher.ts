import { HashComparator } from '@/domain/forum/application/cryptography/hash-comparator';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';

export class FakeHasher implements HashComparator, HashGenerator {
  async compare(plain: string, hash: string) {
    return plain.concat('-hashed') === hash;
  }

  async hash(plain: string) {
    return plain.concat('-hashed');
  }
}
