import { vi } from 'vitest';

import { AggregateRoot } from '@/core/entities/aggregate-root';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
import type { DomainEvent } from '@/core/events/domain-event';
import { DomainEvents } from '@/core/events/domain-events';

class CustomAggregateCreated implements DomainEvent {
  readonly aggregate: CustomAggregate;

  readonly occurredAt: Date;

  constructor(aggregate: CustomAggregate) {
    this.aggregate = aggregate;
    this.occurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityID {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create() {
    const aggregate = new CustomAggregate(null);

    aggregate.addDomainEvent(new CustomAggregateCreated(aggregate));

    return aggregate;
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', async () => {
    const callbackSpy = vi.fn();

    // Subscriber registered (listening to the "aggregate created" event)
    DomainEvents.register(callbackSpy, CustomAggregateCreated.name);

    // Creating a response but WITHOUT saving it in the database
    const aggregate = CustomAggregate.create();

    // Ensuring that the event was created but NOT triggered
    expect(aggregate.domainEvents).toHaveLength(1);

    // Saving the response in the database will trigger the event
    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    // The subscriber listens for the event and executes the necessary actions
    expect(callbackSpy).toHaveBeenCalled();

    expect(aggregate.domainEvents).toHaveLength(0);
  });
});
