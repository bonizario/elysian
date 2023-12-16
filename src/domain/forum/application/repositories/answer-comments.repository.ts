import type { PaginationParams } from '@/core/repositories/pagination-params';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export abstract class AnswerCommentsRepository {
  abstract create(answerComment: AnswerComment): Promise<void>;

  abstract delete(answerComment: AnswerComment): Promise<void>;

  abstract findById(id: string): Promise<AnswerComment | null>;

  abstract findManyByAnswerId(
    answerId: string,
    params: PaginationParams,
  ): Promise<AnswerComment[]>;
}
