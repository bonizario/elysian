import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

import { AttachmentPresenter } from './attachment.presenter';

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      authorId: questionDetails.authorId.toValue(),
      bestAnswerId: questionDetails.bestAnswerId?.toValue() ?? null,
      questionId: questionDetails.questionId.toValue(),
      attachments: questionDetails.attachments.map(AttachmentPresenter.toHTTP),
      authorName: questionDetails.authorName,
      content: questionDetails.content,
      slug: questionDetails.slug.value,
      title: questionDetails.title,
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updatedAt,
    };
  }
}
