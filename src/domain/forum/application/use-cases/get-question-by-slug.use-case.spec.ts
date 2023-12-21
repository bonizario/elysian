import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';

import { makeAttachment } from '@/test/factories/make-attachment';
import { makeQuestion } from '@/test/factories/make-question';
import { makeQuestionAttachment } from '@/test/factories/make-question-attachment';
import { makeStudent } from '@/test/factories/make-student';
import { InMemoryAttachmentsRepository } from '@/test/repositories/in-memory-attachments.repository';
import { InMemoryQuestionAttachmentsRepository } from '@/test/repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from '@/test/repositories/in-memory-questions.repository';
import { InMemoryStudentsRepository } from '@/test/repositories/in-memory-students.repository';

import { GetQuestionBySlugUseCase } from './get-question-by-slug.use-case';

let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository;
let inMemoryQuestionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let inMemoryQuestionsRepository: InMemoryQuestionsRepository;
let inMemoryStudentsRepository: InMemoryStudentsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
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

    sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository);
  });

  it('should be able to get a question by slug', async () => {
    const student = makeStudent({ name: 'John Doe' });

    await inMemoryStudentsRepository.create(student);

    const question = makeQuestion({
      authorId: student.id,
      slug: Slug.create('example-question'),
    });

    await inMemoryQuestionsRepository.create(question);

    const attachment = makeAttachment({
      title: 'Attachment title',
    });

    await inMemoryAttachmentsRepository.create(attachment);

    await inMemoryQuestionAttachmentsRepository.createMany([
      makeQuestionAttachment({
        attachmentId: attachment.id,
        questionId: question.id,
      }),
    ]);

    const result = await sut.execute({
      slug: 'example-question',
    });

    expect(result.isRight()).toBe(true);
    expect(result.value).toMatchObject({
      question: expect.objectContaining({
        authorName: 'John Doe',
        attachments: [
          expect.objectContaining({
            title: attachment.title,
          }),
        ],
        title: question.title,
      }),
    });
  });
});
