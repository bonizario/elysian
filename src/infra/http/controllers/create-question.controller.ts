import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { z } from 'zod';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard';
import type { UserPayload } from '@/infra/auth/jwt.strategy';
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe';
import { PrismaService } from '@/infra/prisma/prisma.service';

const createQuestionBodySchema = z.object({
  content: z.string(),
  title: z.string(),
});

const bodyValidationPipe = new ZodValidationPipe(createQuestionBodySchema);

type CreateQuestionBody = z.infer<typeof createQuestionBodySchema>;

@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  async handle(
    @CurrentUser() user: UserPayload,
    @Body(bodyValidationPipe) body: CreateQuestionBody,
  ) {
    const { content, title } = body;

    await this.prisma.question.create({
      data: {
        authorId: user.sub,
        content,
        slug: this.convertToSlug(title),
        title,
      },
    });
  }

  private convertToSlug(text: string) {
    return text
      .normalize('NFKD')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--/g, '-')
      .replace(/^-/, '')
      .replace(/-$/, '');
  }
}
