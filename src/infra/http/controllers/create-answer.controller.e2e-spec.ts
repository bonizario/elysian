import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { AnswerAttachmentFactory } from '@/test/factories/make-answer-attachment';
import { AttachmentFactory } from '@/test/factories/make-attachment';
import { QuestionFactory } from '@/test/factories/make-question';
import { StudentFactory } from '@/test/factories/make-student';

describe('Create Answer (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let attachmentFactory: AttachmentFactory;
  let questionFactory: QuestionFactory;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AnswerAttachmentFactory,
        AttachmentFactory,
        QuestionFactory,
        StudentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /questions/:questionId/answers', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toValue() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const questionId = question.id.toValue();

    const attachment1 = await attachmentFactory.makePrismaAttachment();

    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .post(`/questions/${questionId}/answers`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachments: [attachment1.id.toValue(), attachment2.id.toValue()],
        content: 'Answer content',
      });

    expect(response.statusCode).toBe(201);

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: 'Answer content',
      },
    });

    expect(answerOnDatabase).toBeTruthy();

    const answerAttachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        answerId: answerOnDatabase?.id,
      },
    });

    expect(answerAttachmentsOnDatabase).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: attachment1.id.toValue(),
        }),
        expect.objectContaining({
          id: attachment2.id.toValue(),
        }),
      ]),
    );
  });
});
