import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { DomainEvents } from '@/core/events/domain-events';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { AnswerFactory } from 'test/factories/make-answer';
import { QuestionFactory } from 'test/factories/make-question';
import { StudentFactory } from 'test/factories/make-student';
import { waitFor } from 'test/utils/wait-for';

describe('On Question Best Answer Chosen (E2E)', () => {
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

    DomainEvents.shouldRun = true;

    await app.init();
  });

  it('should send a notification when the question best answer is chosen', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toString() });

    const question = await questionFactory.makePrismaQuestion({
      authorId: user.id,
    });

    const answer = await answerFactory.makePrismaAnswer({
      authorId: user.id,
      questionId: question.id,
    });

    const answerId = answer.id.toString();

    await request(app.getHttpServer())
      .patch(`/answers/${answerId}/choose-as-best`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    await waitFor(async () => {
      const notificationOnDatabase = await prisma.notification.findFirst({
        where: {
          recipientId: user.id.toString(),
        },
      });

      expect(notificationOnDatabase).not.toBeNull();
    });
  });
});
