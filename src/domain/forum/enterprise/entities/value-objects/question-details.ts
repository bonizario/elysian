import type { UniqueEntityID } from '@/core/entities/unique-entity-id';
import { ValueObject } from '@/core/entities/value-object';

import { Attachment } from '@/domain/forum/enterprise/entities/attachment';

import { Slug } from './slug';

export interface QuestionDetailsProps {
  authorId: UniqueEntityID;
  bestAnswerId: UniqueEntityID | null;
  questionId: UniqueEntityID;
  attachments: Attachment[];
  authorName: string;
  content: string;
  slug: Slug;
  title: string;
  createdAt: Date;
  updatedAt: Date | null;
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get authorId() {
    return this.props.authorId;
  }

  get bestAnswerId() {
    return this.props.bestAnswerId;
  }

  get questionId() {
    return this.props.questionId;
  }

  get attachments() {
    return this.props.attachments;
  }

  get authorName() {
    return this.props.authorName;
  }

  get content() {
    return this.props.content;
  }

  get slug() {
    return this.props.slug;
  }

  get title() {
    return this.props.title;
  }

  get createdAt() {
    return this.props.createdAt;
  }

  get updatedAt() {
    return this.props.updatedAt;
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props);
  }
}
