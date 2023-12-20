import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { AnswerFactory } from '@/test/factories/make-answer';
import { AnswerAttachmentFactory } from '@/test/factories/make-answer-attachment';
import { AttachmentFactory } from '@/test/factories/make-attachment';
import { QuestionFactory } from '@/test/factories/make-question';
import { StudentFactory } from '@/test/factories/make-student';

describe('Edit Answer (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let answerAttachmentFactory: AnswerAttachmentFactory;
  let answerFactory: AnswerFactory;
  let attachmentFactory: AttachmentFactory;
  let questionFactory: QuestionFactory;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [
        AnswerAttachmentFactory,
        AnswerFactory,
        AttachmentFactory,
        QuestionFactory,
        StudentFactory,
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    answerAttachmentFactory = moduleRef.get(AnswerAttachmentFactory);
    answerFactory = moduleRef.get(AnswerFactory);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test('[PUT] /answers/:id', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toValue() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const attachment1 = await attachmentFactory.makePrismaAttachment();

    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });

    const answerId = answer.id.toValue();

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment1.id,
    });

    await answerAttachmentFactory.makePrismaAnswerAttachment({
      answerId: answer.id,
      attachmentId: attachment2.id,
    });

    const attachment3 = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .put(`/answers/${answerId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachments: [attachment1.id.toValue(), attachment3.id.toValue()],
        content: 'New answer content',
      });

    expect(response.statusCode).toBe(204);

    const answerOnDatabase = await prisma.answer.findFirst({
      where: {
        content: 'New answer content',
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
          id: attachment3.id.toValue(),
        }),
      ]),
    );
  });
});
