import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';

import { makeAnswer } from '@/test/factories/make-answer';
import { makeAnswerAttachment } from '@/test/factories/make-answer-attachment';
import { InMemoryAnswerAttachmentsRepository } from '@/test/repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from '@/test/repositories/in-memory-answers.repository';

import { EditAnswerUseCase } from './edit-answer.use-case';

let inMemoryAnswerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let inMemoryAnswersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer', () => {
  beforeEach(() => {
    inMemoryAnswerAttachmentsRepository =
      new InMemoryAnswerAttachmentsRepository();

    inMemoryAnswersRepository = new InMemoryAnswersRepository(
      inMemoryAnswerAttachmentsRepository,
    );

    sut = new EditAnswerUseCase(
      inMemoryAnswerAttachmentsRepository,
      inMemoryAnswersRepository,
    );
  });

  it('should be able to edit an answer', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    );

    await inMemoryAnswersRepository.create(answer);

    await inMemoryAnswerAttachmentsRepository.createMany([
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('attachment-2'),
      }),
    ]);

    const result = await sut.execute({
      attachmentsIds: ['attachment-1', 'attachment-3'],
      answerId: answer.id.toValue(),
      authorId: answer.authorId.toValue(),
      content: 'New content',
    });

    const updatedAnswer = inMemoryAnswersRepository.items[0];

    expect(result.isRight()).toBe(true);
    expect(updatedAnswer).toMatchObject({
      content: 'New content',
    });
    expect(updatedAnswer?.attachments.currentItems).toHaveLength(2);
    expect(updatedAnswer?.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-3'),
      }),
    ]);
  });

  it('should not be able to edit an answer from another user', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    );

    await inMemoryAnswersRepository.create(answer);

    const result = await sut.execute({
      attachmentsIds: [],
      answerId: answer.id.toValue(),
      authorId: 'author-2',
      content: 'New content',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryAnswersRepository.items[0]?.content).toBe(answer.content);
  });

  it('should sync new and removed attachments when editing an answer', async () => {
    const answer = makeAnswer(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('answer-1'),
    );

    await inMemoryAnswersRepository.create(answer);

    await inMemoryAnswerAttachmentsRepository.createMany([
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      makeAnswerAttachment({
        answerId: answer.id,
        attachmentId: new UniqueEntityID('attachment-2'),
      }),
    ]);

    const result = await sut.execute({
      answerId: answer.id.toValue(),
      attachmentsIds: ['attachment-1', 'attachment-3'],
      authorId: answer.authorId.toValue(),
      content: 'New content',
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryAnswerAttachmentsRepository.items).toHaveLength(2);
    expect(inMemoryAnswerAttachmentsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          attachmentId: new UniqueEntityID('attachment-1'),
        }),
        expect.objectContaining({
          attachmentId: new UniqueEntityID('attachment-3'),
        }),
      ]),
    );
  });
});
