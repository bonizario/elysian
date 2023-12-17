import type { Prisma, Answer as PrismaAnswer } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Answer } from '@/domain/forum/enterprise/entities/answer';

export class PrismaAnswerMapper {
  static toDomain(raw: PrismaAnswer): Answer {
    return Answer.create(
      {
        authorId: new UniqueEntityID(raw.authorId),
        questionId: new UniqueEntityID(raw.questionId),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(answer: Answer): Prisma.AnswerUncheckedCreateInput {
    return {
      id: answer.id.toValue(),
      authorId: answer.authorId.toValue(),
      questionId: answer.questionId.toValue(),
      content: answer.content,
      createdAt: answer.createdAt,
      updatedAt: answer.updatedAt,
    };
  }
}
