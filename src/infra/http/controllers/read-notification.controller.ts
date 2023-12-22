import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification.use-case';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';

@Controller('/notifications/:notificationId/read')
export class ReadNotificationController {
  constructor(private readonly readNotification: ReadNotificationUseCase) {}

  @Patch()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('notificationId') notificationId: string,
  ) {
    const recipientId = user.sub;

    const result = await this.readNotification.execute({
      notificationId,
      recipientId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
