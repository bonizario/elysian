import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { z } from 'zod';

import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.use-case';

import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { QuestionPresenter } from '@/infra/http/presenters/question.presenter';

const queryParamSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
  page: z.coerce.number().int().min(0).optional().default(0),
});

const queryValidationPipe = new ZodValidationPipe(queryParamSchema);

type QueryParam = z.infer<typeof queryParamSchema>;

@Controller('/questions')
export class FetchRecentQuestionsController {
  constructor(
    private readonly fetchRecentQuestions: FetchRecentQuestionsUseCase,
  ) {}

  @Get()
  async handle(@Query(queryValidationPipe) { limit, page }: QueryParam) {
    const result = await this.fetchRecentQuestions.execute({ limit, page });

    if (result.isLeft()) {
      throw new BadRequestException();
    }

    const questions = result.value.questions.map(QuestionPresenter.toHTTP);

    return {
      questions,
    };
  }
}
