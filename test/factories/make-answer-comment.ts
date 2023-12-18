import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  AnswerComment,
  type AnswerCommentProps,
} from '@/domain/forum/enterprise/entities/answer-comment';

import { PrismaAnswerCommentMapper } from '@/infra/database/prisma/mappers/prisma-answer-comment.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export function makeAnswerComment(
  override: Partial<AnswerCommentProps> = {},
  id?: UniqueEntityID,
) {
  const answerComment = AnswerComment.create(
    {
      answerId: new UniqueEntityID(),
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return answerComment;
}

@Injectable()
export class AnswerCommentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaAnswerComment(data: Partial<AnswerCommentProps> = {}) {
    const answerComment = makeAnswerComment(data);

    await this.prisma.comment.create({
      data: PrismaAnswerCommentMapper.toPrisma(answerComment),
    });

    return answerComment;
  }
}
