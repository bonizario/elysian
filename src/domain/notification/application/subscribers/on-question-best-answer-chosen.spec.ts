import type { MockInstance } from 'vitest';

import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import {
    SendNotificationUseCase,
    type SendNotificationUseCaseRequest,
    type SendNotificationUseCaseResponse,
} from '@/domain/notification/application/use-cases/send-notification.use-case';

import { makeAnswer } from '@/test/factories/make-answer';
import { makeQuestion } from '@/test/factories/make-question';
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers.repository';
import { InMemoryAttachmentsRepository } from '@/test/repositories/in-memory-attachments.repository';
import { InMemoryNotificationsRepository } from '@/test/repositories/in-memory-notifications.repository';
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions.repository';
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students.repository';
import { waitFor } from '@/test/utils/wait-for';

import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryNotificationsRepository: InMemoryNotificationsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sendNotificationUseCase: SendNotificationUseCase;
let sendNotificationExecuteSpy: MockInstance<
  [SendNotificationUseCaseRequest],
  Promise<SendNotificationUseCaseResponse>
>;

describe('On Question Best Answer Chosen', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();

    inMemoryNotificationsRepository = new InMemoryNotificationsRepository();

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryAttachmentsRepository,
      inMemoryQuestionAttachmentsRepository,
      inMemoryStudentsRepository,
    );

    sendNotificationUseCase = new SendNotificationUseCase(
      inMemoryNotificationsRepository,
    );

    sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute');

    new OnQuestionBestAnswerChosen(
      inMemoryAnswersRepository,
      sendNotificationUseCase,
    );
  });

  it('should send a notification when a question has a new best answer chosen', async () => {
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    const answer = makeAnswer({ questionId: question.id });

    await inMemoryAnswersRepository.create(answer);

    question.bestAnswerId = answer.id;

    await inMemoryQuestionsRepository.save(question);

    await waitFor(() => expect(sendNotificationExecuteSpy).toHaveBeenCalled());
  });

  it('should not send a notification when setting the same best answer id', async () => {
    const question = makeQuestion();

    await inMemoryQuestionsRepository.create(question);

    const answer = makeAnswer({ questionId: question.id });

    await inMemoryAnswersRepository.create(answer);

    question.bestAnswerId = answer.id;

    await inMemoryQuestionsRepository.save(question);

    question.bestAnswerId = new UniqueEntityID(answer.id.toValue());

    await inMemoryQuestionsRepository.save(question);

    await waitFor(() =>
      expect(sendNotificationExecuteSpy).toHaveBeenCalledOnce(),
    );
  });
});
