import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Param,
  Put,
} from '@nestjs/common';
import { z } from 'zod';

import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question.use-case';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

const editQuestionBodySchema = z.object({
  content: z.string(),
  title: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(editQuestionBodySchema);

type EditQuestionBody = z.infer<typeof editQuestionBodySchema>;

@Controller('/questions/:id')
export class EditQuestionController {
  constructor(private readonly editQuestion: EditQuestionUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: EditQuestionBody,
    @Param('id') questionId: string,
  ) {
    const { content, title } = body;

    const authorId = user.sub;

    const result = await this.editQuestion.execute({
      attachmentsIds: [],
      questionId,
      authorId,
      content,
      title,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
