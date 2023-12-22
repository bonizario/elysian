import { Injectable } from '@nestjs/common';

import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications.repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

import { PrismaNotificationMapper } from '@/infra/database/prisma/mappers/prisma-notification.mapper';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(notification: Notification) {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await this.prisma.notification.create({
      data,
    });
  }

  async findById(id: string) {
    const notification = await this.prisma.notification.findUnique({
      where: {
        id,
      },
    });

    return notification
      ? PrismaNotificationMapper.toDomain(notification)
      : null;
  }

  async save(notification: Notification) {
    const data = PrismaNotificationMapper.toPrisma(notification);

    await this.prisma.notification.update({
      where: {
        id: data.id,
      },
      data,
    });
  }
}
