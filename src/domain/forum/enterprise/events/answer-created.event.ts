import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
import type { DomainEvent } from '@/core/events/domain-event';

import type { Answer } from '@/domain/forum/enterprise/entities/answer';

export class AnswerCreatedEvent implements DomainEvent {
  readonly answer: Answer;

  readonly occurredAt: Date;

  constructor(answer: Answer) {
    this.answer = answer;
    this.occurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.answer.id;
  }
}
