import { Injectable } from '@nestjs/common';

import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository';
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

import { PrismaAnswerAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-answer-attachment.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createMany(attachments: AnswerAttachment[]) {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaAnswerAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(attachments: AnswerAttachment[]) {
    if (attachments.length === 0) {
      return;
    }

    const attachmentsIds = attachments.map((attachment) =>
      attachment.id.toValue(),
    );

    await this.prisma.attachment.deleteMany({
      where: {
        id: {
          in: attachmentsIds,
        },
      },
    });
  }

  async deleteManyByAnswerId(answerId: string) {
    await this.prisma.attachment.deleteMany({
      where: {
        answerId,
      },
    });
  }

  async findManyByAnswerId(answerId: string) {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: {
        answerId,
      },
    });

    return answerAttachments.map(PrismaAnswerAttachmentMapper.toDomain);
  }
}
