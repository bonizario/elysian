import { WatchedList } from '@/core/entities/watched-list';

import type { AnswerAttachment } from './answer-attachment';

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  public isEqual(a: AnswerAttachment, b: AnswerAttachment) {
    return a.attachmentId.equals(b.attachmentId);
  }
}
