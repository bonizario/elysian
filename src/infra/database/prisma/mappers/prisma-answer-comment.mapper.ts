import type { Prisma, Comment as PrismaComment } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export class PrismaAnswerCommentMapper {
  static toDomain(raw: PrismaComment): AnswerComment {
    if (!raw.answerId) {
      throw new Error('AnswerComment must have an answerId');
    }

    return AnswerComment.create(
      {
        answerId: new UniqueEntityID(raw.answerId),
        authorId: new UniqueEntityID(raw.authorId),
        content: raw.content,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    answerComment: AnswerComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: answerComment.id.toValue(),
      answerId: answerComment.answerId.toValue(),
      authorId: answerComment.authorId.toValue(),
      content: answerComment.content,
      createdAt: answerComment.createdAt,
      updatedAt: answerComment.updatedAt,
    };
  }
}
