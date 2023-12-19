import { Injectable } from '@nestjs/common';

import { left, right, type Either } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

type CommentOnAnswerUseCaseRequest = {
  answerId: string;
  authorId: string;
  content: string;
};

type CommentOnAnswerUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    answerComment: AnswerComment;
  }
>;

@Injectable()
export class CommentOnAnswerUseCase {
  constructor(
    private readonly answerCommentsRepository: AnswerCommentsRepository,
    private readonly answersRepository: AnswersRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);

    if (!answer) {
      return left(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      answerId: new UniqueEntityID(answerId),
      authorId: new UniqueEntityID(authorId),
      content,
    });

    await this.answerCommentsRepository.create(answerComment);

    return right({
      answerComment,
    });
  }
}
