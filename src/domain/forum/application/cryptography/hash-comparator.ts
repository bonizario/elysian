export abstract class HashComparator {
  abstract compare(plain: string, digest: string): Promise<boolean>;
}
