import type { PaginationParams } from '@/core/repositories/pagination-params';

import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = [];

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === answerComment.id.toValue(),
    );

    this.items.splice(itemIndex, 1);
  }

  async findById(id: string) {
    return this.items.find((item) => item.id.toValue() === id) ?? null;
  }

  async findManyByAnswerId(
    answerId: string,
    { limit, page }: PaginationParams,
  ) {
    return this.items
      .filter((item) => item.answerId.toValue() === answerId)
      .slice(page * limit, (page + 1) * limit);
  }
}
