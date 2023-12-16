import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository';
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = [];

  async deleteManyByAnswerId(answerId: string) {
    const answerAttachments = this.items.filter(
      (item) => item.answerId.toValue() !== answerId,
    );

    this.items = answerAttachments;
  }

  async findManyByAnswerId(answerId: string) {
    return this.items.filter((item) => item.answerId.toValue() === answerId);
  }
}
