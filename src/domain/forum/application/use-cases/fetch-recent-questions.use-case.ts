import { right, type Either } from '@/core/either';
import type { Question } from '@/domain/forum/enterprise/entities/question';
import type { QuestionsRepository } from '../repositories/questions.repository';

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
