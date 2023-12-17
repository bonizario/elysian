import { DomainEvents } from '@/core/events/domain-events';
import type { EventHandler } from '@/core/events/event-handler';

import type { AnswersRepository } from '@/domain/forum/application/repositories/answers.repository';
import { QuestionBestAnswerChosenEvent } from '@/domain/forum/enterprise/events/question-best-answer-chosen.event';
import type { SendNotificationUseCase } from '@/domain/notifications/application/use-cases/send-notification';

export class OnQuestionBestAnswerChosen implements EventHandler {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly sendNotification: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  public setupSubscriptions() {
    DomainEvents.register(
      this.sendQuestionBestAnswerNotification.bind(this),
      QuestionBestAnswerChosenEvent.name,
    );
  }

  private async sendQuestionBestAnswerNotification({
    bestAnswerId,
    question,
  }: QuestionBestAnswerChosenEvent) {
    const answer = await this.answersRepository.findById(
      bestAnswerId.toValue(),
    );

    if (answer) {
      const questionTitle = question.title.substring(0, 20).concat('...');

      await this.sendNotification.execute({
        recipientId: answer.authorId.toValue(),
        title: 'Sua resposta foi escolhida como a melhor!',
        content: `A resposta que você enviou em "${questionTitle}" foi escolhida como a melhor pelo autor!`,
      });
    }
  }
}
