import { DomainEvents } from '@/core/events/domain-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';

import type { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments.repository';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private readonly inMemoryQuestionAttachmentsRepository: QuestionAttachmentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question);

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === question.id.toValue(),
    );

    this.items.splice(itemIndex, 1);

    await this.inMemoryQuestionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toValue(),
    );
  }

  async findById(id: string) {
    return this.items.find((item) => item.id.toValue() === id) ?? null;
  }

  async findBySlug(slug: string) {
    return this.items.find((item) => item.slug.value === slug) ?? null;
  }

  async findManyRecent({ limit, page }: PaginationParams) {
    return this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(page * limit, (page + 1) * limit);
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === question.id.toValue(),
    );

    this.items[itemIndex] = question;

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}
