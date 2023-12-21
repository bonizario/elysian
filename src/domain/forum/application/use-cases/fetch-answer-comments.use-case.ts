import { Injectable } from '@nestjs/common';

import { right, type Either } from '@/core/either';

import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import type { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

type FetchAnswerCommentsUseCaseRequest = {
  answerId: string;
  limit: number;
  page: number;
};

type FetchAnswerCommentsUseCaseResponse = Either<
  void,
  {
    comments: CommentWithAuthor[];
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
    const comments =
      await this.answerCommentsRepository.findManyByAnswerIdWithAuthor(
        answerId,
        {
          limit,
          page,
        },
      );

    return right({
      comments,
    });
  }
}
