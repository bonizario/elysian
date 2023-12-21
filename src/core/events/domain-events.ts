import { AggregateRoot } from '@/core/entities/aggregate-root';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import type { DomainEvent } from './domain-event';

type DomainEventCallback<T extends DomainEvent> = (event: T) => void;

export class DomainEvents {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private static handlersMap: Record<string, DomainEventCallback<any>[]> = {};

  private static markedAggregates: AggregateRoot<unknown>[] = [];

  static clearHandlers() {
    this.handlersMap = {};
  }

  static clearMarkedAggregates() {
    this.markedAggregates = [];
  }

  static dispatchEventsForAggregate(id: UniqueEntityID) {
    const aggregate = this.findMarkedAggregateByID(id);

    if (aggregate) {
      this.dispatchAggregateEvents(aggregate);
      aggregate.clearEvents();
      this.removeAggregateFromMarkedDispatchList(aggregate);
    }
  }

  static markAggregateForDispatch(aggregate: AggregateRoot<unknown>) {
    const aggregateFound = !!this.findMarkedAggregateByID(aggregate.id);

    if (!aggregateFound) {
      this.markedAggregates.push(aggregate);
    }
  }

  static register<T extends DomainEvent>(
    callback: DomainEventCallback<T>,
    eventClassName: string,
  ) {
    const wasEventRegisteredBefore = eventClassName in this.handlersMap;

    if (!wasEventRegisteredBefore) {
      this.handlersMap[eventClassName] = [];
    }

    this.handlersMap[eventClassName].push(callback);
  }

  private static dispatch(event: DomainEvent) {
    const eventClassName = event.constructor.name;

    const isEventRegistered = eventClassName in this.handlersMap;

    if (isEventRegistered) {
      const handlers = this.handlersMap[eventClassName];

      for (const handler of handlers) {
        handler(event);
      }
    }
  }

  private static dispatchAggregateEvents(aggregate: AggregateRoot<unknown>) {
    aggregate.domainEvents.forEach((event: DomainEvent) =>
      this.dispatch(event),
    );
  }

  private static findMarkedAggregateByID(
    id: UniqueEntityID,
  ): AggregateRoot<unknown> | undefined {
    return this.markedAggregates.find((aggregate) => aggregate.id.equals(id));
  }

  private static removeAggregateFromMarkedDispatchList(
    aggregate: AggregateRoot<unknown>,
  ) {
    const index = this.markedAggregates.findIndex((a) => a.equals(aggregate));

    this.markedAggregates.splice(index, 1);
  }
}
