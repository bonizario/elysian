import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  AnswerAttachment,
  type AnswerAttachmentProps,
} from '@/domain/forum/enterprise/entities/answer-attachment';

import { PrismaService } from '@/infra/database/prisma/prisma.service';

export function makeAnswerAttachment(
  override: Partial<AnswerAttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const answerAttachment = AnswerAttachment.create(
    {
      answerId: new UniqueEntityID(),
      attachmentId: new UniqueEntityID(),
      ...override,
    },
    id,
  );

  return answerAttachment;
}

@Injectable()
export class AnswerAttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAnswerAttachment(data: Partial<AnswerAttachmentProps> = {}) {
    const answerAttachment = makeAnswerAttachment(data);

    await this.prisma.attachment.update({
      where: {
        id: answerAttachment.attachmentId.toValue(),
      },
      data: {
        answerId: answerAttachment.answerId.toValue(),
      },
    });

    return answerAttachment;
  }
}
