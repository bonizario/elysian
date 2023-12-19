import { Injectable } from '@nestjs/common';

import { right, type Either } from '@/core/either';

import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

type FetchAnswerCommentsUseCaseRequest = {
  answerId: string;
  limit: number;
  page: number;
};

type FetchAnswerCommentsUseCaseResponse = Either<
  void,
  {
    answerComments: AnswerComment[];
  }
>;

@Injectable()
export class FetchAnswerCommentsUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    answerId,
    limit,
    page,
  }: FetchAnswerCommentsUseCaseRequest): Promise<FetchAnswerCommentsUseCaseResponse> {
    const answerComments =
      await this.answerCommentsRepository.findManyByAnswerId(answerId, {
        limit,
        page,
      });

    return right({
      answerComments,
    });
  }
}
