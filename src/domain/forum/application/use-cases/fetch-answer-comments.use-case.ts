import { right, type Either } from '@/core/either';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { AnswerCommentsRepository } from '../repositories/answer-comments.repository';

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
