import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
import type { DomainEvent } from '@/core/events/domain-event';
import type { Question } from '../entities/question';

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  readonly bestAnswerId: UniqueEntityID;

  readonly question: Question;

  readonly occurredAt: Date;

  constructor(question: Question, bestAnswerId: UniqueEntityID) {
    this.bestAnswerId = bestAnswerId;
    this.question = question;
    this.occurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.question.id;
  }
}
