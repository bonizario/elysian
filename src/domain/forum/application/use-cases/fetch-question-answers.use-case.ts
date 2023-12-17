import { right, type Either } from '@/core/either';

import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

type FetchQuestionAnswersUseCaseRequest = {
  questionId: string;
  limit: number;
  page: number;
};

type FetchQuestionAnswersUseCaseResponse = Either<
  void,
  {
    answers: Answer[];
  }
>;

export class FetchQuestionAnswersUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    questionId,
    limit,
    page,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        limit,
        page,
      },
    );

    return right({
      answers,
    });
  }
}
