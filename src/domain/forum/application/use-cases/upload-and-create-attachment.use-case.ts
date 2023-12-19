import { Injectable } from '@nestjs/common';

import { left, right, type Either } from '@/core/either';

import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments.repository';
import { Uploader } from '@/domain/forum/application/storage/uploader';
import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type-error';

type UploadAndCreateAttachmentUseCaseRequest = {
  body: Buffer;
  fileName: string;
  fileType: string;
};

type UploadAndCreateAttachmentUseCaseResponse = Either<
  InvalidAttachmentTypeError,
  {
    attachment: Attachment;
  }
>;

@Injectable()
export class UploadAndCreateAttachmentUseCase {
  constructor(
    private readonly attachmentsRepository: AttachmentsRepository,
    private readonly uploader: Uploader,
  ) {}

  async execute({
    body,
    fileName,
    fileType,
  }: UploadAndCreateAttachmentUseCaseRequest): Promise<UploadAndCreateAttachmentUseCaseResponse> {
    const isFileTypeValid = /^(image\/(jpeg|png))$|^application\/pdf$/.test(
      fileType,
    );

    if (!isFileTypeValid) {
      return left(new InvalidAttachmentTypeError(fileType));
    }

    const { url } = await this.uploader.upload({ body, fileName, fileType });

    const attachment = Attachment.create({
      title: fileName,
      url,
    });

    await this.attachmentsRepository.create(attachment);

    return right({
      attachment,
    });
  }
}
