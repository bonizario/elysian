import type { Prisma } from '@prisma/client';

import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

export class PrismaAttachmentMapper {
  static toPrisma(
    attachment: Attachment,
  ): Prisma.AttachmentUncheckedCreateInput {
    return {
      id: attachment.id.toValue(),
      title: attachment.title,
      url: attachment.url,
    };
  }
}
