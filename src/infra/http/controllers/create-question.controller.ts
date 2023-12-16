import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';

import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.use-case';
import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

const createQuestionBodySchema = z.object({
  content: z.string(),
  title: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly createQuestion: CreateQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBody,
  ) {
    const { content, title } = body;

    const authorId = user.sub;

    await this.createQuestion.execute({
      attachmentsIds: [],
      authorId,
      content,
      title,
    });
  }
}
