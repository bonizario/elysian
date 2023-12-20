import { Injectable } from '@nestjs/common';

import type { PaginationParams } from '@/core/repositories/pagination-params';

import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id,
      },
    });

    return answerComment
      ? PrismaAnswerCommentMapper.toDomain(answerComment)
      : null;
  }

  async findManyByAnswerId(
    answerId: string,
    { limit, page }: PaginationParams,
  ) {
    const answerComments = await this.prisma.comment.findMany({
      where: {
        answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: page * limit,
      take: limit,
    });

    return answerComments.map(PrismaAnswerCommentMapper.toDomain);
  }

  async create(answerComment: AnswerComment) {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment);

    await this.prisma.comment.create({
      data,
    });
  }

  async delete(answerComment: AnswerComment) {
    await this.prisma.comment.delete({
      where: {
        id: answerComment.id.toValue(),
      },
    });
  }
}
