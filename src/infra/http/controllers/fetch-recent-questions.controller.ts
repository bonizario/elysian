import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';

import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import { PrismaService } from '@/infra/database/prisma/prisma.service';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';

const queryParamSchema = z.object({
  page: z.coerce.number().int().min(0).optional().default(0),
  limit: z.coerce.number().int().min(1).max(100).optional().default(20),
});

const queryValidationPipe = new ZodValidationPipe(queryParamSchema);

type QueryParam = z.infer<typeof queryParamSchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class FetchRecentQuestionsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async handle(@Query(queryValidationPipe) params: QueryParam) {
    const { page, limit } = params;

    const questions = await this.prisma.question.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      skip: page * limit,
      take: limit,
    });

    return {
      questions,
    };
  }
}
