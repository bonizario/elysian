import { right, type Either } from '@/core/either';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import type { QuestionCommentsRepository } from '../repositories/question-comments.repository';

type FetchQuestionCommentsUseCaseRequest = {
  questionId: string;
  page: number;
};

type FetchQuestionCommentsUseCaseResponse = Either<
  void,
  {
    questionComments: QuestionComment[];
  }
>;

export class FetchQuestionCommentsUseCase {
  constructor(
    private readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    questionId,
    page,
  }: FetchQuestionCommentsUseCaseRequest): Promise<FetchQuestionCommentsUseCaseResponse> {
    const questionComments =
      await this.questionCommentsRepository.findManyByQuestionId(questionId, {
        page,
      });

    return right({
      questionComments,
    });
  }
}
