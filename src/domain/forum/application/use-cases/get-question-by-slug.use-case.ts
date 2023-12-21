import { Injectable } from '@nestjs/common';

import { left, right, type Either } from '@/core/either';
import { ResourceNotFoundError } from '@/core/errors/resource-not-found-error';

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import type { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

type GetQuestionBySlugUseCaseRequest = {
  slug: string;
};

type GetQuestionBySlugUseCaseResponse = Either<
  ResourceNotFoundError,
  {
    question: QuestionDetails;
  }
>;

@Injectable()
export class GetQuestionBySlugUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    slug,
  }: GetQuestionBySlugUseCaseRequest): Promise<GetQuestionBySlugUseCaseResponse> {
    const question = await this.questionsRepository.findDetailsBySlug(slug);

    if (!question) {
      return left(new ResourceNotFoundError());
    }

    return right({
      question,
    });
  }
}
