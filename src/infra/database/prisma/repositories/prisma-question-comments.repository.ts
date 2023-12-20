import { Injectable } from '@nestjs/common';

import type { PaginationParams } from '@/core/repositories/pagination-params';

import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const questionComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    return questionComment
      ? PrismaQuestionCommentMapper.toDomain(questionComment)
      : null;
  }

  async findManyByQuestionId(
    questionId: string,
    { limit, page }: PaginationParams,
  ) {
    const questionComments = await this.prisma.comment.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: page * limit,
      take: limit,
    });

    return questionComments.map(PrismaQuestionCommentMapper.toDomain);
  }

  async create(questionComment: QuestionComment) {
    const data = PrismaQuestionCommentMapper.toPrisma(questionComment);

    await this.prisma.comment.create({
      data,
    });
  }

  async delete(questionComment: QuestionComment) {
    await this.prisma.comment.delete({
      where: {
        id: questionComment.id.toValue(),
      },
    });
  }
}
