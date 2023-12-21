import { faker } from '@faker-js/faker';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
    Notification,
    type NotificationProps,
} from '@/domain/notification/enterprise/entities/notification';

export function makeNotification(
  override?: Partial<NotificationProps>,
  id?: UniqueEntityID,
) {
  return Notification.create({
    recipientId: id ?? new UniqueEntityID(),
    content: faker.lorem.sentence(10),
    title: faker.lorem.sentence(4),
    createdAt: new Date(),
    ...override,
  });
}
