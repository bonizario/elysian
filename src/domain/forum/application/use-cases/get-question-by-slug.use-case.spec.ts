import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { makeQuestion } from '@/test/factories/make-question';
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions.repository';
import { GetQuestionBySlugUseCase } from './get-question-by-slug.use-case';

let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryQuestionAttachmentsRepository =
      new InMemoryQuestionAttachmentsRepository();

    inMemoryQuestionsRepository = new InMemoryQuestionsRepository(
      inMemoryQuestionAttachmentsRepository,
    );

    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to get a question by slug', async () => {
    const question = makeQuestion({
      slug: Slug.create('example-question'),
    });

    await inMemoryQuestionsRepository.create(question);

    const result = await sut.execute({
      slug: 'example-question',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toEqual({ question });
  });
});
