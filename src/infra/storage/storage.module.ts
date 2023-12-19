import { Module } from '@nestjs/common';

import { Uploader } from '@/domain/forum/application/storage/uploader';

import { EnvModule } from '@/infra/env/env.module';

import { R2Storage } from './r2-storage';

@Module({
  imports: [EnvModule],
  exports: [Uploader],
  providers: [
    {
      provide: Uploader,
      useClass: R2Storage,
    },
  ],
})
export class StorageModule {}
