import { Injectable } from '@nestjs/common';

import type { PaginationParams } from '@/core/repositories/pagination-params';

import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';

import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question);

    await this.prisma.question.create({
      data,
    });

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    );
  }

  async delete(question: Question) {
    await this.prisma.question.delete({
      where: {
        id: question.id.toValue(),
      },
    });
  }

  async findById(id: string) {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });

    return question ? PrismaQuestionMapper.toDomain(question) : null;
  }

  async findBySlug(slug: string) {
    const question = await this.prisma.question.findUnique({
      where: {
        slug,
      },
    });

    return question ? PrismaQuestionMapper.toDomain(question) : null;
  }

  async findManyRecent({ limit, page }: PaginationParams) {
    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: page * limit,
      take: limit,
    });

    return questions.map(PrismaQuestionMapper.toDomain);
  }

  async save(question: Question) {
    const data = PrismaQuestionMapper.toPrisma(question);

    await Promise.all([
      this.prisma.question.update({
        where: {
          id: data.id,
        },
        data,
      }),
      this.questionAttachmentsRepository.createMany(
        question.attachments.getNewItems(),
      ),
      this.questionAttachmentsRepository.deleteMany(
        question.attachments.getRemovedItems(),
      ),
    ]);
  }
}
