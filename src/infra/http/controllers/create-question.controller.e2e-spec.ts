import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { AttachmentFactory } from '@/test/factories/make-attachment';
import { StudentFactory } from '@/test/factories/make-student';

describe('Create Question (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let attachmentFactory: AttachmentFactory;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [AttachmentFactory, StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    attachmentFactory = moduleRef.get(AttachmentFactory);
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[POST] /questions', async () => {
    const user = await studentFactory.makePrismaStudent();

    const accessToken = jwt.sign({ sub: user.id.toValue() });

    const attachment1 = await attachmentFactory.makePrismaAttachment();

    const attachment2 = await attachmentFactory.makePrismaAttachment();

    const response = await request(app.getHttpServer())
      .post('/questions')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({
        attachments: [attachment1.id.toValue(), attachment2.id.toValue()],
        content: 'Question content',
        title: 'Question title',
      });

    expect(response.statusCode).toBe(201);

    const questionOnDatabase = await prisma.question.findFirst({
      where: {
        title: 'Question title',
      },
    });

    expect(questionOnDatabase).toBeTruthy();

    const attachmentsOnDatabase = await prisma.attachment.findMany({
      where: {
        questionId: questionOnDatabase?.id,
      },
    });

    expect(attachmentsOnDatabase).toHaveLength(2);
  });
});
