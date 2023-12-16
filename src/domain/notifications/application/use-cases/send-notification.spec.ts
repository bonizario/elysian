import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications-repository';
import { SendNotificationUseCase } from './send-notification';

let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let sut: SendNotificationUseCase;

describe('Send Notification', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    sut = new SendNotificationUseCase(inMemoryNotificationsRepository);
  });

  it('should be able to create a notification', async () => {
    const result = await sut.execute({
      recipientId: 'recipient-1',
      content: 'Example notification content',
      title: 'Example notification',
    });

    const notification = inMemoryNotificationsRepository.items[0];

    expect(result.isRight()).toBe(true);
    expect(notification).toEqual(result.value?.notification);
  });
});
