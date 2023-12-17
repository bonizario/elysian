import type { Prisma, Comment as PrismaComment } from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

export class PrismaQuestionCommentMapper {
  static toDomain(raw: PrismaComment): QuestionComment {
    if (!raw.questionId) {
      throw new Error('QuestionComment must have a questionId');
    }

    return QuestionComment.create(
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

  static toPrisma(
    questionComment: QuestionComment,
  ): Prisma.CommentUncheckedCreateInput {
    return {
      id: questionComment.id.toValue(),
      authorId: questionComment.authorId.toValue(),
      questionId: questionComment.questionId.toValue(),
      content: questionComment.content,
      createdAt: questionComment.createdAt,
      updatedAt: questionComment.updatedAt,
    };
  }
}
