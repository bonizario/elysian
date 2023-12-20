import { DomainEvents } from '@/core/events/domain-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';

import type { AnswerAttachmentsRepository } from '@/domain/forum/application/repositories/answer-attachments.repository';
import type { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import type { Answer } from '@/domain/forum/enterprise/entities/answer';

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = [];

  constructor(
    private answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async create(answer: Answer) {
    this.items.push(answer);

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }

  async delete(answer: Answer) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === answer.id.toValue(),
    );

    this.items.splice(itemIndex, 1);

    await this.answerAttachmentsRepository.deleteManyByAnswerId(
      answer.id.toValue(),
    );
  }

  async findById(id: string) {
    return this.items.find((item) => item.id.toValue() === id) ?? null;
  }

  async findManyByQuestionId(
    questionId: string,
    { limit, page }: PaginationParams,
  ) {
    return this.items
      .filter((item) => item.questionId.toValue() === questionId)
      .slice(page * limit, (page + 1) * limit);
  }

  async save(answer: Answer) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === answer.id.toValue(),
    );

    this.items[itemIndex] = answer;

    await this.answerAttachmentsRepository.createMany(
      answer.attachments.getNewItems(),
    );

    await this.answerAttachmentsRepository.deleteMany(
      answer.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(answer.id);
  }
}
