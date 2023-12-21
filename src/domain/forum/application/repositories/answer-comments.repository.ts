import type { PaginationParams } from '@/core/repositories/pagination-params';

import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import type { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

export abstract class AnswerCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<void>;

  abstract delete(answerComment: AnswerComment): Promise<void>;

  abstract findById(id: string): Promise<AnswerComment | null>;

  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>;

  abstract findManyByAnswerIdWithAuthor(
    answerId: string,
    params: PaginationParams,
  ): Promise<CommentWithAuthor[]>;
}
