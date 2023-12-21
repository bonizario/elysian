import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { makeAnswerComment } from '@/test/factories/make-answer-comment';
import { makeStudent } from '@/test/factories/make-student';
import { InMemoryAnswerCommentsRepository } from '@/test/repositories/in-memory-answer-comments.repository';
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students.repository';

import { FetchAnswerCommentsUseCase } from './fetch-answer-comments.use-case';

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchAnswerCommentsUseCase;

describe('Fetch Answer Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(
      inMemoryStudentsRepository,
    );

    sut = new FetchAnswerCommentsUseCase(inMemoryAnswerCommentsRepository);
  });

  it('should be able to fetch answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    await inMemoryStudentsRepository.create(student);

    const comment1 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    });

    const comment2 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    });

    const comment3 = makeAnswerComment({
      answerId: new UniqueEntityID('answer-1'),
      authorId: student.id,
    });

    await inMemoryAnswerCommentsRepository.create(comment1);

    await inMemoryAnswerCommentsRepository.create(comment2);

    await inMemoryAnswerCommentsRepository.create(comment3);

    const result = await sut.execute({
      answerId: 'answer-1',
      limit: 20,
      page: 0,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          authorName: 'John Doe',
          commentId: comment1.id,
        }),
        expect.objectContaining({
          authorName: 'John Doe',
          commentId: comment2.id,
        }),
        expect.objectContaining({
          authorName: 'John Doe',
          commentId: comment3.id,
        }),
      ]),
    );
  });

  it('should be able to fetch paginated answer comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    await inMemoryStudentsRepository.create(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryAnswerCommentsRepository.create(
        makeAnswerComment({
          answerId: new UniqueEntityID('answer-1'),
          authorId: student.id,
        }),
      );
    }

    const result = await sut.execute({
      answerId: 'answer-1',
      limit: 20,
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(2);
  });
});
