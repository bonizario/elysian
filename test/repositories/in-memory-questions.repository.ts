import { DomainEvents } from '@/core/events/domain-events';
import type { PaginationParams } from '@/core/repositories/pagination-params';

import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import type { Question } from '@/domain/forum/enterprise/entities/question';
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details';

import { InMemoryAttachmentsRepository } from './in-memory-attachments.repository';
import { InMemoryQuestionAttachmentsRepository } from './in-memory-question-attachments.repository';
import { InMemoryStudentsRepository } from './in-memory-students.repository';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(
    private readonly attachmentsRepository: InMemoryAttachmentsRepository,
    private readonly questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository,
    private readonly studentsRepository: InMemoryStudentsRepository,
  ) {}

  async create(question: Question) {
    this.items.push(question);

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }

  async delete(question: Question) {
    const itemIndex = this.items.findIndex((item) =>
      item.id.equals(question.id),
    );

    this.items.splice(itemIndex, 1);

    await this.questionAttachmentsRepository.deleteManyByQuestionId(
      question.id.toValue(),
    );
  }

  async findById(id: string) {
    return this.items.find((item) => item.id.toValue() === id) ?? null;
  }

  async findBySlug(slug: string) {
    return this.items.find((item) => item.slug.value === slug) ?? null;
  }

  async findDetailsBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug);

    if (!question) {
      return null;
    }

    const author = this.studentsRepository.items.find((student) =>
      student.id.equals(question.authorId),
    );

    if (!author) {
      throw new Error(
        `Author with ID "${question.authorId.toValue()}" does not exist`,
      );
    }

    const questionAttachments = this.questionAttachmentsRepository.items.filter(
      (questionAttachment) => questionAttachment.questionId.equals(question.id),
    );

    const attachments = questionAttachments.map((questionAttachment) => {
      const attachment = this.attachmentsRepository.items.find((attachment) =>
        attachment.id.equals(questionAttachment.attachmentId),
      );

      if (!attachment) {
        throw new Error(
          `Attachment with ID "${questionAttachment.attachmentId.toValue()}" does not exist`,
        );
      }

      return attachment;
    });

    return QuestionDetails.create({
      authorId: author.id,
      bestAnswerId: question.bestAnswerId ?? null,
      questionId: question.id,
      attachments,
      authorName: author.name,
      content: question.content,
      slug: question.slug,
      title: question.title,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt ?? null,
    });
  }

  async findManyRecent({ limit, page }: PaginationParams) {
    return this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(page * limit, (page + 1) * limit);
  }

  async save(question: Question) {
    const itemIndex = this.items.findIndex(
      (item) => item.id.toValue() === question.id.toValue(),
    );

    this.items[itemIndex] = question;

    await this.questionAttachmentsRepository.createMany(
      question.attachments.getNewItems(),
    );

    await this.questionAttachmentsRepository.deleteMany(
      question.attachments.getRemovedItems(),
    );

    DomainEvents.dispatchEventsForAggregate(question.id);
  }
}
