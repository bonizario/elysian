import type { PaginationParams } from '@/core/repositories/pagination-params';

import type { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments.repository';
import type { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

import { InMemoryStudentsRepository } from './in-memory-students.repository';

export class InMemoryAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  public items: AnswerComment[] = [];

  constructor(
    private readonly studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(answerComment: AnswerComment) {
    this.items.push(answerComment);
  }

  async delete(answerComment: AnswerComment) {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(answerComment.id),
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

  async findManyByAnswerIdWithAuthor(
    answerId: string,
    { limit, page }: PaginationParams,
  ) {
    return this.items
      .filter((item) => item.answerId.toValue() === answerId)
      .slice(page * limit, (page + 1) * limit)
      .map((comment) => {
        const author = this.studentsRepository.items.find((student) =>
          student.id.equals(comment.authorId),
        );

        if (!author) {
          throw new Error(
            `Author with ID "${comment.authorId.toValue()}" does not exist`,
          );
        }

        return CommentWithAuthor.create({
          authorId: comment.authorId,
          commentId: comment.id,
          authorName: author.name,
          content: comment.content,
          createdAt: comment.createdAt,
          updatedAt: comment.updatedAt ?? null,
        });
      });
  }
}
