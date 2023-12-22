import { Injectable } from '@nestjs/common';

import { CacheRepository } from '@/infra/cache/cache.repository';

import { RedisService } from './redis.service';

@Injectable()
export class RedisCacheRepository implements CacheRepository {
  constructor(private readonly redis: RedisService) {}

  async get(key: string) {
    return this.redis.get(key);
  }

  async delete(key: string) {
    await this.redis.del(key);
  }

  async set(key: string, value: string) {
    await this.redis.set(key, value, 'EX', 60 * 15); // 15 minutes
  }
}
