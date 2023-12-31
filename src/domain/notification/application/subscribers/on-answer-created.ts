import { Injectable } from '@nestjs/common';

import { DomainEvents } from '@/core/events/domain-events';
import type { EventHandler } from '@/core/events/event-handler';

import { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import { AnswerCreatedEvent } from '@/domain/forum/enterprise/events/answer-created.event';
import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification.use-case';

@Injectable()
export class OnAnswerCreated implements EventHandler {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  public setupSubscriptions() {
    DomainEvents.register(
      this.sendNewAnswerNotification.bind(this),
      AnswerCreatedEvent.name,
    );
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent) {
    const question = await this.questionsRepository.findById(
      answer.questionId.toValue(),
    );

    if (question) {
      const questionTitle = question.title.substring(0, 20).concat('...');

      await this.sendNotification.execute({
        recipientId: question.authorId.toValue(),
        title: `Nova resposta em "${questionTitle}"`,
        content: answer.excerpt,
      });
    }
  }
}
