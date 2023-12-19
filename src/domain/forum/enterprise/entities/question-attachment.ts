import { Entity } from '@/core/entities/entity';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';

export interface QuestionAttachmentProps {
  attachmentId: UniqueEntityID;
  questionId: UniqueEntityID;
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get attachmentId() {
    return this.props.attachmentId;
  }

  get questionId() {
    return this.props.questionId;
  }

  static create(props: QuestionAttachmentProps, id?: UniqueEntityID) {
    return new QuestionAttachment(props, id);
  }
}
