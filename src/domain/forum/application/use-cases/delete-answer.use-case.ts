import { Injectable } from '@nestjs/common';

import { left, right, type Either } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';

type DeleteAnswerUseCaseRequest = {
  answerId: string;
  authorId: string;
};

type DeleteAnswerUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  void
>;

@Injectable()
export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    answerId,
    authorId,
  }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toValue()) {
      return left(new NotAllowedError());
    }

    await this.answersRepository.delete(answer);

    return right(undefined);
  }
}
