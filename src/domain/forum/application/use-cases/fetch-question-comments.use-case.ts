import { Injectable } from '@nestjs/common';

import { right, type Either } from '@/core/either';

import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

type FetchQuestionCommentsUseCaseRequest = {
  questionId: string;
  limit: number;
  page: number;
};

type FetchQuestionCommentsUseCaseResponse = Either<
  void,
  {
    comments: CommentWithAuthor[];
  }
>;

@Injectable()
export class FetchQuestionCommentsUseCase {
  constructor(
    private readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    limit,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const comments =
      await this.questionCommentsRepository.findManyByQuestionIdWithAuthor(
        questionId,
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
