export abstract class CacheRepository {
  abstract get(key: string): Promise<string | null>;

  abstract delete(key: string): Promise<void>;

  abstract set(key: string, value: string): Promise<void>;
}
