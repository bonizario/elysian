import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export abstract class QuestionAttachmentsRepository {
  abstract deleteManyByQuestionId(questionId: string): Promise<void>;

  abstract findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]>;
}
