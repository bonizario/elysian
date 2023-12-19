import { randomUUID } from 'node:crypto';

import {
  Uploader,
  type UploadParams,
  type UploadResponse,
} from '@/domain/forum/application/storage/uploader';

interface Upload {
  fileName: string;
  url: string;
}

export class FakeUploader implements Uploader {
  public uploads: Upload[] = [];

  async upload({ fileName }: UploadParams): Promise<UploadResponse> {
    const url = randomUUID();

    this.uploads.push({
      fileName,
      url,
    });

    return {
      url,
    };
  }
}
