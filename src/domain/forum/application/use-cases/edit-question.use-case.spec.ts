import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { makeQuestion } from '@/test/factories/make-question';
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment';
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions.repository';
import { EditQuestionUseCase } from './edit-question.use-case';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe('Edit Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    sut = new EditQuestionUseCase(
      inMemoryQuestionAttachmentsRepository,
      inMemoryQuestionsRepository,
    );
  });

  it('should be able to edit a question', async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    );

    await inMemoryQuestionsRepository.create(question);

    inMemoryQuestionAttachmentsRepository.items.push(
      makeQuestionAttachment({
        attachmentId: new UniqueEntityID('attachment-1'),
        questionId: question.id,
      }),
      makeQuestionAttachment({
        attachmentId: new UniqueEntityID('attachment-2'),
        questionId: question.id,
      }),
    );

    const result = await sut.execute({
      attachmentsIds: ['attachment-1', 'attachment-3'],
      authorId: question.authorId.toValue(),
      questionId: question.id.toValue(),
      content: 'New content',
      title: 'New title',
    });

    const updatedQuestion = inMemoryQuestionsRepository.items[0];

    expect(result.isRight()).toBe(true);
    expect(updatedQuestion).toMatchObject({
      content: 'New content',
      title: 'New title',
    });
    expect(updatedQuestion?.attachments.currentItems).toHaveLength(2);
    expect(updatedQuestion?.attachments.currentItems).toEqual([
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-1'),
      }),
      expect.objectContaining({
        attachmentId: new UniqueEntityID('attachment-3'),
      }),
    ]);
  });

  it('should not be able to edit a question from another user', async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    );

    await inMemoryQuestionsRepository.create(question);

    const result = await sut.execute({
      attachmentsIds: [],
      authorId: 'author-2',
      questionId: question.id.toValue(),
      content: 'New content',
      title: 'New title',
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
      content: question.content,
      title: question.title,
    });
  });
});
