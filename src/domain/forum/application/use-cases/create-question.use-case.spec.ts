import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { InMemoryAttachmentsRepository } from '@/test/repositories/in-memory-attachments.repository';
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions.repository';
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students.repository';

import { CreateQuestionUseCase } from './create-question.use-case';

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: CreateQuestionUseCase;

describe('Create Question', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository();

    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryAttachmentsRepository,
      inMemoryQuestionAttachmentsRepository,
      inMemoryStudentsRepository,
    );

    sut = new CreateQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to create a question', async () => {
    const result = await sut.execute({
      attachmentsIds: ['attachment-1', 'attachment-2'],
      authorId: 'author-1',
      content: 'Example question content',
      title: 'Example question',
    });

    const question = inMemoryQuestionsRepository.items[0];

    expect(result.isRight()).toBe(true);
    expect(question).toEqual(result.value?.question);
    expect(question?.attachments.currentItems).toHaveLength(2);
    expect(question?.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-2'),
      }),
    ]);
  });

  it('should persist attachments when creating a question', async () => {
    const result = await sut.execute({
      attachmentsIds: ['attachment-1', 'attachment-2'],
      authorId: 'author-1',
      content: 'Example question content',
      title: 'Example question',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryQuestionAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('attachment-1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('attachment-2'),
        }),
      ]),
    );
  });
});
