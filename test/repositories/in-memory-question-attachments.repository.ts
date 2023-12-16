import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import type { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment';

export class InMemoryQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  public items: QuestionAttachment[] = [];

  async deleteManyByQuestionId(questionId: string) {
    const questionAttachments = this.items.filter(
      (item) => item.questionId.toValue() !== questionId,
    );

    this.items = questionAttachments;
  }

  async findManyByQuestionId(questionId: string) {
    return this.items.filter(
      (item) => item.questionId.toValue() === questionId,
    );
  }
}
