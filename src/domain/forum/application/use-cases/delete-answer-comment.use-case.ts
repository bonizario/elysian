import { left, right, type Either } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import { AnswerCommentsRepository } from '../repositories/answer-comments.repository';

type DeleteAnswerCommentUseCaseRequest = {
  answerCommentId: string;
  authorId: string;
};

type DeleteAnswerCommentUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  void
>;

export class DeleteAnswerCommentUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    answerCommentId,
    authorId,
  }: DeleteAnswerCommentUseCaseRequest): Promise<DeleteAnswerCommentUseCaseResponse> {
    const answerComment =
      await this.answerCommentsRepository.findById(answerCommentId);

    if (!answerComment) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== answerComment.authorId.toValue()) {
      return left(new NotAllowedError());
    }

    await this.answerCommentsRepository.delete(answerComment);

    return right(undefined);
  }
}
