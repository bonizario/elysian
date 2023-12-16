import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export interface QuestionAttachmentsRepository {
  deleteManyByQuestionId(questionId: string): Promise<void>;

  findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
}
