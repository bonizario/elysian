import type {
  Prisma,
  Notification as PrismaNotification,
} from '@prisma/client';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { Notification } from '@/domain/notification/enterprise/entities/notification';

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotification): Notification {
    return Notification.create(
      {
        recipientId: new UniqueEntityID(raw.recipientId),
        content: raw.content,
        title: raw.title,
        createdAt: raw.createdAt,
        readAt: raw.readAt,
      },
      new UniqueEntityID(raw.id),
    );
  }

  static toPrisma(
    notification: Notification,
  ): Prisma.NotificationUncheckedCreateInput {
    return {
      id: notification.id.toValue(),
      recipientId: notification.recipientId.toValue(),
      content: notification.content,
      title: notification.title,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    };
  }
}
