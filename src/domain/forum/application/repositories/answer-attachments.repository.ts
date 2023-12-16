import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export abstract class AnswerAttachmentsRepository {
  abstract deleteManyByAnswerId(answerId: string): Promise<void>;

  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
}
