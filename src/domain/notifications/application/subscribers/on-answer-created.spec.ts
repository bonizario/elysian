import type { MockInstance } from 'vitest';

import {
  SendNotificationUseCase,
  type SendNotificationUseCaseRequest,
  type SendNotificationUseCaseResponse,
} from '@/domain/notifications/application/use-cases/send-notification';
import { makeAnswer } from '@/test/factories/make-answer';
import { makeQuestion } from '@/test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers.repository';
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications.repository';
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions.repository';
import { waitFor } from '@/test/utils/wait-for';
import { OnAnswerCreated } from './on-answer-created';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe('On Answer Created', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase);
  });

  it('should send a notification when an answer is created', async () => {
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    const answer = makeAnswer({ questionId: question.id });

    await inMemoryAnswersRepository.create(answer);

    await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled());
  });
});
