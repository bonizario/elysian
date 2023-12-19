import {
  BadRequestException,
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  ParseFilePipe,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { InvalidAttachmentTypeError } from '@/domain/forum/application/use-cases/errors/invalid-attachment-type-error';
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment.use-case';

const fileValidationPipe = new ParseFilePipe({
  validators: [
    new MaxFileSizeValidator({
      maxSize: 1024 * 1024 * 2, // 2 MiB
    }),
    new FileTypeValidator({
      fileType: '.(png|jpg|jpeg|pdf)',
    }),
  ],
});

@Controller('/attachments')
export class UploadAttachmentController {
  constructor(
    private readonly uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async handle(@UploadedFile(fileValidationPipe) file: Express.Multer.File) {
    const result = await this.uploadAndCreateAttachment.execute({
      body: file.buffer,
      fileName: file.originalname,
      fileType: file.mimetype,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case InvalidAttachmentTypeError:
          throw new UnprocessableEntityException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }

    const attachmentId = result.value.attachment.id.toValue();

    return {
      attachmentId,
    };
  }
}
