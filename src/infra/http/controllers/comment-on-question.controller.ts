import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Post,
} from '@nestjs/common';
import { z } from 'zod';

import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question.use-case';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';

const commentOnQuestionBodySchema = z.object({
  content: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(commentOnQuestionBodySchema);

type CommentOnQuestionBody = z.infer<typeof commentOnQuestionBodySchema>;

@Controller('/questions/:questionId/comments')
export class CommentOnQuestionController {
  constructor(private readonly commentOnQuestion: CommentOnQuestionUseCase) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CommentOnQuestionBody,
    @Param('questionId') questionId: string,
  ) {
    const { content } = body;

    const authorId = user.sub;

    const result = await this.commentOnQuestion.execute({
      authorId,
      questionId,
      content,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }
  }
}
