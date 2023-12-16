import type { NotificationsRepository } from '@/domain/notifications/application/repositories/notifications.repository';
import type { Notification } from '@/domain/notifications/enterprise/entities/notification';

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = [];

  async create(notification: Notification) {
    this.items.push(notification);
  }

  async findById(id: string) {
    return this.items.find((item) => item.id.toValue() === id) ?? null;
  }

  async save(notification: Notification) {
    const index = this.items.findIndex(
      (item) => item.id.toValue() === notification.id.toValue(),
    );

    this.items[index] = notification;
  }
}
