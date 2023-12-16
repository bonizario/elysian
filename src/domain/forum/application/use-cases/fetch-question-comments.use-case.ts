import { right, type Either } from '@/core/either';
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { QuestionCommentsRepository } from '../repositories/question-comments.repository';

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
