import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  Attachment,
  type AttachmentProps,
} from '@/domain/forum/enterprise/entities/attachment';

import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachment.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export function makeAttachment(
  override: Partial<AttachmentProps> = {},
  id?: UniqueEntityID,
) {
  const attachment = Attachment.create(
    {
      title: faker.lorem.sentence(),
      url: faker.internet.url(),
      ...override,
    },
    id,
  );

  return attachment;
}

@Injectable()
export class AttachmentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAttachment(data: Partial<AttachmentProps> = {}) {
    const attachment = makeAttachment(data);

    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    });

    return attachment;
  }
}
