import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository';
import type { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment';

export class InMemoryAnswerAttachmentsRepository
  implements AnswerAttachmentsRepository
{
  public items: AnswerAttachment[] = [];

  async createMany(attachments: AnswerAttachment[]) {
    this.items.push(...attachments);
  }

  async deleteMany(attachments: AnswerAttachment[]) {
    const answerAttachments = this.items.filter(
      (item) => !attachments.some((attachment) => attachment.equals(item)),
    );

    this.items = answerAttachments;
  }

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
