import type {
  Attachment as PrismaAttachment,
  Question as PrismaQuestion,
  User as PrismaUser,
} from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

import { PrismaAttachmentMapper } from './prisma-attachment.mapper';

type PrismaQuestionDetails = PrismaQuestion & {
  author: PrismaUser;
  attachments: PrismaAttachment[];
};

export class PrismaQuestionDetailsMapper {
  static toDomain(raw: PrismaQuestionDetails): QuestionDetails {
    return QuestionDetails.create({
      authorId: new UniqueEntityID(raw.authorId),
      bestAnswerId: raw.bestAnswerId
        ? new UniqueEntityID(raw.bestAnswerId)
        : null,
      questionId: new UniqueEntityID(raw.id),
      attachments: raw.attachments.map(PrismaAttachmentMapper.toDomain),
      authorName: raw.author.name,
      content: raw.content,
      slug: Slug.create(raw.slug),
      title: raw.title,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    });
  }
}
