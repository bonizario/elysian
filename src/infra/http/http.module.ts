import { Module } from '@nestjs/common';

import { AuthenticateStudentUseCase } from '@/domain/forum/application/use-cases/authenticate-student.use-case';
import { CreateAnswerUseCase } from '@/domain/forum/application/use-cases/create-answer.use-case';
import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question.use-case';
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer.use-case';
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question.use-case';
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer.use-case';
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question.use-case';
import { FetchRecentQuestionsUseCase } from '@/domain/forum/application/use-cases/fetch-recent-questions.use-case';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug.use-case';
import { RegisterStudentUseCase } from '@/domain/forum/application/use-cases/register-student.use-case';

import { CryptographyModule } from '@/infra/cryptography/cryptography.module';
import { DatabaseModule } from '@/infra/database/database.module';

import { AuthenticateController } from './controllers/authenticate.controller';
import { CreateAnswerController } from './controllers/create-answer.controller';
import { CreateQuestionController } from './controllers/create-question.controller';
import { DeleteAnswerController } from './controllers/delete-answer.controller';
import { DeleteQuestionController } from './controllers/delete-question.controller';
import { EditAnswerController } from './controllers/edit-answer.controller';
import { EditQuestionController } from './controllers/edit-question.controller';
import { FetchRecentQuestionsController } from './controllers/fetch-recent-questions.controller';
import { GetQuestionBySlugController } from './controllers/get-question-by-slug.controller';
import { RegisterStudentController } from './controllers/register-student.controller';

@Module({
  controllers: [
    AuthenticateController,
    CreateAnswerController,
    CreateQuestionController,
    DeleteAnswerController,
    DeleteQuestionController,
    EditAnswerController,
    EditQuestionController,
    FetchRecentQuestionsController,
    GetQuestionBySlugController,
    RegisterStudentController,
  ],
  imports: [DatabaseModule, CryptographyModule],
  providers: [
    AuthenticateStudentUseCase,
    CreateAnswerUseCase,
    CreateQuestionUseCase,
    DeleteAnswerUseCase,
    DeleteQuestionUseCase,
    EditAnswerUseCase,
    EditQuestionUseCase,
    FetchRecentQuestionsUseCase,
    GetQuestionBySlugUseCase,
    RegisterStudentUseCase,
  ],
})
export class HttpModule {}
