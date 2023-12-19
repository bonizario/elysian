import type { AnswerCommentProps } from '@/domain/forum/enterprise/entities/answer-comment';
import { Comment } from '@/domain/forum/enterprise/entities/comment';
import type { QuestionCommentProps } from '@/domain/forum/enterprise/entities/question-comment';

export class CommentPresenter {
  static toHTTP(comment: Comment<AnswerCommentProps | QuestionCommentProps>) {
    return {
      id: comment.id.toValue(),
      content: comment.content,
      createdAt: comment.createdAt,
      updatedAt: comment.updatedAt,
    };
  }
}
