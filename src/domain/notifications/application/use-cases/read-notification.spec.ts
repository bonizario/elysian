import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { makeNotification } from '@/test/factories/make-notification';
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications.repository';
import { ReadNotificationUseCase } from './read-notification';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: ReadNotificationUseCase;

describe('Read Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sut = new ReadNotificationUseCase(inMemoryNotificationsRepository);
  });

  it('should be able to read a notification', async () => {
    const notification = makeNotification();

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toValue(),
      recipientId: notification.recipientId.toValue(),
    });

    const updatedNotification = inMemoryNotificationsRepository.items[0];

    expect(result.isRight()).toBe(true);
    expect(updatedNotification?.readAt).toEqual(expect.any(Date));
  });

  it('should not be able to read a notification from another user', async () => {
    const notification = makeNotification(
      {
        recipientId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('notification-1'),
    );

    await inMemoryNotificationsRepository.create(notification);

    const result = await sut.execute({
      notificationId: notification.id.toValue(),
      recipientId: 'author-2',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryNotificationsRepository.items[0]).toMatchObject({
      content: notification.content,
      title: notification.title,
    });
  });
});
