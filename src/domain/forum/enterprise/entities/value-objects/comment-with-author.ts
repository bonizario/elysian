import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

export interface CommentWithAuthorProps {
  authorId: UniqueEntityID;
  commentId: UniqueEntityID;
  authorName: string;
  content: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class CommentWithAuthor extends ValueObject<CommentWithAuthorProps> {
  get authorId() {
    return this.props.authorId;
  }

  get commentId() {
    return this.props.commentId;
  }

  get authorName() {
    return this.props.authorName;
  }

  get content() {
    return this.props.content;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: CommentWithAuthorProps) {
    return new CommentWithAuthor(props);
  }
}
