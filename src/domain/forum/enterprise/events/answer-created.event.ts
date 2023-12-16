import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
import type { DomainEvent } from '@/core/events/domain-event';
import type { Answer } from '../entities/answer';

export class AnswerCreatedEvent implements DomainEvent {
  public readonly answer: Answer;

  public readonly occurredAt: Date;

  public constructor(answer: Answer) {
    this.answer = answer;
    this.occurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.answer.id;
  }
}
