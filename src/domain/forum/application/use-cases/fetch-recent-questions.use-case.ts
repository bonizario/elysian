import { Injectable } from '@nestjs/common';

import { right, type Either } from '@/core/either';

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';

type FetchRecentQuestionsUseCaseRequest = {
  limit: number;
  page: number;
};

type FetchRecentQuestionsUseCaseResponse = Either<
  void,
  {
    questions: Question[];
  }
>;

@Injectable()
export class FetchRecentQuestionsUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    limit,
    page,
  }: FetchRecentQuestionsUseCaseRequest): Promise<FetchRecentQuestionsUseCaseResponse> {
    const questions = await this.questionsRepository.findManyRecent({
      limit,
      page,
    });

    return right({
      questions,
    });
  }
}
