import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { z } from 'zod';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer.use-case';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

const editAnswerBodySchema = z.object({
  attachments: z.array(z.string().uuid()).default([]),
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editAnswerBodySchema);

type EditAnswerBody = z.infer<typeof editAnswerBodySchema>;

@Controller('/answers/:id')
export class EditAnswerController {
  constructor(private readonly editAnswer: EditAnswerUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: EditAnswerBody,
    @Param('id') answerId: string,
  ) {
    const { attachments, content } = body;

    const authorId = user.sub;

    const result = await this.editAnswer.execute({
      answerId,
      attachmentsIds: attachments,
      authorId,
      content,
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
