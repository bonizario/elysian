import type { Prisma, Attachment as PrismaAttachment } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class PrismaAnswerAttachmentMapper {
  static toDomain(raw: PrismaAttachment): AnswerAttachment {
    if (!raw.answerId) {
      throw new Error('AnswerAttachment must have an answerId');
    }

    return AnswerAttachment.create(
      {
        answerId: new UniqueEntityID(raw.answerId),
        attachmentId: new UniqueEntityID(raw.id),
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrismaUpdateMany(
    attachments: AnswerAttachment[],
  ): Prisma.AttachmentUpdateManyArgs {
    const attachmentsIds = attachments.map((attachment) =>
      attachment.attachmentId.toValue(),
    );

    const answerId = attachments[0].answerId.toValue();

    return {
      where: {
        id: {
          in: attachmentsIds,
        },
      },
      data: {
        answerId,
      },
    };
  }
}
