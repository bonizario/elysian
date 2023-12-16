import { left, right, type Either } from '@/core/either';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { Question } from '@/domain/forum/enterprise/entities/question';
import type { AnswersRepository } from '../repositories/answers.repository';
import type { QuestionsRepository } from '../repositories/questions.repository';

type ChooseQuestionBestAnswerUseCaseRequest = {
  answerId: string;
  authorId: string;
};

type ChooseQuestionBestAnswerUseCaseResponse = Either<
  ResourceNotFoundError | NotAllowedError,
  {
    question: Question;
  }
>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const question = await this.questionsRepository.findById(
      answer.questionId.toValue(),
    );

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toValue()) {
      return left(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;

    await this.questionsRepository.save(question);

    return right({
      question,
    });
  }
}
