import { left, right, type Either } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';
import type { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';
import { QuestionAttachmentList } from '@/domain/forum/enterprise/entities/question-attachment-list';
import { QuestionAttachmentsRepository } from '../repositories/question-attachments.repository';
import { QuestionsRepository } from '../repositories/questions.repository';

type EditQuestionUseCaseRequest = {
  attachmentsIds: string[];
  authorId: string;
  questionId: string;
  content: string;
  title: string;
};

type EditQuestionUseCaseResponse = Either<
  NotAllowedError | ResourceNotFoundError,
  {
    question: Question;
  }
>;

export class EditQuestionUseCase {
  constructor(
    private readonly questionAttachmentsRepository: QuestionAttachmentsRepository,
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    attachmentsIds,
    authorId,
    questionId,
    content,
    title,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toValue()) {
      return left(new NotAllowedError());
    }

    const currentQuestionAttachments =
      await this.questionAttachmentsRepository.findManyByQuestionId(questionId);

    const questionAttachmentList = new QuestionAttachmentList(
      currentQuestionAttachments,
    );

    const questionAttachments = attachmentsIds.map((attachmentId) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityID(attachmentId),
        questionId: question.id,
      }),
    );

    questionAttachmentList.update(questionAttachments);

    question.attachments = questionAttachmentList;
    question.content = content;
    question.title = title;

    await this.questionsRepository.save(question);

    return right({
      question,
    });
  }
}
