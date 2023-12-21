import type { PaginationParams } from '@/core/repositories/pagination-params';

import type { QuestionCommentsRepository } from '@/domain/forum/application/repositories/question-comments.repository';
import type { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment';
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author';

import { InMemoryStudentsRepository } from './in-memory-students.repository';

export class InMemoryQuestionCommentsRepository
  implements QuestionCommentsRepository
{
  public items: QuestionComment[] = [];

  constructor(
    private readonly studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(questionComment: QuestionComment) {
    this.items.push(questionComment);
  }

  async delete(questionComment: QuestionComment) {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(questionComment.id),
    );

    this.items.splice(itemIndex, 1);
  }

  async findById(id: string) {
    return this.items.find((item) => item.id.toValue() === id) ?? null;
  }

  async findManyByQuestionId(
    questionId: string,
    { limit, page }: PaginationParams,
  ) {
    return this.items
      .filter((item) => item.questionId.toValue() === questionId)
      .slice(page * limit, (page + 1) * limit);
  }

  async findManyByQuestionIdWithAuthor(
    questionId: string,
    { limit, page }: PaginationParams,
  ) {
    return this.items
      .filter((item) => item.questionId.toValue() === questionId)
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
