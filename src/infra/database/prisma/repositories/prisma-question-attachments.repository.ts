import { Injectable } from '@nestjs/common';

import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

import { PrismaQuestionAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-question-attachment.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async createMany(attachments: QuestionAttachment[]) {
    if (attachments.length === 0) {
      return;
    }

    const data = PrismaQuestionAttachmentMapper.toPrismaUpdateMany(attachments);

    await this.prisma.attachment.updateMany(data);
  }

  async deleteMany(attachments: QuestionAttachment[]) {
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

  async findManyByQuestionId(questionId: string) {
    const questionAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    });

    return questionAttachments.map(PrismaQuestionAttachmentMapper.toDomain);
  }

  async deleteManyByQuestionId(questionId: string) {
    await this.prisma.attachment.deleteMany({
      where: {
        questionId,
      },
    });
  }
}
