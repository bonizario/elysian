import { Question } from '@/domain/forum/enterprise/entities/question';

export class QuestionPresenter {
  static toHTTP(question: Question) {
    return {
      id: question.id.toValue(),
      title: question.title,
      slug: question.slug.value,
      bestAnswerId: question.bestAnswerId?.toValue() ?? null,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  }
}
