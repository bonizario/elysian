import { Injectable } from '@nestjs/common';

import { PaginationParams } from '@/core/repositories/pagination-params';
import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { Question } from '@/domain/forum/enterprise/entities/question';
import { PrismaQuestionMapper } from '../mappers/prisma-question.mapper';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaQuestionsRepository implements QuestionsRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(question: Question): Promise<void> {
    throw new Error('Method not implemented.');
  }

  delete(question: Question): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findById(id: string): Promise<Question | null> {
    const question = await this.prisma.question.findUnique({
      where: {
        id,
      },
    });

    return question ? PrismaQuestionMapper.toDomain(question) : null;
  }

  findBySlug(slug: string): Promise<Question | null> {
    throw new Error('Method not implemented.');
  }

  findManyRecent(params: PaginationParams): Promise<Question[]> {
    throw new Error('Method not implemented.');
  }

  save(question: Question): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
