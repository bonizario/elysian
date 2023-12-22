import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  NotFoundException,
  Param,
} from '@nestjs/common';

import { NotAllowedError } from '@/core/errors/not-allowed-error';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { DeleteAnswerCommentUseCase } from '@/domain/forum/application/use-cases/delete-answer-comment.use-case';

import { CurrentUser } from '@/infra/auth/current-user.decorator';
import type { UserPayload } from '@/infra/auth/jwt.strategy';

@Controller('/answers/comments/:id')
export class DeleteAnswerCommentController {
  constructor(
    private readonly deleteAnswerComment: DeleteAnswerCommentUseCase,
  ) {}

  @Delete()
  @HttpCode(204)
  async handle(
    @CurrentUser() user: UserPayload,
    @Param('id') answerCommentId: string,
  ) {
    const authorId = user.sub;

    const result = await this.deleteAnswerComment.execute({
      answerCommentId,
      authorId,
    });

    if (result.isLeft()) {
      const error = result.value;

      switch (error.constructor) {
        case NotAllowedError:
        case ResourceNotFoundError:
          throw new NotFoundException(error.message);
        default:
          throw new BadRequestException(error.message);
      }
    }
  }
}
