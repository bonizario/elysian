import { Entity } from '@/core/entities/entity';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface AttachmentProps {
  link: string;
  title: string;
}

export class Attachment extends Entity<AttachmentProps> {
  get link() {
    return this.props.link;
  }

  get title() {
    return this.props.title;
  }

  static create(props: AttachmentProps, id?: UniqueEntityID) {
    return new Attachment(props, id);
  }
}
