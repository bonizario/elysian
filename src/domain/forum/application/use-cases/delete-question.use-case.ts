import { left, right, type Either } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { QuestionsRepository } from '../repositories/questions.repository';

type DeleteQuestionUseCaseRequest = {
  authorId: string;
  questionId: string;
};

type DeleteQuestionUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  void
>;

export class DeleteQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toValue()) {
      return left(new NotAllowedError());
    }

    await this.questionsRepository.delete(question);

    return right(undefined);
  }
}
