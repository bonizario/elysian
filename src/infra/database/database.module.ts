import { Module } from '@nestjs/common';

import { PrismaService } from './prisma/prisma.service';
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments.repository';
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments.repository';
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers.repository';
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments.repository';
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments.repository';
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions.repository';

@Module({
  exports: [
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsRepository,
    PrismaService,
  ],
  providers: [
    PrismaAnswerAttachmentsRepository,
    PrismaAnswerCommentsRepository,
    PrismaAnswersRepository,
    PrismaQuestionAttachmentsRepository,
    PrismaQuestionCommentsRepository,
    PrismaQuestionsRepository,
    PrismaService,
  ],
})
export class DatabaseModule {}
