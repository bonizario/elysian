import { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface DomainEvent {
  getAggregateId(): UniqueEntityID;
  occurredAt: Date;
}
