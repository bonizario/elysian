import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

describe('Fetch Recent Questions (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();

    jwt = moduleRef.get(JwtService);

    prisma = moduleRef.get(PrismaService);

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  test('[GET] /questions', async () => {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'johndoe@example.com',
        password: '123456',
      },
    });

    const accessToken = jwt.sign({ sub: user.id });

    await prisma.question.createMany({
      data: [
        {
          title: 'Question 01',
          content: 'Question 01 content',
          slug: 'question-01',
          authorId: user.id,
        },
        {
          title: 'Question 02',
          content: 'Question 02 content',
          slug: 'question-02',
          authorId: user.id,
        },
      ],
    });

    const response = await request(app.getHttpServer())
      .get('/questions')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      questions: [
        expect.objectContaining({ slug: 'question-01' }),
        expect.objectContaining({ slug: 'question-02' }),
      ],
    });
  });
});
