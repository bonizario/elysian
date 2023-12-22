import { faker } from '@faker-js/faker';
import { Injectable } from '@nestjs/common';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
  Notification,
  type NotificationProps,
} from '@/domain/notification/enterprise/entities/notification';

import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

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

@Injectable()
export class NotificationFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaNotification(
    data: Partial<NotificationProps> = {},
  ): Promise<Notification> {
    const notification = makeNotification(data);

    await this.prisma.notification.create({
      data: PrismaNotificationMapper.toPrisma(notification),
    });

    return notification;
  }
}
