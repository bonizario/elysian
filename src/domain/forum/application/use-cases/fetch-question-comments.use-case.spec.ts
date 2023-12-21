import { UniqueEntityID } from '@/core/entities/unique-entity-id';

import { makeQuestionComment } from '@/test/factories/make-question-comment';
import { makeStudent } from '@/test/factories/make-student';
import { InMemoryQuestionCommentsRepository } from '@/test/repositories/in-memory-question-comments.repository';
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students.repository';

import { FetchQuestionCommentsUseCase } from './fetch-question-comments.use-case';

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: FetchQuestionCommentsUseCase;

describe('Fetch Question Comments', () => {
  beforeEach(() => {
    inMemoryStudentsRepository = new InMemoryStudentsRepository();

    inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentsRepository(
      inMemoryStudentsRepository,
    );

    sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentsRepository);
  });

  it('should be able to fetch question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    await inMemoryStudentsRepository.create(student);

    const comment1 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('question-1'),
    });

    const comment2 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('question-1'),
    });

    const comment3 = makeQuestionComment({
      authorId: student.id,
      questionId: new UniqueEntityID('question-1'),
    });

    await inMemoryQuestionCommentsRepository.create(comment1);

    await inMemoryQuestionCommentsRepository.create(comment2);

    await inMemoryQuestionCommentsRepository.create(comment3);

    const result = await sut.execute({
      questionId: 'question-1',
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

  it('should be able to fetch paginated question comments', async () => {
    const student = makeStudent({ name: 'John Doe' });

    await inMemoryStudentsRepository.create(student);

    for (let i = 1; i <= 22; i++) {
      await inMemoryQuestionCommentsRepository.create(
        makeQuestionComment({
          authorId: student.id,
          questionId: new UniqueEntityID('question-1'),
        }),
      );
    }

    const result = await sut.execute({
      questionId: 'question-1',
      limit: 20,
      page: 1,
    });

    expect(result.isRight()).toBe(true);
    expect(result.value?.comments).toHaveLength(2);
  });
});
