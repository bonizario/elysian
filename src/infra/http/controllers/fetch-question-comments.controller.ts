import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { z } from 'zod';

import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments.use-case';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { CommentPresenter } from '@/infra/http/presenters/comment.presenter';

const queryParamSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  page: z.coerce.number().int().min(0).optional().default(0),
});

const queryValidationPipe = new ZodValidationPipe(queryParamSchema);

type QueryParam = z.infer<typeof queryParamSchema>;

@Controller('/questions/:questionId/comments')
export class FetchQuestionCommentsController {
  constructor(
    private readonly fetchQuestionComments: FetchQuestionCommentsUseCase,
  ) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query(queryValidationPipe) { limit, page }: QueryParam,
  ) {
    const result = await this.fetchQuestionComments.execute({
      questionId,
      limit,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.questionComments.map(CommentPresenter.toHTTP);

    return {
      comments,
    };
  }
}
