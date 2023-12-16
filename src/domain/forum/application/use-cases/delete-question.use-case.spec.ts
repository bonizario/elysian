import { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { makeQuestion } from '@/test/factories/make-question';
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment';
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions.repository';
import { DeleteQuestionUseCase } from './delete-question.use-case';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;

describe('Delete Question', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to delete a question', async () => {
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
      authorId: question.authorId.toValue(),
      questionId: question.id.toValue(),
    });

    expect(result.isRight()).toBe(true);
    expect(inMemoryQuestionsRepository.items).toHaveLength(0);
    expect(inMemoryQuestionAttachmentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question from another user', async () => {
    const question = makeQuestion(
      {
        authorId: new UniqueEntityID('author-1'),
      },
      new UniqueEntityID('question-1'),
    );

    await inMemoryQuestionsRepository.create(question);

    const result = await sut.execute({
      authorId: 'author-2',
      questionId: question.id.toValue(),
    });

    expect(result.isLeft()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
    expect(inMemoryQuestionsRepository.items).toHaveLength(1);
  });
});
