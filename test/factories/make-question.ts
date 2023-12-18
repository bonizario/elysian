import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  Question,
  type QuestionProps,
} from '@/domain/forum/enterprise/entities/question';

import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

export function makeQuestion(
  override: Partial<QuestionProps> = {},
  id?: UniqueEntityID,
) {
  const question = Question.create(
    {
      authorId: new UniqueEntityID(),
      content: faker.lorem.text(),
      title: faker.lorem.sentence(),
      ...override,
    },
    id,
  );

  return question;
}

@Injectable()
export class QuestionFactory {
  constructor(private readonly prisma: PrismaService) {}

  async makePrismaQuestion(data: Partial<QuestionProps> = {}) {
    const question = makeQuestion(data);

    await this.prisma.question.create({
      data: PrismaQuestionMapper.toPrisma(question),
    });

    return question;
  }
}
