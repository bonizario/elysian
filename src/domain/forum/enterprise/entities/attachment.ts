import { Entity } from '@/core/entities/entity';
import type { UniqueEntityID } from '@/core/entities/unique-entity-id';

interface AttachmentProps {
  title: string;
  url: string;
}

export class Attachment extends Entity<AttachmentProps> {
  get title() {
    return this.props.title;
  }

  get url() {
    return this.props.url;
  }

  static create(props: AttachmentProps, id?: UniqueEntityID) {
    return new Attachment(props, id);
  }
}
