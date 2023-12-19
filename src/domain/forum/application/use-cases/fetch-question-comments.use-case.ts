import { Injectable } from '@nestjs/common';

import { right, type Either } from '@/core/either';

import { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';

type FetchQuestionCommentsUseCaseRequest = {
  questionId: string;
  limit: number;
  page: number;
};

type FetchQuestionCommentsUseCaseResponse = Either<
  void,
  {
    questionComments: QuestionComment[];
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
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        limit,
        page,
      });

    return right({
      questionComments,
    });
  }
}
