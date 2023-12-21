import { Injectable } from '@nestjs/common';

import { right, type Either } from '@/core/either';
import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { NotificationsRepository } from '@/domain/notification/application/repositories/notifications.repository';
import { Notification } from '@/domain/notification/enterprise/entities/notification';

export type SendNotificationUseCaseRequest = {
  recipientId: string;
  content: string;
  title: string;
};

export type SendNotificationUseCaseResponse = Either<
  void,
  {
    notification: Notification;
  }
>;

@Injectable()
export class SendNotificationUseCase {
  constructor(
    private readonly notificationsRepository: NotificationsRepository,
  ) {}

  async execute({
    recipientId,
    content,
    title,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityID(recipientId),
      content,
      title,
    });

    await this.notificationsRepository.create(notification);

    return right({
      notification,
    });
  }
}
