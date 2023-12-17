import type { Prisma, Question as PrismaQuestion } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Question } from '@/domain/forum/enterprise/entities/question';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

export class PrismaQuestionMapper {
  static toDomain(raw: PrismaQuestion): Question {
    return Question.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        bestAnswerId: raw.bestAnswerId
          ? new UniqueEntityID(raw.bestAnswerId)
          : null,
        content: raw.content,
        slug: Slug.create(raw.slug),
        title: raw.title,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(question: Question): Prisma.QuestionUncheckedCreateInput {
    return {
      id: question.id.toValue(),
      authorId: question.authorId.toValue(),
      bestAnswerId: question.bestAnswerId?.toValue(),
      content: question.content,
      slug: question.slug.value,
      title: question.title,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}
