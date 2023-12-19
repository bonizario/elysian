import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { AnswerFactory } from '@/test/factories/make-answer';
import { QuestionFactory } from '@/test/factories/make-question';
import { StudentFactory } from '@/test/factories/make-student';

describe('Comment On Answer (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let answerFactory: AnswerFactory;
  let questionFactory: QuestionFactory;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AnswerFactory, QuestionFactory, StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    answerFactory = moduleRef.get(AnswerFactory);
    questionFactory = moduleRef.get(QuestionFactory);
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test('[POST] /answers/:answersId/comments', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toValue() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      questionId: question.id,
      authorId: user.id,
    });

    const answerId = answer.id.toValue();

    const response = await request(app.getHttpServer())
      .post(`/answers/${answerId}/comments`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        content: 'Comment content',
      });

    expect(response.statusCode).toBe(201);

    const commentOnDatabase = await prisma.comment.findFirst({
      where: {
        content: 'Comment content',
      },
    });

    expect(commentOnDatabase).toBeTruthy();
  });
});
