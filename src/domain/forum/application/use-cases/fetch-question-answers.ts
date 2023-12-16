import { right, type Either } from '@/core/either';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';
import type { AnswersRepository } from '../repositories//answers-repository';

type FetchQuestionAnswersUseCaseRequest = {
  questionId: string;
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
    page,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(
      questionId,
      {
        page,
      },
    );

    return right({
      answers,
    });
  }
}
