import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers.repository';

import { CreateAnswerUseCase } from './create-answer.use-case';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: CreateAnswerUseCase;

describe('Create Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    sut = new CreateAnswerUseCase(inMemoryAnswersRepository);
  });

  it('should be able to create an answer', async () => {
    const result = await sut.execute({
      attachmentsIds: ['attachment-1', 'attachment-2'],
      questionId: 'question-1',
      instructorId: 'instructor-1',
      content: 'Example answer content',
    });

    const answer = inMemoryAnswersRepository.items[0];

    expect(result.isRight()).toBe(true);
    expect(answer).toEqual(result.value?.answer);
    expect(answer?.attachments.currentItems).toHaveLength(2);
    expect(answer?.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-2'),
      }),
    ]);
  });
});
