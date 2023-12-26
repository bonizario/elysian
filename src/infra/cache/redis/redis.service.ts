import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';

import { EnvService } from '@/infra/env/env.service';

@Injectable()
export class RedisService extends Redis implements OnModuleDestroy {
  constructor(env: EnvService) {
    super({
      db: env.get('REDIS_DB'),
      host: env.get('REDIS_HOST'),
      port: env.get('REDIS_PORT'),
    });
  }

  onModuleDestroy() {
    this.disconnect();
  }
}
