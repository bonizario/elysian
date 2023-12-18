import { Injectable } from '@nestjs/common';

import { right, type Either } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import { Answer } from '@/domain/forum/enterprise/entities/answer';
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';
import { AnswerAttachmentList } from '@/domain/forum/enterprise/entities/answer-attachment-list';

type CreateAnswerUseCaseRequest = {
  attachmentsIds: string[];
  authorId: string;
  questionId: string;
  content: string;
};

type CreateAnswerUseCaseResponse = Either<
  void,
  {
    answer: Answer;
  }
>;

@Injectable()
export class CreateAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    attachmentsIds,
    authorId,
    questionId,
    content,
  }: CreateAnswerUseCaseRequest): Promise<CreateAnswerUseCaseResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    });

    const answerAttachments = attachmentsIds.map((attachmentId) =>
      AnswerAttachment.create({
        answerId: answer.id,
        attachmentId: new UniqueEntityID(attachmentId),
      }),
    );

    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answersRepository.create(answer);

    return right({
      answer,
    });
  }
}
