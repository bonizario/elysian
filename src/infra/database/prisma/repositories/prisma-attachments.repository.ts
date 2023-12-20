import { Injectable } from '@nestjs/common';

import type { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments.repository';
import type { Attachment } from '@/domain/forum/enterprise/entities/attachment';

import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(attachment: Attachment) {
    const data = PrismaAttachmentMapper.toPrisma(attachment);

    await this.prisma.attachment.create({
      data,
    });
  }
}
