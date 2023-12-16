import type { Prisma, Question as PrismaQuestion } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        title: raw.title,
        content: raw.content,
        authorId: new UniqueEntityID(raw.authorId),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        slug: Slug.create(raw.slug),
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(raw: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: raw.id.toValue(),
      authorId: raw.authorId.toValue(),
      bestAnswerId: raw.bestAnswerId?.toValue(),
      content: raw.content,
      slug: raw.slug.value,
      title: raw.title,
      createdAt: raw.createdAt,
      updatedAt: raw.updatedAt,
    };
  }
}