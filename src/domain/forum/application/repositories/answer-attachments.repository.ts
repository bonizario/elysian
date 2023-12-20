import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export abstract class AnswerAttachmentsRepository {
  abstract createMany(attachments: AnswerAttachment[]): Promise<void>;

  abstract deleteMany(attachments: AnswerAttachment[]): Promise<void>;

  abstract deleteManyByAnswerId(answerId: string): Promise<void>;

  abstract findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]>;
}
