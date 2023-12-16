import { WatchedList } from '@/core/entities/watched-list';
import type { QuestionAttachment } from './question-attachment';

export class QuestionAttachmentList extends WatchedList<QuestionAttachment> {
  public isEqual(a: QuestionAttachment, b: QuestionAttachment) {
    return a.attachmentId.equals(b.attachmentId);
  }
}
