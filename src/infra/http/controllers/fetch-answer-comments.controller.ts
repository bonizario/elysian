import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { z } from 'zod';

import { FetchAnswerCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-answer-comments.use-case';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { CommentWithAuthorPresenter } from '@/infra/http/presenters/comment-with-author.presenter';

const queryParamSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  page: z.coerce.number().int().min(0).optional().default(0),
});

const queryValidationPipe = new ZodValidationPipe(queryParamSchema);

type QueryParam = z.infer<typeof queryParamSchema>;

@Controller('/answers/:answerId/comments')
export class FetchAnswerCommentsController {
  constructor(
    private readonly fetchAnswerComments: FetchAnswerCommentsUseCase,
  ) {}

  @Get()
  async handle(
    @Param('answerId') answerId: string,
    @Query(queryValidationPipe) { limit, page }: QueryParam,
  ) {
    const result = await this.fetchAnswerComments.execute({
      answerId,
      limit,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const comments = result.value.comments.map(
      CommentWithAuthorPresenter.toHTTP,
    );

    return {
      comments,
    };
  }
}
