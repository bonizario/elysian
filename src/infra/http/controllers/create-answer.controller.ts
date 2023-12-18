import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { z } from 'zod';

import { CreateAnswerUseCase } from '@/domain/forum/application/use-cases/create-answer.use-case';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

const createAnswerBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createAnswerBodySchema);

type CreateAnswerBody = z.infer<typeof createAnswerBodySchema>;

@Controller('/questions/:questionId/answers')
export class CreateAnswerController {
  constructor(private readonly createAnswer: CreateAnswerUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateAnswerBody,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body;

    const authorId = user.sub;

    const result = await this.createAnswer.execute({
      attachmentsIds: [],
      authorId,
      questionId,
      content,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
