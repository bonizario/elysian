import { randomUUID } from 'node:crypto';

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';

import {
  Uploader,
  type UploadParams,
} from '@/domain/forum/application/storage/uploader';

import { EnvService } from '@/infra/env/env.service';

@Injectable()
export class R2Storage implements Uploader {
  private readonly client: S3Client;

  constructor(private readonly envService: EnvService) {
    const accessKeyId = this.envService.get('AWS_ACCESS_KEY_ID');
    const secretAccessKey = this.envService.get('AWS_SECRET_ACCESS_KEY');
    const accountId = this.envService.get('CLOUDFARE_ACCOUNT_ID');

    this.client = new S3Client({
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      region: 'auto',
    });
  }

  async upload({ body, fileName, fileType }: UploadParams) {
    const uploadId = randomUUID();

    const uniqueFileName = `${uploadId}-${fileName}`;

    await this.client.send(
      new PutObjectCommand({
        Bucket: this.envService.get('AWS_BUCKET_NAME'),
        Body: body,
        ContentType: fileType,
        Key: uniqueFileName,
      }),
    );

    return {
      url: uniqueFileName,
    };
  }
}
