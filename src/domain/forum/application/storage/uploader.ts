export interface UploadParams {
  body: Buffer;
  fileName: string;
  fileType: string;
}

export interface UploadResponse {
  url: string;
}

export abstract class Uploader {
  abstract upload(params: UploadParams): Promise<UploadResponse>;
}
