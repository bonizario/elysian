import { Injectable } from '@nestjs/common';

import { DomainEvents } from '@/core/events/domain-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';

import { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

import { PrismaAnswerMapper } from '@/infra/database/prisma/mappers/prisma-answer.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaAnswersRepository implements AnswersRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer) {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await this.prisma.answer.create({
      data,
    });

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer) {
    await this.prisma.answer.delete({
      where: {
        id: answer.id.toValue(),
      },
    });
  }

  async findById(id: string) {
    const answer = await this.prisma.answer.findUnique({
      where: {
        id,
      },
    });

    return answer ? PrismaAnswerMapper.toDomain(answer) : null;
  }

  async findManyByQuestionId(
    questionId: string,
    { limit, page }: PaginationParams,
  ) {
    const answers = await this.prisma.answer.findMany({
      where: {
        questionId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: page * limit,
      take: limit,
    });

    return answers.map(PrismaAnswerMapper.toDomain);
  }

  async save(answer: Answer) {
    const data = PrismaAnswerMapper.toPrisma(answer);

    await Promise.all([
      this.prisma.answer.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.answerAttachmentsRepository.createMany(
        answer.attachments.getNewItems(),
      ),
      this.answerAttachmentsRepository.deleteMany(
        answer.attachments.getRemovedItems(),
      ),
    ]);

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
