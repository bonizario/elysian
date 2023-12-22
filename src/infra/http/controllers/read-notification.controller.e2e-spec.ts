import { INestApplication } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test } from '@nestjs/testing';
import request from 'supertest';

import { AppModule } from '@/infra/app.module';
import { DatabaseModule } from '@/infra/database/database.module';
import { PrismaService } from '@/infra/database/prisma/prisma.service';

import { NotificationFactory } from 'test/factories/make-notification';
import { StudentFactory } from 'test/factories/make-student';

describe('Read notification (E2E)', () => {
  let app: INestApplication;
  let jwt: JwtService;
  let prisma: PrismaService;
  let notificationFactory: NotificationFactory;
  let studentFactory: StudentFactory;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [NotificationFactory, StudentFactory],
    }).compile();

    app = moduleRef.createNestApplication();
    jwt = moduleRef.get(JwtService);
    prisma = moduleRef.get(PrismaService);
    notificationFactory = moduleRef.get(NotificationFactory);
    studentFactory = moduleRef.get(StudentFactory);

    await app.init();
  });

  test('[PATCH] /notifications/:notificationId/read', async () => {
    const user = await studentFactory.makePrismaStudent({ name: 'John Doe' });

    const accessToken = jwt.sign({ sub: user.id.toValue() });

    const notification = await notificationFactory.makePrismaNotification({
      recipientId: user.id,
    });

    const notificationId = notification.id.toValue();

    const response = await request(app.getHttpServer())
      .patch(`/notifications/${notificationId}/read`)
      .set('Authorization', `Bearer ${accessToken}`);

    expect(response.statusCode).toBe(204);

    const notificationOnDatabase = await prisma.notification.findFirst({
      where: {
        recipientId: user.id.toValue(),
      },
    });

    expect(notificationOnDatabase?.readAt).toEqual(expect.any(Date));
  });
});
