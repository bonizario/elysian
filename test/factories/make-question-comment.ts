import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  QuestionComment,
  type QuestionCommentProps,
} from '@/domain/forum/enterprise/entities/question-comment';

import { PrismaQuestionCommentMapper } from '@/infra/database/prisma/mappers/prisma-question-comment.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export function makeQuestionComment(
  override: Partial<QuestionCommentProps> = {},
  id?: UniqueEntityID,
) {
  const questionComment = QuestionComment.create(
    {
      authorId: new UniqueEntityID(),
      questionId: new UniqueEntityID(),
      content: faker.lorem.text(),
      ...override,
    },
    id,
  );

  return questionComment;
}

@Injectable()
export class QuestionCommentFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaQuestionComment(data: Partial<QuestionCommentProps> = {}) {
    const questionComment = makeQuestionComment(data);

    await this.prisma.comment.create({
      data: PrismaQuestionCommentMapper.toPrisma(questionComment),
    });

    return questionComment;
  }
}
