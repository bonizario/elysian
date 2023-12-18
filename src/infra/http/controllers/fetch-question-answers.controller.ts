import {
  BadRequestException,
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { z } from 'zod';

import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers.use-case';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe';
import { AnswerPresenter } from '@/infra/http/presenters/answer.presenter';

const queryParamSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  page: z.coerce.number().int().min(0).optional().default(0),
});

const queryValidationPipe = new ZodValidationPipe(queryParamSchema);

type QueryParam = z.infer<typeof queryParamSchema>;

@Controller('/questions/:questionId/answers')
export class FetchQuestionAnswersController {
  constructor(
    private readonly fetchQuestionAnswers: FetchQuestionAnswersUseCase,
  ) {}

  @Get()
  async handle(
    @Param('questionId') questionId: string,
    @Query(queryValidationPipe) { limit, page }: QueryParam,
  ) {
    const result = await this.fetchQuestionAnswers.execute({
      questionId,
      limit,
      page,
    });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const answers = result.value.answers.map(AnswerPresenter.toHTTP);

    return {
      answers,
    };
  }
}
